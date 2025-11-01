import { motion } from 'framer-motion';

interface IntegrationSummaryCardProps {
  summary: {
    totalFHIR: number;
    syncedFHIR: number;
    syncedPercent: number;
    activeWearables: number;
    abdmLinked: boolean;
  };
}

export const IntegrationSummaryCard = ({ summary }: IntegrationSummaryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Integration Summary</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg border border-teal-200">
          <p className="text-sm text-gray-600 mb-1">Total FHIR Records</p>
          <p className="text-3xl font-bold text-teal-600">{summary.totalFHIR}</p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Synced</p>
          <p className="text-3xl font-bold text-green-600">{summary.syncedPercent}%</p>
          <p className="text-xs text-gray-500 mt-1">{summary.syncedFHIR} records</p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-600 mb-1">Active Wearables</p>
          <p className="text-3xl font-bold text-purple-600">{summary.activeWearables}</p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <p className="text-sm text-gray-600 mb-1">ABDM Status</p>
          <p className="text-2xl font-bold">
            {summary.abdmLinked ? (
              <span className="text-green-600">✅ Linked</span>
            ) : (
              <span className="text-red-600">❌ Not Linked</span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
