import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';

interface VitalsProps {
  vitals?: {
    sugar: number;
    bp: string;
    bmi: number;
    cholesterol: number;
  };
}

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'danger';
  sparkline: number[];
  delay: number;
}

const VitalCard: React.FC<VitalCardProps> = ({ 
  title, 
  value, 
  unit, 
  trend, 
  status, 
  sparkline,
  delay 
}) => {
  const statusVariant = status === 'normal' ? 'success' : status === 'warning' ? 'warning' : 'danger';
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  const trendColor = trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="border-t-4 border-t-primary hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <Badge variant={statusVariant}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold text-gray-900">{value}</span>
          <span className="text-sm text-gray-500">{unit}</span>
          <span className={`text-xl font-bold ${trendColor}`}>{trendIcon}</span>
        </div>

        {/* Mini Sparkline */}
        <div className="flex items-end gap-1 h-8">
          {sparkline.map((height, idx) => (
            <div
              key={idx}
              className="flex-1 bg-primary/20 rounded-t"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export const VitalsGrid: React.FC<VitalsProps> = ({ vitals }) => {
  const generateSparkline = () => 
    Array.from({ length: 8 }, () => Math.random() * 60 + 40);

  const vitalCards = [
    {
      title: 'Sugar Level',
      value: vitals?.sugar || 98,
      unit: 'mg/dL',
      trend: 'stable' as const,
      status: 'normal' as const,
      sparkline: generateSparkline(),
    },
    {
      title: 'Blood Pressure',
      value: vitals?.bp || '120/80',
      unit: 'mmHg',
      trend: 'down' as const,
      status: 'normal' as const,
      sparkline: generateSparkline(),
    },
    {
      title: 'BMI',
      value: vitals?.bmi || 22.4,
      unit: 'kg/m²',
      trend: 'stable' as const,
      status: 'normal' as const,
      sparkline: generateSparkline(),
    },
    {
      title: 'Cholesterol',
      value: vitals?.cholesterol || 180,
      unit: 'mg/dL',
      trend: 'up' as const,
      status: 'warning' as const,
      sparkline: generateSparkline(),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {vitalCards.map((card, idx) => (
        <VitalCard key={card.title} {...card} delay={idx * 0.1} />
      ))}
    </div>
  );
};
