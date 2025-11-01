import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../shared/Card';

interface QuickAction {
  icon: string;
  label: string;
  path: string;
  color: string;
}

const actions: QuickAction[] = [
  { icon: '📤', label: 'Upload Record', path: '/records', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
  { icon: '🤖', label: 'Chat with AI', path: '/ai-center', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
  { icon: '🔐', label: 'Access Control', path: '/access', color: 'bg-green-50 hover:bg-green-100 border-green-200' },
  { icon: '🚨', label: 'Emergency Access', path: '/emergency', color: 'bg-red-50 hover:bg-red-100 border-red-200' },
  { icon: '⭐', label: 'Feedback', path: '/feedback', color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
];

export const QuickActionsPanel: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {actions.map((action, idx) => (
            <motion.a
              key={action.label}
              href={action.path}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${action.color}`}
            >
              <span className="text-3xl mb-2">{action.icon}</span>
              <span className="text-xs font-medium text-gray-700 text-center">
                {action.label}
              </span>
            </motion.a>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
