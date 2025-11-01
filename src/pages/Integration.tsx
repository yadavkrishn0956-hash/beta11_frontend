import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { integrationApi, FHIRRecord, WearableDevice, ABDMStatus } from '../api/integrationApi';
import { FHIRExchangeCard } from '../components/integration/FHIRExchangeCard';
import { WearableIntegrationPanel } from '../components/integration/WearableIntegrationPanel';
import { ABDMConnectivityCard } from '../components/integration/ABDMConnectivityCard';
import { IntegrationSummaryCard } from '../components/integration/IntegrationSummaryCard';
import { EmergencyTxModal } from '../components/emergency/EmergencyTxModal';
import { Toast } from '../components/shared/Toast';

export const Integration = () => {
  const [fhirRecords, setFhirRecords] = useState<FHIRRecord[]>([]);
  const [wearables, setWearables] = useState<WearableDevice[]>([]);
  const [abdmStatus, setAbdmStatus] = useState<ABDMStatus>({
    linked: false,
    lastSync: '',
    healthId: ''
  });
  const [summary, setSummary] = useState({
    totalFHIR: 0,
    syncedFHIR: 0,
    syncedPercent: 0,
    activeWearables: 0,
    abdmLinked: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [currentTxHash, setCurrentTxHash] = useState('');
  const [txStatus, setTxStatus] = useState<'pending' | 'confirmed'>('pending');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [toastVisible, setToastVisible] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const loadData = async () => {
    try {
      const [fhirData, wearableData, abdmData, summaryData] = await Promise.all([
        integrationApi.getFHIRRecords(),
        integrationApi.getWearables(),
        integrationApi.getABDMStatus(),
        integrationApi.getSummary()
      ]);
      
      setFhirRecords(fhirData);
      setWearables(wearableData.devices);
      setAbdmStatus(abdmData);
      setSummary(summaryData);
    } catch (error) {
      showToast('Failed to load integration data', 'error');
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // Auto-update wearable metrics every 15 seconds
  useEffect(() => {
    if (!autoUpdate) return;

    const interval = setInterval(async () => {
      try {
        const wearableData = await integrationApi.updateWearableMetrics();
        setWearables(wearableData.devices);
      } catch (error) {
        console.error('Failed to update wearable metrics:', error);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [autoUpdate]);

  // Enable auto-update if any wearable is connected
  useEffect(() => {
    const hasConnected = wearables.some(w => w.connected);
    setAutoUpdate(hasConnected);
  }, [wearables]);

  const handleSyncFHIR = async (recordId: string) => {
    setIsLoading(true);
    try {
      const result = await integrationApi.syncFHIR(recordId);
      setCurrentTxHash(result.txHash);
      setTxStatus('pending');
      setTxModalOpen(true);

      setTimeout(() => {
        setTxStatus('confirmed');
        setTimeout(async () => {
          setTxModalOpen(false);
          showToast('FHIR record synced successfully');
          await loadData();
        }, 1500);
      }, 2000);
    } catch (error) {
      showToast('Failed to sync FHIR record', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWearable = async (deviceId: string, connect: boolean) => {
    setIsLoading(true);
    try {
      const result = await integrationApi.connectWearable(deviceId, connect);
      showToast(`${result.device} ${connect ? 'connected' : 'disconnected'} successfully`);
      await loadData();
    } catch (error) {
      showToast('Failed to update wearable connection', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncABDM = async () => {
    setIsLoading(true);
    try {
      const result = await integrationApi.syncABDM();
      setCurrentTxHash(result.txHash);
      setTxStatus('pending');
      setTxModalOpen(true);

      setTimeout(() => {
        setTxStatus('confirmed');
        setTimeout(async () => {
          setTxModalOpen(false);
          showToast('ABDM sync completed successfully');
          await loadData();
        }, 1500);
      }, 2000);
    } catch (error) {
      showToast('Failed to sync with ABDM', 'error');
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-4xl font-bold mb-2">🔗 Interoperability & Integration Hub</h1>
          <p className="text-lg opacity-90">
            FHIR-R4 Standards • Wearable Devices • ABDM National Health Stack
          </p>
        </div>

        {/* Integration Summary */}
        <IntegrationSummaryCard summary={summary} />

        {/* Main Content - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FHIR Exchange */}
          <div className="lg:col-span-3">
            <FHIRExchangeCard
              records={fhirRecords}
              onSync={handleSyncFHIR}
              isLoading={isLoading}
            />
          </div>

          {/* Wearable Integration */}
          <div className="lg:col-span-2">
            <WearableIntegrationPanel
              devices={wearables}
              onConnect={handleConnectWearable}
              isLoading={isLoading}
            />
          </div>

          {/* ABDM Connectivity */}
          <div className="lg:col-span-1">
            <ABDMConnectivityCard
              status={abdmStatus}
              onSync={handleSyncABDM}
              isLoading={isLoading}
            />
          </div>
        </div>
      </motion.div>

      {/* Transaction Modal */}
      <EmergencyTxModal
        isOpen={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        txHash={currentTxHash}
        status={txStatus}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};
