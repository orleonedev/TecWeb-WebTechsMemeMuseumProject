import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>2024/2025 Web Technologies @ UNINA - WebTech's MemeMuseum - Oreste Leone N86/1980</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
