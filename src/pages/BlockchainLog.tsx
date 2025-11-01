import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { blockchainApi, BlockchainLog as BlockchainLogType, FilterParams } from '../api/blockchainApi';
import { SummaryStatsCard } from '../components/blockchain/SummaryStatsCard';
import { FilterPanel } from '../components/blockchain/FilterPanel';
import { LiveSyncToggle } from '../components/blockchain/LiveSyncToggle';
import { TxLogTable } from '../components/blockchain/TxLogTable';
import { TxDetailsDrawer } from '../components/blockchain/TxDetailsDrawer';
import { Toast } from '../components/shared/Toast';

export const BlockchainLog = () => {
  const [logs, setLogs] = useState<BlockchainLogType[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    revoked: 0,
    confirmedPercent: 0,
    pendingPercent: 0,
    revokedPercent: 0,
    lastSync: new Date().toISOString()
  });
  const [selectedLog, setSelectedLog] = useState<BlockchainLogType | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [highlightNew, setHighlightNew] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [toastVisible, setToastVisible] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterParams>({});

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const loadData = useCallback(async (filters?: FilterParams) => {
    try {
      const [logsData, statsData] = await Promise.all([
        filters && Object.keys(filters).length > 0 
          ? blockchainApi.filterLogs(filters)
          : blockchainApi.getLogs(),
        blockchainApi.getStats()
      ]);
      
      // Check for new logs
      const newTxHashes = logsData
        .filter(log => !logs.find(l => l.txHash === log.txHash))
        .map(log => log.txHash);
      
      if (newTxHashes.length > 0 && logs.length > 0) {
        setHighlightNew(newTxHashes);
        setTimeout(() => setHighlightNew([]), 3000);
      }
      
      setLogs(logsData);
      setStats(statsData);
    } catch (error) {
      showToast('Failed to load blockchain logs', 'error');
    }
  }, [logs]);

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadData(currentFilters);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, currentFilters, loadData]);

  const handleApplyFilters = async (filters: FilterParams) => {
    setCurrentFilters(filters);
    await loadData(filters);
    showToast('Filters applied', 'info');
  };

  const handleClearFilters = async () => {
    setCurrentFilters({});
    await loadData();
    showToast('Filters cleared', 'info');
  };

  const handleTxClick = (log: BlockchainLogType) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  };

  const handleCopyTxHash = (txHash: string) => {
    navigator.clipboard.writeText(txHash);
    showToast('TxHash copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0E9AA7] to-[#0B3D91] text-white p-8 rounded-lg shadow-lg mb-6">
          <h1 className="text-4xl font-bold mb-2">⛓️ Blockchain Activity Log</h1>
          <p className="text-lg opacity-90">
            Immutable ledger of every transaction across the MediTrust Network
          </p>
        </div>

        {/* Summary Stats */}
        <SummaryStatsCard stats={stats} />

        {/* Live Sync Toggle */}
        <LiveSyncToggle enabled={autoRefresh} onToggle={setAutoRefresh} />

        {/* Filter Panel */}
        <FilterPanel
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Transaction Log Table */}
        <TxLogTable
          logs={logs}
          onTxClick={handleTxClick}
          onCopyTxHash={handleCopyTxHash}
          highlightNew={highlightNew}
        />

        {/* Transaction Details Drawer */}
        <TxDetailsDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          log={selectedLog}
        />

        {/* Toast Notification */}
        <Toast
          message={toastMessage}
          type={toastType}
          isVisible={toastVisible}
          onClose={() => setToastVisible(false)}
        />
      </motion.div>
    </div>
  );
};
