import { motion } from 'framer-motion';
import { BlockchainLog } from '../../api/blockchainApi';
import { useState } from 'react';

interface TxLogTableProps {
  logs: BlockchainLog[];
  onTxClick: (log: BlockchainLog) => void;
  onCopyTxHash: (txHash: string) => void;
  highlightNew?: string[];
}

export const TxLogTable = ({ logs, onTxClick, onCopyTxHash, highlightNew = [] }: TxLogTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Confirmed: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Revoked: 'bg-red-100 text-red-800'
    };
    
    const icons = {
      Confirmed: '🟢',
      Pending: '🟡',
      Revoked: '🔴'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]} {status}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      Patient: 'bg-blue-100 text-blue-800',
      Doctor: 'bg-purple-100 text-purple-800',
      Hospital: 'bg-teal-100 text-teal-800',
      Guardian: 'bg-orange-100 text-orange-800',
      System: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors[role as keyof typeof colors]}`}>
        {role}
      </span>
    );
  };

  // Filter logs by search term
  const filteredLogs = logs.filter(log => 
    log.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="🔍 Search by TxHash, Action, or Actor..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">TxHash</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actor</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log) => (
                <motion.tr
                  key={log.txHash}
                  initial={highlightNew.includes(log.txHash) ? { backgroundColor: '#FEF3C7' } : {}}
                  animate={{ backgroundColor: '#FFFFFF' }}
                  transition={{ duration: 2 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onTxClick(log)}
                >
                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopyTxHash(log.txHash);
                      }}
                      className="text-sm font-mono text-blue-600 hover:text-blue-800 hover:underline"
                      title="Click to copy"
                    >
                      {log.txHash.slice(0, 10)}...{log.txHash.slice(-6)}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800 font-medium">{log.action}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{log.actor}</td>
                  <td className="py-3 px-4">{getRoleBadge(log.role)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatTime(log.time)}</td>
                  <td className="py-3 px-4">{getStatusBadge(log.status)}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} transactions
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
