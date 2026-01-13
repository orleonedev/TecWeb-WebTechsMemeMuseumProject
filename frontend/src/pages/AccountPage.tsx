import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getMemes } from '../features/memes/api/memes';
import MemeGrid from '../features/memes/components/MemeGrid';
import { deleteUser } from '../features/auth/api/auth';
import { useNavigate } from 'react-router-dom';

const AccountPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: userMemes, isLoading, isError } = useQuery({
    queryKey: ['userMemes', user?.id],
    queryFn: () => getMemes({ userId: user?.id?.toString() }), 
    enabled: isAuthenticated && !!user?.id,
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId, localStorage.getItem('token')!),
    onSuccess: () => {
      logout();
      queryClient.invalidateQueries();
      navigate('/');
      alert('Your account has been successfully deleted.');
    },
    onError: (error) => {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    },
  });

  const handleDeleteAccount = () => {
    if (user?.id && confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      deleteUserMutation.mutate(user.id.toString());
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg">Please log in to view your account details.</p>
        <button onClick={() => navigate('/auth')} className="btn btn-primary mt-6">Go to Login</button>
      </div>
    );
  }

  if (isLoading) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (isError) return <div className="alert alert-error">Error loading account data.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8">Account Settings</h1>

      <div className="card bg-base-100 shadow-xl border border-base-200 mb-8">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Profile Information</h2>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          {/* Add more user info as needed */}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6">Your Uploaded Memes</h2>
        {userMemes?.memes && userMemes.memes.length > 0 ? (
          <MemeGrid memes={userMemes.memes} />
        ) : (
          <div className="text-center py-10 text-base-content/50">
            <p className="text-xl font-medium">You haven't uploaded any memes yet.</p>
            <p>Share your creativity with the world!</p>
            <button onClick={() => navigate('/upload')} className="btn btn-primary mt-6">Upload Your First Meme</button>
          </div>
        )}
      </div>

      <div className="card bg-error-content shadow-xl border border-error/50">
        <div className="card-body">
          <h2 className="card-title text-2xl text-error">Danger Zone</h2>
          <p className="text-error/80">Deleting your account is a permanent action and cannot be undone.</p>
          <div className="card-actions justify-end mt-4">
            <button 
              onClick={handleDeleteAccount} 
              className="btn btn-error text-white"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete My Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
