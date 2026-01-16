import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { castVote } from '../api/memes';
import { useNavigate } from 'react-router-dom';
import { MemeDto } from '../../../shared/types';

export const useVote = (meme: MemeDto) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const initialUserVote = user && meme.votes ? meme.votes.find(v => v.userId === user.id)?.value || 0 : 0;

  const [score, setScore] = useState(meme.score);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    setScore(meme.score);
    setUserVote(user && meme.votes ? meme.votes.find(v => v.userId === user.id)?.value || 0 : 0);
  }, [meme.score, meme.votes, user]);

  const handleVote = async (value: number) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (isVoting) return;

    const previousScore = score;
    const previousUserVote = userVote;
    
    let newScore = score;
    let newUserVote = value;

    if (userVote === value) {
      newScore -= value;
      newUserVote = 0;
    } else {
      newScore = score - userVote + value;
    }

    setScore(newScore);
    setUserVote(newUserVote);
    setIsVoting(true);

    try {
      await castVote(meme.id, value);
    } catch (error) {
      setScore(previousScore);
      setUserVote(previousUserVote);
      console.error('Failed to vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return { score, userVote, isVoting, handleVote };
};
