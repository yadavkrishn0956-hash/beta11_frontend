import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import { Icon } from '../shared/Icon';
import { MedicalRecord } from '../../api/recordsApi';

interface RecordsTableProps {
  records: MedicalRecord[];
  onRecordClick: (record: MedicalRecord) => void;
}

export const RecordsTable: React.FC<RecordsTableProps> = ({ records, onRecordClick }) => {
  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'Lab': return 'info';
      case 'MRI': return 'warning';
      case 'Radiology': return 'warning';
      case 'Prescription': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card title={`Medical Records (${records.length})`}>
      {records.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="records" size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500">No records found</p>
          <p className="text-sm text-gray-400 mt-1">Upload your first medical record to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record, idx) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 16px rgba(14, 154, 167, 0.15)' }}
              onClick={() => onRecordClick(record)}
              className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-primary bg-gradient-to-r from-transparent to-transparent hover:from-primary/5 hover:to-secondary/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {record.title}
                    </h3>
                    {record.verified && (
                      <span className="flex-shrink-0">
                        <Icon name="check" size={16} className="text-green-500" />
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant={getTypeBadgeVariant(record.type)}>
                      {record.type}
                    </Badge>
                    <span className="text-sm text-gray-500">{record.date}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{record.hospital}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <code className="bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">
                      {record.txHash}
                    </code>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">IPFS: {record.ipfsCid.slice(0, 12)}...</span>
                  </div>
                </div>

                <Icon name="chevron-right" size={20} className="text-gray-400 flex-shrink-0 mt-1" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
};
