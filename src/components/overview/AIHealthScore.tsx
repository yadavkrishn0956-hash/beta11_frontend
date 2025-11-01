import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { apiService } from '../../api/mockData';

interface AIHealthScoreProps {
  score: number;
}

export const AIHealthScore: React.FC<AIHealthScoreProps> = ({ score }) => {
  const [showModal, setShowModal] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const handleExplainScore = async () => {
    setLoading(true);
    setShowModal(true);
    try {
      const response = await apiService.chatWithAI('Explain my health score');
      setAiExplanation(response);
    } catch (error) {
      console.error('Error fetching AI explanation:', error);
    } finally {
      setLoading(false);
    }
  };

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card title="AI Health Score">
          <div className="flex flex-col items-center py-6">
            {/* Circular Gauge */}
            <div className="relative w-48 h-48 mb-6">
              <svg className="transform -rotate-90 w-48 h-48">
                {/* Background circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="70"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="96"
                  cy="96"
                  r="70"
                  stroke={getScoreRingColor(score)}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{
                    strokeDasharray: circumference,
                  }}
                />
              </svg>
              
              {/* Score text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className={`text-5xl font-bold ${getScoreColor(score)}`}
                >
                  {score}
                </motion.span>
                <span className="text-sm text-gray-500 mt-1">out of 100</span>
              </div>
            </div>

            <p className="text-center text-gray-600 mb-4">
              Your health is in {score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'fair'} condition
            </p>

            <Button 
              variant="primary" 
              onClick={handleExplainScore}
              className="w-full"
            >
              Why this score?
            </Button>
          </div>
        </Card>
      </motion.div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="AI Health Score Explanation"
      >
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyzing your health data...</p>
          </div>
        ) : aiExplanation ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
              <p className="text-gray-800 font-medium">{aiExplanation.reply}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Detailed Analysis:</h4>
              <p className="text-gray-600">{aiExplanation.explanation}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
};
