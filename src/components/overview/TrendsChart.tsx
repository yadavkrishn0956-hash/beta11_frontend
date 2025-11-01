import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { apiService } from '../../api/mockData';

export const TrendsChart: React.FC = () => {
  const [period, setPeriod] = useState<7 | 30>(7);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrends();
  }, [period]);

  const loadTrends = async () => {
    setLoading(true);
    try {
      const trends = await apiService.getPatientTrends(period);
      setData(trends);
    } catch (error) {
      console.error('Error loading trends:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Health Trends</h3>
          <div className="flex gap-2">
            <Button
              variant={period === 7 ? 'primary' : 'secondary'}
              onClick={() => setPeriod(7)}
              className="text-sm px-3 py-1"
            >
              7 Days
            </Button>
            <Button
              variant={period === 30 ? 'primary' : 'secondary'}
              onClick={() => setPeriod(30)}
              className="text-sm px-3 py-1"
            >
              30 Days
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sugar" 
                stroke="#0E9AA7" 
                strokeWidth={2}
                dot={{ fill: '#0E9AA7', r: 4 }}
                activeDot={{ r: 6 }}
                name="Sugar (mg/dL)"
              />
              <Line 
                type="monotone" 
                dataKey="bp" 
                stroke="#0B3D91" 
                strokeWidth={2}
                dot={{ fill: '#0B3D91', r: 4 }}
                activeDot={{ r: 6 }}
                name="BP (mmHg)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </motion.div>
  );
};
