import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ActiveEmergencySession } from '../../api/emergencyApi';

interface ActiveEmergencyCardProps {
  session: ActiveEmergencySession;
  onRevoke: (sessionId: string) => void;
  onExpire: (sessionId: string) => void;
  isLoading?: boolean;
}

export const ActiveEmergencyCard = ({ session, onRevoke, onExpire, isLoading }: ActiveEmergencyCardProps) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiryTime = new Date(session.expiry).getTime();
      const diff = expiryTime - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        setIsExpired(true);
        clearInterval(interval);
        onExpire(session.sessionId);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session.expiry, session.sessionId, onExpire]);

  const copyTxHash = () => {
    navigator.clipboard.writeText(session.txHash);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${isExpired ? 'border-gray-400' : 'border-green-500'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-bold text-gray-800">{session.hospital}</h4>
          <p className="text-sm text-gray-600">Patient: {session.patient}</p>
          <p className="text-xs text-gray-500 font-mono mt-1">{session.wallet}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isExpired 
            ? 'bg-gray-100 text-gray-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {isExpired ? '⏱ Expired' : '✅ Active'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div>
            <p className="text-xs text-gray-600">Transaction Hash</p>
            <button
              onClick={copyTxHash}
              className="text-sm font-mono text-blue-600 hover:text-blue-800 transition-colors"
              title="Click to copy"
            >
              {session.txHash}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div>
            <p className="text-xs text-gray-600">Time Remaining</p>
            <p 
              className={`text-2xl font-mono font-bold ${isExpired ? 'text-gray-500' : 'text-green-600'}`}
              role="timer"
              aria-live="polite"
            >
              {timeLeft}
            </p>
          </div>
        </div>

        {!isExpired && (
          <button
            onClick={() => onRevoke(session.sessionId)}
            disabled={isLoading}
            className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '⏳ Revoking...' : '🔄 Revoke Access Now'}
          </button>
        )}

        {isExpired && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-sm text-red-800 font-medium">⚠️ Access automatically expired</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
