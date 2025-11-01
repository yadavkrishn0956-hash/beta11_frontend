import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeaderSection } from '../components/overview/HeaderSection';
import { VitalsGrid } from '../components/overview/VitalsGrid';
import { AIHealthScore } from '../components/overview/AIHealthScore';
import { TrendsChart } from '../components/overview/TrendsChart';
import { RemindersPanel } from '../components/overview/RemindersPanel';
import { QuickActionsPanel } from '../components/overview/QuickActionsPanel';
import { BlockchainStatusBar } from '../components/overview/BlockchainStatusBar';
import { apiService } from '../api/mockData';

export const Overview: React.FC = () => {
  const [overviewData, setOverviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const data = await apiService.getPatientOverview();
      setOverviewData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading overview data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HeaderSection />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Vitals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 space-y-6"
        >
          <VitalsGrid vitals={overviewData?.vitals} />
          <TrendsChart />
          <QuickActionsPanel />
        </motion.div>

        {/* Right Column - AI Score & Reminders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <AIHealthScore score={overviewData?.healthScore || 0} />
          <RemindersPanel />
          <BlockchainStatusBar />
        </motion.div>
      </div>
    </div>
  );
};
