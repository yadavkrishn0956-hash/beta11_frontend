import { motion } from 'framer-motion';
import { useState } from 'react';
import { Feedback } from '../../api/feedbackApi';

interface BlockchainFeedbackTableProps {
  feedbacks: Feedback[];
  onCopyTxHash: (txHash: string) => void;
}

export const BlockchainFeedbackTable = ({ feedbacks, onCopyTxHash }: BlockchainFeedbackTableProps) => {
  const [filter, setFilter] = useState<'All' | 'Doctor' | 'Hospital'>('All');

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingBadge = (rating: number) => {
    if (rating > 4) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">★ {rating}</span>;
    } else if (rating >= 3) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">★ {rating}</span>;
    } else {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">★ {rating}</span>;
    }
  };

  const filteredFeedbacks = filter === 'All'
    ? feedbacks
    : feedbacks.filter(f => f.role === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/80 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden border border-white/20"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            ⛓️ Blockchain Feedback Log
          </h3>
          
          {/* Filter Bar */}
          <div className="flex gap-2">
            {(['All', 'Doctor', 'Hospital'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  filter === filterOption
                    ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Entity</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Review</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">TxHash</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No feedbacks found
                </td>
              </tr>
            ) : (
              filteredFeedbacks.map((feedback, index) => (
                <motion.tr
                  key={feedback.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">{feedback.entity}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      feedback.role === 'Doctor'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {feedback.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">{getRatingBadge(feedback.rating)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate" title={feedback.review}>
                    {feedback.review}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onCopyTxHash(feedback.txHash)}
                      className="text-sm font-mono text-blue-600 hover:text-blue-800 hover:underline"
                      title="Click to copy"
                    >
                      {feedback.txHash.slice(0, 10)}...{feedback.txHash.slice(-6)}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatTime(feedback.time)}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
