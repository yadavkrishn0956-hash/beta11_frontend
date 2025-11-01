import { useState } from 'react';
import { motion } from 'framer-motion';

interface FilterPanelProps {
  onApplyFilters: (filters: {
    actor?: string;
    role?: string;
    status?: string;
    dateRange?: [string, string];
  }) => void;
  onClearFilters: () => void;
}

export const FilterPanel = ({ onApplyFilters, onClearFilters }: FilterPanelProps) => {
  const [actor, setActor] = useState('');
  const [role, setRole] = useState('All');
  const [status, setStatus] = useState('All');
  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'custom'>('7days');

  const handleApply = () => {
    const filters: any = {};
    
    if (actor) filters.actor = actor;
    if (role !== 'All') filters.role = role;
    if (status !== 'All') filters.status = status;
    
    // Calculate date range
    if (dateRange === '7days') {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      filters.dateRange = [start.toISOString(), end.toISOString()];
    } else if (dateRange === '30days') {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      filters.dateRange = [start.toISOString(), end.toISOString()];
    }
    
    onApplyFilters(filters);
  };

  const handleClear = () => {
    setActor('');
    setRole('All');
    setStatus('All');
    setDateRange('7days');
    onClearFilters();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 Filter Transactions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Actor Name
          </label>
          <input
            type="text"
            value={actor}
            onChange={(e) => setActor(e.target.value)}
            placeholder="Search by actor..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
          >
            <option value="All">All Roles</option>
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
            <option value="Hospital">Hospital</option>
            <option value="Guardian">Guardian</option>
            <option value="System">System</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
          >
            <option value="All">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Revoked">Revoked</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="custom">All Time</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleApply}
          className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClear}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </motion.div>
  );
};
