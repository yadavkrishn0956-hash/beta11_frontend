import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadPanel } from '../components/records/UploadPanel';
import { RecordsFilterBar } from '../components/records/RecordsFilterBar';
import { RecordsTable } from '../components/records/RecordsTable';
import { RecordViewer } from '../components/records/RecordViewer';
import { TxModal } from '../components/records/TxModal';
import { recordsApiService, MedicalRecord } from '../api/recordsApi';

export const Records: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [txModalData, setTxModalData] = useState<any>(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await recordsApiService.getRecords();
      setRecords(data);
      setFilteredRecords(data);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (uploadData: any) => {
    setTxModalData(uploadData);
    // Add new record to the list
    const newRecord: MedicalRecord = {
      id: `r${Date.now()}`,
      title: 'New Upload',
      type: 'Lab',
      date: new Date().toISOString().split('T')[0],
      hospital: 'Self Upload',
      ipfsCid: uploadData.ipfsCid,
      txHash: uploadData.txHash,
      aiSummary: uploadData.aiSummary,
      verified: true
    };
    setRecords([newRecord, ...records]);
    setFilteredRecords([newRecord, ...filteredRecords]);
  };

  const handleFilter = (filters: { type: string; hospital: string; search: string }) => {
    let filtered = [...records];

    if (filters.type && filters.type !== 'All') {
      filtered = filtered.filter(r => r.type === filters.type);
    }

    if (filters.hospital && filters.hospital !== 'All') {
      filtered = filtered.filter(r => r.hospital === filters.hospital);
    }

    if (filters.search) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Medical Vault – Encrypted Health Records
        </h1>
        <p className="text-gray-600">
          Secure, blockchain-verified medical records with AI-powered insights
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upload & Filter */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <UploadPanel onUploadComplete={handleUploadComplete} />
          <RecordsFilterBar onFilter={handleFilter} records={records} />
        </motion.div>

        {/* Right Column - Records List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <RecordsTable 
            records={filteredRecords} 
            onRecordClick={setSelectedRecord}
          />
        </motion.div>
      </div>

      {/* Record Viewer Modal */}
      {selectedRecord && (
        <RecordViewer
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {/* Transaction Modal */}
      {txModalData && (
        <TxModal
          data={txModalData}
          onClose={() => setTxModalData(null)}
        />
      )}
    </div>
  );
};
