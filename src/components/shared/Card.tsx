import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-3xl shadow-card card-hover ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {icon && <span className="text-2xl">{icon}</span>}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </motion.div>
  );
};
