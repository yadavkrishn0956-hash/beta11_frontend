import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Icon } from '../shared/Icon';
import { MedicalRecord } from '../../api/recordsApi';

interface RecordsFilterBarProps {
  onFilter: (filters: { type: string; hospital: string; search: string }) => void;
  records: MedicalRecord[];
}

export const RecordsFilterBar: React.FC<RecordsFilterBarProps> = ({ onFilter, records }) => {
  const [type, setType] = useState('All');
  const [hospital, setHospital] = useState('All');
  const [search, setSearch] = useState('');

  const types = ['All', ...Array.from(new Set(records.map(r => r.type)))];
  const hospitals = ['All', ...Array.from(new Set(records.map(r => r.hospital)))];

  const handleFilterChange = (newType?: string, newHospital?: string, newSearch?: string) => {
    const filters = {
      type: newType ?? type,
      hospital: newHospital ?? hospital,
      search: newSearch ?? search
    };
    onFilter(filters);
  };

  return (
    <Card title="Filter Records">
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by Title
          </label>
          <div className="relative">
            <Icon 
              name="search" 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleFilterChange(undefined, undefined, e.target.value);
              }}
              placeholder="Search records..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Record Type
          </label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              handleFilterChange(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Hospital Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hospital
          </label>
          <select
            value={hospital}
            onChange={(e) => {
              setHospital(e.target.value);
              handleFilterChange(undefined, e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {hospitals.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(type !== 'All' || hospital !== 'All' || search) && (
          <button
            onClick={() => {
              setType('All');
              setHospital('All');
              setSearch('');
              handleFilterChange('All', 'All', '');
            }}
            className="w-full text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
    </Card>
  );
};
