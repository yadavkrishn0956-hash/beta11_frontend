import { motion, AnimatePresence } from 'framer-motion';
import { BlockchainLog } from '../../api/blockchainApi';

interface TxDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  log: BlockchainLog | null;
}

export const TxDetailsDrawer = ({ isOpen, onClose, log }: TxDetailsDrawerProps) => {
  if (!log) return null;

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Confirmed: 'text-green-600 bg-green-100',
      Pending: 'text-yellow-600 bg-yellow-100',
      Revoked: 'text-red-600 bg-red-100'
    };
    return colors[status as keyof typeof colors];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openExplorer = () => {
    // Simulated block explorer link
    window.open(`https://mumbai.polygonscan.com/tx/${log.txHash}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">Transaction Details</h2>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  aria-label="Close drawer"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm opacity-90">Blockchain Activity Log</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Transaction Hash */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Transaction Hash
                </label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <code className="flex-1 text-sm font-mono text-gray-800 break-all">
                    {log.txHash}
                  </code>
                  <button
                    onClick={() => copyToClipboard(log.txHash)}
                    className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                    title="Copy TxHash"
                  >
                    📋
                  </button>
                </div>
              </div>

              {/* Action Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Action Type
                </label>
                <p className="text-lg font-semibold text-gray-800">{log.action}</p>
              </div>

              {/* Actor */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Actor
                </label>
                <p className="text-lg font-medium text-gray-800">{log.actor}</p>
                <p className="text-sm text-gray-600 mt-1">Role: {log.role}</p>
              </div>

              {/* Wallet Address */}
              {log.walletAddress && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Wallet Address
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <code className="flex-1 text-sm font-mono text-gray-800">
                      {log.walletAddress}
                    </code>
                    <button
                      onClick={() => copyToClipboard(log.walletAddress!)}
                      className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                      title="Copy Address"
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Timestamp
                </label>
                <p className="text-sm text-gray-800">{formatTime(log.time)}</p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Status
                </label>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(log.status)}`}>
                  {log.status === 'Confirmed' && '✅'}
                  {log.status === 'Pending' && '⏳'}
                  {log.status === 'Revoked' && '❌'}
                  {log.status}
                </span>
              </div>

              {/* Block Number */}
              {log.blockNumber && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Block Number
                  </label>
                  <p className="text-sm font-mono text-gray-800">#{log.blockNumber.toLocaleString()}</p>
                </div>
              )}

              {/* Gas Used */}
              {log.gasUsed && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Gas Used
                  </label>
                  <p className="text-sm font-mono text-gray-800">{log.gasUsed}</p>
                </div>
              )}

              {/* Blockchain Network */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Blockchain Network
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 text-xl">⬡</span>
                  <p className="text-sm font-medium text-gray-800">Polygon Mumbai (Simulated)</p>
                </div>
              </div>

              {/* Verify on Explorer */}
              <button
                onClick={openExplorer}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                🔍 Verify on Block Explorer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
