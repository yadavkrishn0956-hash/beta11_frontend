import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { Icon } from '../shared/Icon';
import { AccessPermission } from '../../api/accessApi';

interface AccessTableProps {
  permissions: AccessPermission[];
  onRevoke: (id: string) => void;
  onRefresh: () => void;
}

export const AccessTable: React.FC<AccessTableProps> = ({ permissions, onRevoke, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredPermissions = permissions.filter(p =>
    p.entity.toLowerCase().includes(search.toLowerCase()) ||
    p.wallet.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPermissions = filteredPermissions.slice(startIndex, startIndex + itemsPerPage);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Expired': return 'default';
      case 'Revoked': return 'danger';
      default: return 'default';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card title={`Access Permissions (${permissions.length})`}>
      <div className="space-y-4">
        {/* Search and Refresh */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Icon 
              name="search" 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by entity or wallet..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Refresh"
          >
            🔄
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wallet</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scope</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Granted</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TxHash</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPermissions.map((permission, idx) => (
                <motion.tr
                  key={permission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{permission.entity}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{permission.role}</td>
                  <td className="px-4 py-3 text-sm">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{permission.wallet}</code>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{permission.scope}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{permission.grantedOn}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{permission.expiry}</td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusVariant(permission.status)}>
                      {permission.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => copyToClipboard(permission.txHash)}
                      className="text-primary hover:underline text-xs"
                      title="Copy TxHash"
                    >
                      {permission.txHash}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {permission.status === 'Active' && (
                      <Button
                        variant="danger"
                        onClick={() => onRevoke(permission.id)}
                        className="text-xs px-2 py-1"
                      >
                        🔄 Revoke
                      </Button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPermissions.length)} of {filteredPermissions.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
