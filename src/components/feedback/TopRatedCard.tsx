import { motion } from 'framer-motion';

interface TopRatedEntity {
  entity: string;
  role: 'Doctor' | 'Hospital';
  avgRating: number;
  count: number;
}

interface TopRatedCardProps {
  topRated: TopRatedEntity[];
}

export const TopRatedCard = ({ topRated }: TopRatedCardProps) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < fullStars
                ? 'text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/80 backdrop-blur-lg rounded-lg shadow-lg p-6 border border-white/20"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        🏆 Top Rated
      </h3>
      
      <div className="space-y-3">
        {topRated.map((entity, index) => (
          <motion.div
            key={entity.entity}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                  <h4 className="font-bold text-gray-800">{entity.entity}</h4>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    entity.role === 'Doctor'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {entity.role}
                  </span>
                  <span className="text-xs text-gray-600">({entity.count} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(entity.avgRating)}
                  <span className="text-sm font-bold text-gray-700">{entity.avgRating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
                  ✓ Verified
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
