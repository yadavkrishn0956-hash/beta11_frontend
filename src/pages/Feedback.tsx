import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { feedbackApi, Feedback as FeedbackType, FeedbackAverages } from '../api/feedbackApi';
import { FeedbackFormCard } from '../components/feedback/FeedbackFormCard';
import { RatingsOverviewCard } from '../components/feedback/RatingsOverviewCard';
import { BlockchainFeedbackTable } from '../components/feedback/BlockchainFeedbackTable';
import { TopRatedCard } from '../components/feedback/TopRatedCard';
import { EmergencyTxModal } from '../components/emergency/EmergencyTxModal';
import { Toast } from '../components/shared/Toast';

export const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [averages, setAverages] = useState<FeedbackAverages>({
    Doctor: 0,
    Hospital: 0,
    TotalFeedbacks: 0
  });
  const [topRated, setTopRated] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [currentTxHash, setCurrentTxHash] = useState('');
  const [txStatus, setTxStatus] = useState<'pending' | 'confirmed'>('pending');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const loadData = async () => {
    try {
      const [feedbackList, avgData, topRatedData] = await Promise.all([
        feedbackApi.getFeedbackList(),
        feedbackApi.getAverages(),
        feedbackApi.getTopRated()
      ]);
      
      setFeedbacks(feedbackList);
      setAverages(avgData);
      setTopRated(topRatedData);
    } catch (error) {
      showToast('Failed to load feedback data', 'error');
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitFeedback = async (data: {
    entity: string;
    role: 'Doctor' | 'Hospital';
    rating: number;
    review: string;
    wallet: string;
  }) => {
    setIsLoading(true);
    try {
      const result = await feedbackApi.submitFeedback(data);
      setCurrentTxHash(result.txHash);
      setTxStatus('pending');
      setTxModalOpen(true);

      setTimeout(() => {
        setTxStatus('confirmed');
        setTimeout(async () => {
          setTxModalOpen(false);
          showToast('Feedback recorded on blockchain!');
          await loadData();
        }, 1500);
      }, 2000);
    } catch (error) {
      showToast('Failed to submit feedback', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshAverages = async () => {
    setIsLoading(true);
    try {
      const avgData = await feedbackApi.getAverages();
      setAverages(avgData);
      showToast('Stats refreshed', 'info');
    } catch (error) {
      showToast('Failed to refresh stats', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTxHash = (txHash: string) => {
    navigator.clipboard.writeText(txHash);
    showToast('TxHash copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0E9AA7] to-[#0B3D91] text-white p-8 rounded-lg shadow-lg mb-6">
          <h1 className="text-4xl font-bold mb-2">⭐ Feedback & Reputation Center</h1>
          <p className="text-lg opacity-90">
            Transparent, blockchain-verified ratings for healthcare providers
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <FeedbackFormCard
              onSubmit={handleSubmitFeedback}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column - Overview & Top Rated */}
          <div className="lg:col-span-2 space-y-6">
            <RatingsOverviewCard
              averages={averages}
              onRefresh={handleRefreshAverages}
              isLoading={isLoading}
            />
            
            <TopRatedCard topRated={topRated} />
          </div>
        </div>

        {/* Blockchain Feedback Table */}
        <BlockchainFeedbackTable
          feedbacks={feedbacks}
          onCopyTxHash={handleCopyTxHash}
        />
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
