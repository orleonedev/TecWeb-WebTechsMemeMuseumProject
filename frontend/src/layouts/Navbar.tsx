import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/');
    }
  };

  const closeDropdown = () => {
    const elem = document.activeElement;
    if (elem instanceof HTMLElement) {
      elem.blur();
    }
  };

  return (
    <div className="navbar bg-base-200 shadow-sm px-4 md:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} onClick={closeDropdown} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-300 rounded-box w-52">
            <li><Link to="/meme-of-the-day">Meme of the Day</Link></li>
            {isAuthenticated && <li><Link to="/upload">Upload</Link></li>}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl font-bold text-primary">MemeMuseum</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><Link to="/meme-of-the-day" className="rounded-lg">Meme of the Day</Link></li>
          {isAuthenticated && <li><Link to="/upload" className="rounded-lg">Upload</Link></li>}
        </ul>
      </div>
      <div className="navbar-end gap-4">
        <form onSubmit={handleSearch} className="form-control hidden sm:block">
          <input 
            type="text" 
            placeholder="Search memes..." 
            className="input input-bordered w-24 sm:w-auto h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-10 flex items-center justify-center">
              {isAuthenticated && user ? (
                <span className="text-xl uppercase">{user.username.charAt(0)}</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              )}
            </div>
          </label>
          <ul tabIndex={0} onClick={closeDropdown} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-300 rounded-box w-52">
            {isAuthenticated ? (
              <>
                <li className="menu-title px-4 py-2 opacity-50">Hello, {user?.username}</li>
                <li><Link to="/account">Account Settings</Link></li>
                <li><button onClick={handleLogout} className="text-error">Logout</button></li>
              </>
            ) : (
              <li><Link to="/auth" className="font-bold">Login / Register</Link></li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
