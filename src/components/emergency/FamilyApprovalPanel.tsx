import { motion } from 'framer-motion';
import { EmergencyRequest } from '../../api/emergencyApi';

interface FamilyApprovalPanelProps {
  requests: EmergencyRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  isLoading?: boolean;
}

export const FamilyApprovalPanel = ({ requests, onApprove, onReject, isLoading }: FamilyApprovalPanelProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-800">👨‍👩‍👧 Family Approval Panel</h3>
      
      {requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">✅</p>
          <p>No pending emergency requests</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Hospital</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Wallet</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Reason</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Requested At</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <motion.tr
                  key={request.requestId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-2 text-sm font-medium text-gray-800">{request.hospital}</td>
                  <td className="py-3 px-2 text-xs font-mono text-gray-600">{request.wallet}</td>
                  <td className="py-3 px-2 text-sm text-gray-600 max-w-xs truncate" title={request.reason}>
                    {request.reason}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600">{formatDate(request.requestedAt)}</td>
                  <td className="py-3 px-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⏳ Pending
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => onApprove(request.requestId)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:bg-gray-300 transition-colors"
                        aria-label={`Approve request from ${request.hospital}`}
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => onReject(request.requestId)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:bg-gray-300 transition-colors"
                        aria-label={`Reject request from ${request.hospital}`}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};
