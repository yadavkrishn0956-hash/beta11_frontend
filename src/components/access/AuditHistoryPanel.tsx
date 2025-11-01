import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import { AccessPermission } from '../../api/accessApi';

interface AuditHistoryPanelProps {
  permissions: AccessPermission[];
}

export const AuditHistoryPanel: React.FC<AuditHistoryPanelProps> = ({ permissions }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card title="Audit History">
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {permissions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No audit history</p>
        ) : (
          permissions.map((permission, idx) => (
            <motion.div
              key={permission.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="border-l-4 border-primary pl-4 py-2 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={permission.status === 'Active' ? 'success' : 'default'}>
                      {permission.status}
                    </Badge>
                    <span className="text-sm font-medium text-gray-900">
                      {permission.entity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    {permission.role} • {permission.scope}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(permission.txHash)}
                      className="text-xs text-primary hover:underline"
                      title="Copy TxHash"
                    >
                      {permission.txHash}
                    </button>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{permission.grantedOn}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
};
