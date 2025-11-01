import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const HeaderSection: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hello, Rahul 👋
        </h1>
        <p className="text-gray-600">
          Your AI-powered health summary — blockchain secured
        </p>
      </div>
      
      <div className="mt-4 md:mt-0 text-right">
        <div className="text-sm text-gray-500">{formatDate(currentTime)}</div>
        <div className="text-lg font-semibold text-gray-700">{formatTime(currentTime)}</div>
      </div>
    </motion.div>
  );
};
