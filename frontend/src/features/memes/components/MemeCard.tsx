import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { castVote } from '../api/memes';
import { UPLOADS_BASE_URL } from '../../../config';
import { MemeDto } from '../../../shared/types';

interface MemeCardProps {
  meme: MemeDto;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialScore = meme.score;
  const initialUserVote = user && meme.votes ? meme.votes.find(v => v.userId === user.id)?.value || 0 : 0;

  const [score, setScore] = useState(initialScore);
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
      const token = localStorage.getItem('token');
      if (token) {
        await castVote(meme.id, value, token);
      }
    } catch (error) {
      setScore(previousScore);
      setUserVote(previousUserVote);
      console.error('Failed to vote:', error);
    } finally {
      setIsVoting(false);
    }
  };
  
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-200 overflow-hidden group">
      <Link to={`/memes/${meme.id}`} state={{ from: location }}>
        <figure className="relative pt-[100%] overflow-hidden">
          <img 
            src={`${UPLOADS_BASE_URL}${meme.imageUrl}`} 
            alt={meme.title} 
            className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </figure>
      </Link>
      
      <div className="card-body p-4 gap-1">
        <h2 className="card-title text-base font-bold line-clamp-1">
          {meme.title}
        </h2>
        
        <div className="flex flex-wrap gap-1 mt-1">
          {meme.tags.map(tag => (
            <span key={tag.name} className="badge badge-sm badge-primary badge-outline opacity-70">
              #{tag.name}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between mt-3 gap-y-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-base-200 rounded-full px-2 py-1">
              <button 
                onClick={(e) => { e.preventDefault(); handleVote(1); }}
                className={`btn btn-ghost btn-xs btn-circle ${userVote === 1 ? 'text-orange-500' : 'text-base-content/70'}`}
                disabled={isVoting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill={userVote === 1 ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
                </svg>
              </button>
              
              <span className={`text-sm font-bold min-w-[20px] text-center ${userVote === 1 ? 'text-orange-500' : userVote === -1 ? 'text-blue-500' : ''}`}>
                {score}
              </span>

              <button 
                onClick={(e) => { e.preventDefault(); handleVote(-1); }}
                className={`btn btn-ghost btn-xs btn-circle ${userVote === -1 ? 'text-blue-500' : 'text-base-content/70'}`}
                disabled={isVoting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill={userVote === -1 ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 rotate-180">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-1 text-sm text-base-content/60">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              {meme._count.comments}
            </div>
          </div>
          <span className="text-xs text-base-content/50 italic">by {meme.user.username}</span>
        </div>
      </div>
    </div>
  );
};

export default MemeCard;
