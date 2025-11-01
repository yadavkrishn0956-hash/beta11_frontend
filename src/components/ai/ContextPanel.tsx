import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import { apiService } from '../../api/mockData';

export const ContextPanel: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      const data = await apiService.getPatientOverview();
      setOverview(data);
    } catch (error) {
      console.error('Error loading overview:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card title="Health Context">
        <div className="text-center py-4 text-gray-500">Loading...</div>
      </Card>
    );
  }

  return (
    <Card title="Health Context">
      <div className="space-y-4">
        {/* Health Score */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Health Score</span>
            <Badge variant="success">{overview?.healthScore}/100</Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overview?.healthScore}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Latest Vitals */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Latest Vitals</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">Sugar</p>
              <p className="text-sm font-semibold text-gray-900">
                {overview?.vitals?.sugar} mg/dL
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">BP</p>
              <p className="text-sm font-semibold text-gray-900">
                {overview?.vitals?.bp}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">BMI</p>
              <p className="text-sm font-semibold text-gray-900">
                {overview?.vitals?.bmi}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">Cholesterol</p>
              <p className="text-sm font-semibold text-gray-900">
                {overview?.vitals?.cholesterol}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Record */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Recent Record</h4>
          <a
            href="/records"
            className="block bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <p className="text-sm font-medium text-gray-900 mb-1">
              Blood Test Report
            </p>
            <p className="text-xs text-gray-600">
              Slight glucose elevation noted; hemoglobin normal.
            </p>
            <p className="text-xs text-primary mt-2">View all records →</p>
          </a>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">AI is using this context to provide personalized health guidance.</p>
          <div className="flex gap-2 text-xs">
            <Badge variant="info">3 Records</Badge>
            <Badge variant="success">Stable</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
