import { motion } from 'framer-motion';
import { WearableDevice } from '../../api/integrationApi';

interface WearableIntegrationPanelProps {
  devices: WearableDevice[];
  onConnect: (deviceId: string, connect: boolean) => void;
  isLoading?: boolean;
}

export const WearableIntegrationPanel = ({ devices, onConnect, isLoading }: WearableIntegrationPanelProps) => {
  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Never';
    return new Date(isoString).toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          ⌚ Wearable Device Integration
        </h3>
        <p className="text-sm opacity-90 mt-1">Real-time health metrics from connected devices</p>
      </div>

      <div className="p-6 space-y-4">
        {devices.map((device) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`border-2 rounded-lg p-4 transition-colors ${
              device.connected ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  {device.name}
                  {device.connected && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                      Connected
                    </span>
                  )}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Last sync: {formatTime(device.lastSync)}
                </p>
              </div>
              <button
                onClick={() => onConnect(device.id, !device.connected)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  device.connected
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                } disabled:bg-gray-300 disabled:cursor-not-allowed`}
              >
                {device.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            {device.connected && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Steps</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {device.steps?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Heart Rate</p>
                  <p className="text-2xl font-bold text-red-600">
                    {device.hr} <span className="text-sm">bpm</span>
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Battery</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {device.battery?.toFixed(0)}%
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
