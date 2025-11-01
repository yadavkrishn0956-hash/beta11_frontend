import React from 'react';
import { Icon, IconName } from '../shared/Icon';
import { motion } from 'framer-motion';

interface MenuItem {
  id: string;
  label: string;
  icon: IconName;
  path: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems: MenuItem[] = [
  { id: 'overview', label: 'Overview', icon: 'dashboard', path: '/' },
  { id: 'records', label: 'Records', icon: 'records', path: '/records' },
  { id: 'ai-center', label: 'AI Center', icon: 'dashboard', path: '/ai-center' },
  { id: 'access', label: 'Access', icon: 'user', path: '/access' },
  { id: 'emergency', label: 'Emergency', icon: 'warning', path: '/emergency' },
  { id: 'logs', label: 'Logs', icon: 'records', path: '/logs' },
  { id: 'interop', label: 'Interop', icon: 'settings', path: '/interop' },
  { id: 'feedback', label: 'Feedback', icon: 'info', path: '/feedback' },
  { id: 'profile', label: 'Profile', icon: 'user', path: '/profile' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 z-20 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 shadow-soft transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Main navigation"
      >
        <nav className="h-full overflow-y-auto py-6">
          <ul role="list" className="space-y-2 px-4">
            {menuItems.map((item, index) => (
              <motion.li 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <a
                  href={item.path}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gradient-primary hover:text-white transition-all group"
                  aria-label={item.label}
                >
                  <Icon name={item.icon} size={20} className="group-hover:text-white" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
