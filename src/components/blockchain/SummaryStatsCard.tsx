import { motion } from 'framer-motion';

interface SummaryStatsCardProps {
  stats: {
    total: number;
    confirmed: number;
    pending: number;
    revoked: number;
    confirmedPercent: number;
    pendingPercent: number;
    revokedPercent: number;
    lastSync: string;
  };
}

export const SummaryStatsCard = ({ stats }: SummaryStatsCardProps) => {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Confirmed</p>
          <p className="text-3xl font-bold text-green-600">{stats.confirmedPercent}%</p>
          <p className="text-xs text-gray-500">{stats.confirmed} txs</p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingPercent}%</p>
          <p className="text-xs text-gray-500">{stats.pending} txs</p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Revoked</p>
          <p className="text-3xl font-bold text-red-600">{stats.revokedPercent}%</p>
          <p className="text-xs text-gray-500">{stats.revoked} txs</p>
        </div>
        
        <div className="text-center col-span-2 md:col-span-1">
          <p className="text-sm text-gray-600 mb-1">Last Sync</p>
          <p className="text-sm font-semibold text-gray-800">{formatTime(stats.lastSync)}</p>
        </div>
      </div>
    </motion.div>
  );
};
