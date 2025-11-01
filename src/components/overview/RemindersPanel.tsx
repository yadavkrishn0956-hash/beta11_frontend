import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Icon } from '../shared/Icon';
import { apiService } from '../../api/mockData';

export const RemindersPanel: React.FC = () => {
  const [reminders, setReminders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const data = await apiService.getReminders();
      setReminders(data);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card title="Upcoming Reminders">
        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {reminders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reminders</p>
              ) : (
                reminders.map((reminder, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Icon name="bell" size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <p className="flex-1 text-sm text-gray-700">{reminder}</p>
                    <button
                      onClick={() => handleMarkDone(idx)}
                      className="text-green-600 hover:text-green-700 transition-colors"
                      aria-label="Mark as done"
                    >
                      <Icon name="check" size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            <Button variant="primary" className="w-full text-sm">
              ➕ Add Reminder
            </Button>
          </>
        )}
      </Card>
    </motion.div>
  );
};
