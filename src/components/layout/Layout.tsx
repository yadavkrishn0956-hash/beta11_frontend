import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-hero">
      {/* 3D Floating Pills */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="floating-pill pill-blue w-32 h-16 top-20 right-10 opacity-20" style={{ animationDelay: '0s' }}></div>
        <div className="floating-pill pill-white w-24 h-12 top-40 right-32 opacity-30" style={{ animationDelay: '1s' }}></div>
        <div className="floating-pill pill-blue w-20 h-10 bottom-32 right-20 opacity-15" style={{ animationDelay: '2s' }}></div>
        <div className="floating-pill pill-white w-28 h-14 bottom-20 left-20 opacity-25" style={{ animationDelay: '1.5s' }}></div>
        <div className="floating-pill pill-blue w-16 h-8 top-60 left-40 opacity-20" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
