import React, { useState } from 'react';
import { Icon } from '../shared/Icon';
import { motion } from 'framer-motion';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4 shadow-soft">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            aria-label="Toggle menu"
          >
            <Icon name="menu" size={24} />
          </button>
          
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <span className="text-3xl">🏥</span>
            MediTrust AI
          </h1>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Icon 
              name="search" 
              size={20} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
            />
            <input
              type="search"
              placeholder="Search patients, records..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all relative"
            aria-label="Notifications"
          >
            <Icon name="bell" size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true" />
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition-all"
              aria-expanded={showDropdown}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <Icon name="user" size={20} className="text-white" />
              </div>
              <Icon name="chevron-down" size={16} className="text-gray-600" />
            </motion.button>

            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card py-1 border border-gray-100"
              >
                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1">
                  Profile
                </a>
                <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1">
                  Settings
                </a>
                <hr className="my-1 border-gray-100" />
                <a href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg mx-1">
                  Logout
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
