import { motion } from 'framer-motion';

interface LiveSyncToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const LiveSyncToggle = ({ enabled, onToggle }: LiveSyncToggleProps) => {
  return (
    <div className="flex items-center gap-3 bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">🔄 Auto-Refresh Logs</h3>
        <p className="text-sm text-gray-600">Automatically fetch new transactions every 10 seconds</p>
      </div>
      
      <button
        onClick={() => onToggle(!enabled)}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
          enabled ? 'bg-green-500' : 'bg-gray-300'
        }`}
        role="switch"
        aria-checked={enabled}
        aria-label="Toggle auto-refresh"
      >
        <motion.span
          className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg"
          animate={{ x: enabled ? 28 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      
      {enabled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-green-600"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-xl"
          >
            ⟳
          </motion.div>
          <span className="text-sm font-medium">Active</span>
        </motion.div>
      )}
    </div>
  );
};
