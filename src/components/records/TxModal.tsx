import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../shared/Icon';

interface TxModalProps {
  data: {
    ipfsCid: string;
    txHash: string;
    aiSummary: string;
  };
  onClose: () => void;
}

export const TxModal: React.FC<TxModalProps> = ({ data, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
      >
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="check" size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Upload Successful!
          </h3>
          <p className="text-sm text-gray-600">
            Your record has been encrypted and stored on blockchain
          </p>
        </div>

        <div className="space-y-3">
          {/* IPFS CID */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">IPFS CID</p>
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm font-mono text-gray-900 truncate">
                {data.ipfsCid}
              </code>
              <button
                onClick={() => copyToClipboard(data.ipfsCid)}
                className="text-primary hover:text-primary/80 flex-shrink-0"
                title="Copy CID"
              >
                📋
              </button>
            </div>
          </div>

          {/* TxHash */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm font-mono text-gray-900">
                {data.txHash}
              </code>
              <button
                onClick={() => copyToClipboard(data.txHash)}
                className="text-primary hover:text-primary/80 flex-shrink-0"
                title="Copy TxHash"
              >
                📋
              </button>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-blue-50 border-l-4 border-primary p-3 rounded">
            <p className="text-xs text-gray-700 font-medium mb-1">🤖 AI Summary</p>
            <p className="text-sm text-gray-700">{data.aiSummary}</p>
          </div>
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          Auto-closing in 3 seconds...
        </p>
      </motion.div>
    </div>
  );
};
