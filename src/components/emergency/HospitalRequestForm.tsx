import { useState } from 'react';
import { motion } from 'framer-motion';

interface HospitalRequestFormProps {
  onSubmit: (data: { hospital: string; wallet: string; reason: string }) => void;
  isLoading?: boolean;
}

export const HospitalRequestForm = ({ onSubmit, isLoading }: HospitalRequestFormProps) => {
  const [hospital, setHospital] = useState('');
  const [wallet, setWallet] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospital || !wallet || !reason) return;
    onSubmit({ hospital, wallet, reason });
    setHospital('');
    setWallet('');
    setReason('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-800">🏥 Hospital Emergency Request</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hospital Name *
          </label>
          <input
            type="text"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            placeholder="e.g., Apollo Hospital"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
            aria-label="Hospital Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wallet Address *
          </label>
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
            required
            aria-label="Wallet Address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Emergency Access *
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the emergency situation..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            required
            aria-label="Reason for Emergency Access"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !hospital || !wallet || !reason}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '⏳ Requesting...' : '🚨 Request Emergency Access'}
        </button>
      </form>
    </motion.div>
  );
};
