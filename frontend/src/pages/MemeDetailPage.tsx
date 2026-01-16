import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMemeById, castVote, addComment } from '../features/memes/api/memes';
import { useAuth } from '../contexts/AuthContext';
import { UPLOADS_BASE_URL } from '../config';

const MemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  const { data: meme, isLoading, isError } = useQuery({
    queryKey: ['meme', id],
    queryFn: () => getMemeById(id!),
    enabled: !!id,
  });

  const voteMutation = useMutation({
    mutationFn: (value: number) => castVote(parseInt(id!, 10), value, localStorage.getItem('token')!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meme', id] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (text: string) => addComment(parseInt(id!, 10), text, localStorage.getItem('token')!),
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['meme', id] });
    },
  });

  const handleVote = (value: number) => {
    if (!isAuthenticated) return;
    voteMutation.mutate(value);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    commentMutation.mutate(commentText);
  };

  if (isLoading) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (isError || !meme) return <div className="alert alert-error">Meme not found</div>;

  const userVote = meme.votes.find((v: any) => v.userId === user?.id)?.value;
  const score = meme.score;

  const backLocation = location.state?.from || { pathname: '/' };
  const backText = location.state?.from ? 'Back to Gallery' : 'Home';

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="text-sm breadcrumbs mb-6">
        <ul>
          <li>
            <Link to={backLocation} className="font-medium hover:text-primary transition-colors">
              {backText}
            </Link>
          </li>
          <li>{meme.title}</li>
        </ul>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Image */}
        <div className="lg:w-3/5 xl:w-1/2">
          <div className="card bg-base-100 shadow-2xl border border-base-200 overflow-hidden">
            <figure className="bg-neutral flex justify-center items-center min-h-[400px]">
              <img src={`${UPLOADS_BASE_URL}${meme.imageUrl}`} alt={meme.title} className="max-w-full h-auto" />
            </figure>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2">{meme.title}</h1>
              <p className="text-base-content/70 mb-4">{meme.description || 'No description provided.'}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {meme.tags.map((tag: any) => (
                  <span key={tag.name} className="badge badge-primary badge-outline">#{tag.name}</span>
                ))}
              </div>

              <div className="flex items-center gap-6 border-t border-base-200 pt-6">
                <div className="flex flex-col items-center gap-1">
                  <button 
                    name="upvote-button"
                    onClick={() => handleVote(1)}
                    disabled={!isAuthenticated || voteMutation.isPending}
                    className={`btn btn-circle btn-ghost ${userVote === 1 ? 'text-orange-500 bg-orange-50' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill={userVote === 1 ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
                    </svg>
                  </button>
                  <span className={`text-xl font-bold ${score > 0 ? 'text-orange-500' : score < 0 ? 'text-blue-500' : ''}`}>
                    {score}
                  </span>
                  <button 
                    name="downvote-button"
                    onClick={() => handleVote(-1)}
                    disabled={!isAuthenticated || voteMutation.isPending}
                    className={`btn btn-circle btn-ghost ${userVote === -1 ? 'text-blue-500 bg-blue-50' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill={userVote === -1 ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 rotate-180">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1">
                  <p className="text-sm opacity-60">Posted by</p>
                  <p className="font-bold text-lg">{meme.user.username}</p>
                  <p className="text-xs opacity-50">{new Date(meme.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Comments */}
        <div className="lg:w-2/5 xl:w-1/2 flex flex-col gap-6">
          <div className="card bg-base-100 shadow-xl border border-base-200 flex-1 flex flex-col">
            <div className="p-6 border-b border-base-200">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Comments 
                <span className="badge badge-neutral">{meme._count.comments}</span>
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[500px]">
              {(!meme.comments || meme.comments.length === 0) ? (
                <div className="text-center py-10 opacity-40">
                  <p>No comments yet.</p>
                  <p className="text-sm">Be the first to share your thoughts!</p>
                </div>
              ) : (
                (meme.comments || []).map((comment: any) => (
                  <div key={comment.id} className="bg-base-200/50 p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm text-primary">{comment.user.username}</span>
                      <span className="text-[10px] opacity-40">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-base-200">
              {isAuthenticated ? (
                <form onSubmit={handleCommentSubmit} className="space-y-3">
                  <textarea 
                    className="textarea textarea-bordered w-full resize-none h-24" 
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                  <button 
                    type="submit" 
                    className="btn btn-primary w-full"
                    disabled={commentMutation.isPending}
                  >
                    Post Comment
                  </button>
                </form>
              ) : (
                <div className="text-center p-4 bg-base-200 rounded-lg">
                  <p className="text-sm mb-2">Log in to join the conversation</p>
                  <Link to="/auth" className="btn btn-sm btn-outline btn-primary">Login / Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeDetailPage;
