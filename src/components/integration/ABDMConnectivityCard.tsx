import { motion } from 'framer-motion';
import { ABDMStatus } from '../../api/integrationApi';

interface ABDMConnectivityCardProps {
  status: ABDMStatus;
  onSync: () => void;
  isLoading?: boolean;
}

export const ABDMConnectivityCard = ({ status, onSync, isLoading }: ABDMConnectivityCardProps) => {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openABDMDocs = () => {
    window.open('https://healthid.ndhm.gov.in', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          🏛️ National Health Stack (ABDM)
        </h3>
        <p className="text-sm opacity-90 mt-1">Ayushman Bharat Digital Mission Integration</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Overview */}
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-4 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-800">Connection Status</h4>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              status.linked 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {status.linked ? '🟢 Linked' : '🔴 Not Linked'}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Health ID
              </label>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="font-mono text-lg font-bold text-gray-800">{status.healthId}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Last Synchronized
              </label>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-800">{formatTime(status.lastSync)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onSync}
            disabled={isLoading || !status.linked}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
          >
            {isLoading ? '⏳ Syncing...' : '🔄 Sync with ABDM'}
          </button>

          <button
            onClick={openABDMDocs}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            📚 View National Stack Docs
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ About ABDM:</strong> The Ayushman Bharat Digital Mission enables seamless 
            exchange of health records across India's healthcare ecosystem using standardized APIs 
            and secure blockchain-based consent management.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
