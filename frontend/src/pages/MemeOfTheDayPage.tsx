import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMemeOfTheDay } from '../features/memes/api/memes';
import { Link } from 'react-router-dom';
import { UPLOADS_BASE_URL } from '../config';

const MemeOfTheDayPage: React.FC = () => {
  const { data: meme, isLoading, isError } = useQuery({
    queryKey: ['meme-of-the-day'],
    queryFn: getMemeOfTheDay,
  });

  if (isLoading) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (isError || !meme) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="alert alert-warning max-w-md mx-auto">
        <span>No memes available yet to be "Meme of the Day".</span>
      </div>
      <Link to="/" className="btn btn-primary mt-8">Back to Gallery</Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary uppercase tracking-widest">
          Meme of the Day
        </h1>
        <p className="text-xl opacity-60">Handpicked by our algorithm for your entertainment.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="card lg:card-side bg-base-100 shadow-2xl border-4 border-primary/20 overflow-hidden">
          <figure className="lg:w-1/2 bg-black">
            <img src={`${UPLOADS_BASE_URL}${meme.imageUrl}`} alt={meme.title} className="w-full h-full object-contain" />
          </figure>
          <div className="card-body lg:w-1/2 justify-center">
            <div className="badge badge-secondary mb-2">FEATURED</div>
            <h2 className="card-title text-4xl font-bold mb-4">{meme.title}</h2>
            <p className="text-lg opacity-80 mb-6">{meme.description || "The algorithm has chosen this masterpiece for today."}</p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {meme.tags.map((tag: any) => (
                <span key={tag.name} className="badge badge-lg badge-outline">#{tag.name}</span>
              ))}
            </div>

            <div className="card-actions justify-end">
              <Link to={`/memes/${meme.id}`} className="btn btn-primary btn-lg">View Full Details & Comments</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeOfTheDayPage;
