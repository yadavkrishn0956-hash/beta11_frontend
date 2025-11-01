import { motion, AnimatePresence } from 'framer-motion';

interface EmergencyTxModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  status: 'pending' | 'confirmed';
}

export const EmergencyTxModal = ({ isOpen, onClose, txHash, status }: EmergencyTxModalProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(txHash);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
          >
            <div className="text-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                status === 'confirmed' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {status === 'confirmed' ? (
                  <span className="text-4xl">✅</span>
                ) : (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="text-4xl"
                  >
                    ⏳
                  </motion.span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {status === 'confirmed' ? 'Transaction Confirmed!' : 'Processing Transaction...'}
              </h3>
              <p className="text-sm text-gray-600">
                {status === 'confirmed' 
                  ? 'Your emergency access request has been recorded on blockchain'
                  : 'Please wait while we process your request'
                }
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm font-mono text-gray-900 truncate">
                  {txHash}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                  title="Copy TxHash"
                >
                  📋
                </button>
              </div>
            </div>

            {status === 'confirmed' && (
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
