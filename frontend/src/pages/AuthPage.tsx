import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser, loginUser } from '../features/auth/api/auth';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [apiError, setApiError] = useState<any>(null);

  const loginMutation = useMutation({
    mutationFn: () => loginUser({ email: loginEmail, password: loginPassword }),
    onSuccess: (data) => {
      login(data.token);
      navigate('/');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
      setApiError(errorMessage);
    },
  });

  const registerMutation = useMutation({
    mutationFn: () => registerUser({ email: registerEmail, username: registerUsername, password: registerPassword }),
    onSuccess: () => {
      loginMutation.mutate();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
      setApiError(errorMessage);
    },
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    loginEmail === '' && setLoginEmail(registerEmail);
    loginPassword === '' && setLoginPassword(registerPassword);
    registerMutation.mutate();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    loginMutation.mutate();
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Join MemeMuseum</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Registration Form */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-8">
            <h2 className="card-title text-2xl mb-4">Create Account</h2>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Username</span>
                </label>
                <input 
                  name="username"
                  type="text" 
                  placeholder="memelover99"
                  value={registerUsername} 
                  onChange={(e) => setRegisterUsername(e.target.value)} 
                  className="input input-bordered focus:input-primary" 
                  required 
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  value={registerEmail} 
                  onChange={(e) => setRegisterEmail(e.target.value)} 
                  className="input input-bordered focus:input-primary" 
                  required 
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={registerPassword} 
                  onChange={(e) => setRegisterPassword(e.target.value)} 
                  className="input input-bordered focus:input-primary" 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-full mt-2" disabled={registerMutation.isPending || loginMutation.isPending}>
                {registerMutation.isPending ? <span className="loading loading-spinner"></span> : 'Register'}
              </button>
            </form>
          </div>
        </div>

        {/* Login Form */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-8">
            <h2 className="card-title text-2xl mb-4">Welcome Back</h2>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  className="input input-bordered focus:input-primary" 
                  required 
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  className="input input-bordered focus:input-primary" 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-full mt-2" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? <span className="loading loading-spinner"></span> : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* API Response/Error Display */}
      {apiError && (
        <div className="toast toast-top toast-center mt-4">
          <div className="alert alert-error shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{apiError}</span>
            <button className="btn btn-ghost btn-xs" onClick={() => setApiError(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
