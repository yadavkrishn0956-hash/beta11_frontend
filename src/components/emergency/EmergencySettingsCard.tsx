import { motion } from 'framer-motion';
import { useState } from 'react';
import { TrustedEntity } from '../../api/emergencyApi';

interface EmergencySettingsCardProps {
  trustedEntities: TrustedEntity[];
  onAddEntity: (data: { name: string; wallet: string; type: 'hospital' | 'family' }) => void;
  isLoading?: boolean;
}

export const EmergencySettingsCard = ({ trustedEntities, onAddEntity, isLoading }: EmergencySettingsCardProps) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [wallet, setWallet] = useState('');
  const [type, setType] = useState<'hospital' | 'family'>('hospital');

  const hospitals = trustedEntities.filter(e => e.type === 'hospital');
  const family = trustedEntities.filter(e => e.type === 'family');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !wallet) return;
    onAddEntity({ name, wallet, type });
    setName('');
    setWallet('');
    setShowForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 border-t-4 border-gradient-to-r from-teal-500 to-blue-600"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-800">⚙️ Emergency Settings</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          ℹ️ In emergencies, verified hospitals may access data temporarily. Family members can approve requests on behalf of the patient.
        </p>
      </div>

      <div className="space-y-6">
        {/* Trusted Hospitals */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">🏥 Trusted Hospitals</h4>
          <div className="space-y-2">
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{hospital.name}</p>
                  <p className="text-xs font-mono text-gray-500">{hospital.wallet}</p>
                </div>
                <span className="text-green-500">✓</span>
              </div>
            ))}
          </div>
        </div>

        {/* Family Members */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">👨‍👩‍👧 Family Members</h4>
          <div className="space-y-2">
            {family.map((member) => (
              <div key={member.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{member.name}</p>
                  <p className="text-xs font-mono text-gray-500">{member.wallet}</p>
                </div>
                <span className="text-green-500">✓</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Entity */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            ➕ Add Trusted Entity
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 border-t pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'hospital' | 'family')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="hospital">Hospital</option>
                <option value="family">Family Member</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Max Hospital"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
              <input
                type="text"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono text-sm"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-teal-500 text-white py-2 rounded-lg font-semibold hover:bg-teal-600 disabled:bg-gray-300 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};
