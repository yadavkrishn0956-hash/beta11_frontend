import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface EmergencyStatusBannerProps {
  expiry: string;
  onExpire: () => void;
}

export const EmergencyStatusBanner = ({ expiry, onExpire }: EmergencyStatusBannerProps) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiry).getTime();
      const diff = expiryTime - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        clearInterval(interval);
        onExpire();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiry, onExpire]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg shadow-lg mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-bold text-lg">Emergency Mode Active</h3>
            <p className="text-sm opacity-90">Temporary access granted to medical facility</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">Auto-expires in</p>
          <p 
            className="text-3xl font-mono font-bold"
            role="timer"
            aria-live="polite"
            aria-atomic="true"
          >
            {timeLeft}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
