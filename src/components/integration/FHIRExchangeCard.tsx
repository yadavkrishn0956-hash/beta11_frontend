import { motion } from 'framer-motion';
import { FHIRRecord } from '../../api/integrationApi';

interface FHIRExchangeCardProps {
  records: FHIRRecord[];
  onSync: (recordId: string) => void;
  isLoading?: boolean;
}

export const FHIRExchangeCard = ({ records, onSync, isLoading }: FHIRExchangeCardProps) => {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Synced: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Failed: 'bg-red-100 text-red-800'
    };
    
    const icons = {
      Synced: '🟢',
      Pending: '🟡',
      Failed: '🔴'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]} {status}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white p-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          📄 FHIR Data Exchange
        </h3>
        <p className="text-sm opacity-90 mt-1">Fast Healthcare Interoperability Resources (FHIR-R4)</p>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Record Type</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Format</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Last Synced</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <motion.tr
                  key={record.recordId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-2 text-sm font-medium text-gray-800">{record.type}</td>
                  <td className="py-3 px-2 text-sm text-gray-600">{record.format}</td>
                  <td className="py-3 px-2">{getStatusBadge(record.status)}</td>
                  <td className="py-3 px-2 text-sm text-gray-600">{formatTime(record.lastSync)}</td>
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => onSync(record.recordId)}
                      disabled={isLoading || record.status === 'Synced'}
                      className="px-3 py-1 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {record.status === 'Synced' ? '✓ Synced' : '🔄 Sync Now'}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
