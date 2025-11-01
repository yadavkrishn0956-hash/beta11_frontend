import { useState } from 'react';
import { motion } from 'framer-motion';

interface FeedbackFormCardProps {
  onSubmit: (data: {
    entity: string;
    role: 'Doctor' | 'Hospital';
    rating: number;
    review: string;
    wallet: string;
  }) => void;
  isLoading?: boolean;
}

export const FeedbackFormCard = ({ onSubmit, isLoading }: FeedbackFormCardProps) => {
  const [entityType, setEntityType] = useState<'Doctor' | 'Hospital'>('Doctor');
  const [entityName, setEntityName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [wallet] = useState('0xPATIENT' + Math.random().toString(36).substring(2, 8).toUpperCase());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityName || rating === 0 || review.length < 10) return;
    
    onSubmit({
      entity: entityName,
      role: entityType,
      rating,
      review,
      wallet
    });
    
    // Reset form
    setEntityName('');
    setRating(0);
    setReview('');
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <motion.button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="text-3xl focus:outline-none transition-colors"
      >
        <span className={
          star <= (hoverRating || rating)
            ? 'text-yellow-400'
            : 'text-gray-300'
        }>
          ★
        </span>
      </motion.button>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-lg rounded-lg shadow-lg p-6 border border-white/20"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        ✍️ Submit Feedback
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Entity Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entity Type *
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setEntityType('Doctor')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                entityType === 'Doctor'
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              👨‍⚕️ Doctor
            </button>
            <button
              type="button"
              onClick={() => setEntityType('Hospital')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                entityType === 'Hospital'
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🏥 Hospital
            </button>
          </div>
        </div>

        {/* Entity Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {entityType} Name *
          </label>
          <input
            type="text"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
            placeholder={`e.g., ${entityType === 'Doctor' ? 'Dr. Sharma' : 'Apollo Hospital'}`}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>

        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating * {rating > 0 && <span className="text-teal-600">({rating}/5)</span>}
          </label>
          <div className="flex gap-1">
            {renderStars()}
          </div>
        </div>

        {/* Review */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review * (minimum 10 characters)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            required
            minLength={10}
          />
          <p className="text-xs text-gray-500 mt-1">
            {review.length}/10 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !entityName || rating === 0 || review.length < 10}
          className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isLoading ? '⏳ Submitting...' : '📝 Submit Feedback'}
        </button>
      </form>
    </motion.div>
  );
};
