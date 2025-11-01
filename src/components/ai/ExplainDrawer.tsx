import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../shared/Button';
import { Icon } from '../shared/Icon';

interface ExplainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: string;
}

export const ExplainDrawer: React.FC<ExplainDrawerProps> = ({ isOpen, onClose, explanation }) => {
  const handleAddToNotes = () => {
    const notes = JSON.parse(localStorage.getItem('ai-notes') || '[]');
    notes.push({
      explanation,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('ai-notes', JSON.stringify(notes));
    alert('Added to notes!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>💡</span>
                  AI Explanation
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icon name="close" size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
                  <h3 className="font-semibold text-gray-900 mb-2">How AI Analyzed This</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{explanation}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Key Factors:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Pattern recognition from medical literature</li>
                    <li>• Your recent health data and vitals</li>
                    <li>• Symptom correlation analysis</li>
                    <li>• Evidence-based medical guidelines</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> AI suggestions are for informational purposes only. Always consult with your healthcare provider for medical decisions.
                  </p>
                </div>

                <Button
                  variant="primary"
                  onClick={handleAddToNotes}
                  className="w-full"
                >
                  📝 Add to Notes
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
