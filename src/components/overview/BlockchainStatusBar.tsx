import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import { Icon } from '../shared/Icon';
import { apiService } from '../../api/mockData';

export const BlockchainStatusBar: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      const data = await apiService.getBlockchainStatus();
      setStatus(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading blockchain status:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card title="Blockchain Status">
        <div className="text-center py-4 text-gray-500">Loading...</div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card title="Blockchain Status">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <Badge variant="success">
              <span className="flex items-center gap-1">
                <Icon name="check" size={14} />
                {status?.status}
              </span>
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Wallet ID</span>
            <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              {status?.wallet}
            </code>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Last Verified</span>
            <span className="text-sm font-medium text-gray-900">{status?.lastVerified}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Latest Tx</span>
            <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              {status?.lastTx}
            </code>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadStatus}
            className="w-full mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
          >
            🔄 Refresh Status
          </motion.button>
        </div>
      </Card>
    </motion.div>
  );
};
