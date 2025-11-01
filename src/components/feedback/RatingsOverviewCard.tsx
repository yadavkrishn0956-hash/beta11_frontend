import { motion } from 'framer-motion';
import { FeedbackAverages } from '../../api/feedbackApi';

interface RatingsOverviewCardProps {
  averages: FeedbackAverages;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const RatingsOverviewCard = ({ averages, onRefresh, isLoading }: RatingsOverviewCardProps) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-2xl ${
              i < fullStars
                ? 'text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
          >
            {i < fullStars ? '★' : i === fullStars && hasHalfStar ? '★' : '★'}
          </span>
        ))}
        <span className="ml-2 text-lg font-bold text-gray-700">{rating.toFixed(1)}/5</span>
      </div>
    );
  };

  const getPercentage = (rating: number) => (rating / 5) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/80 backdrop-blur-lg rounded-lg shadow-lg p-6 border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📊 Ratings Overview
        </h3>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 disabled:bg-gray-300 transition-colors text-sm"
        >
          {isLoading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      <div className="space-y-6">
        {/* Doctor Rating */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-gray-700">👨‍⚕️ Doctors</span>
            {renderStars(averages.Doctor)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getPercentage(averages.Doctor)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">{getPercentage(averages.Doctor).toFixed(0)}% satisfaction</p>
        </div>

        {/* Hospital Rating */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-gray-700">🏥 Hospitals</span>
            {renderStars(averages.Hospital)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getPercentage(averages.Hospital)}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">{getPercentage(averages.Hospital).toFixed(0)}% satisfaction</p>
        </div>

        {/* Total Feedbacks */}
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total Feedbacks</span>
            <span className="text-3xl font-bold text-teal-600">{averages.TotalFeedbacks}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
