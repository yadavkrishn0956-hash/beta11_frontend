import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { Icon } from '../shared/Icon';
import { MedicalRecord } from '../../api/recordsApi';
import { recordsApiService } from '../../api/recordsApi';

interface RecordViewerProps {
  record: MedicalRecord;
  onClose: () => void;
}

export const RecordViewer: React.FC<RecordViewerProps> = ({ record, onClose }) => {
  const [aiExplanation, setAiExplanation] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleExplainWithAI = async () => {
    setLoadingAI(true);
    try {
      const response = await recordsApiService.explainRecord(record.id);
      setAiExplanation(response);
    } catch (error) {
      console.error('Error getting AI explanation:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={record.title}>
      <div className="space-y-4">
        {/* Verification Banner */}
        {record.verified && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border-l-4 border-green-500 p-4 rounded"
          >
            <div className="flex items-center gap-2">
              <Icon name="check" size={20} className="text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Verified on-chain ✅
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs bg-green-100 px-2 py-1 rounded font-mono text-green-700">
                    {record.txHash}
                  </code>
                  <button
                    onClick={() => copyToClipboard(record.txHash)}
                    className="text-green-600 hover:text-green-700"
                    title="Copy TxHash"
                  >
                    <Icon name="records" size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Record Details */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 mb-1">Type</p>
            <Badge variant="info">{record.type}</Badge>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Date</p>
            <p className="text-sm font-medium text-gray-900">{record.date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Hospital</p>
            <p className="text-sm font-medium text-gray-900">{record.hospital}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">IPFS CID</p>
            <div className="flex items-center gap-1">
              <code className="text-xs font-mono text-gray-700 truncate">
                {record.ipfsCid.slice(0, 16)}...
              </code>
              <button
                onClick={() => copyToClipboard(record.ipfsCid)}
                className="text-primary hover:text-primary/80"
                title="Copy CID"
              >
                <Icon name="records" size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
          <div className="flex items-start gap-2">
            <span className="text-2xl">🤖</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">AI Summary</p>
              <p className="text-sm text-gray-700">{record.aiSummary}</p>
            </div>
          </div>
        </div>

        {/* Document Preview Placeholder */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
          <Icon name="records" size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">Document Preview</p>
          <p className="text-xs text-gray-500">
            View on IPFS: <a href={`https://ipfs.io/ipfs/${record.ipfsCid}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {record.ipfsCid.slice(0, 20)}...
            </a>
          </p>
        </div>

        {/* Explain with AI Button */}
        <Button
          variant="primary"
          onClick={handleExplainWithAI}
          disabled={loadingAI}
          className="w-full"
        >
          {loadingAI ? 'Analyzing...' : '🤖 Explain with AI'}
        </Button>

        {/* AI Explanation */}
        {aiExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 p-4 bg-purple-50 border border-purple-200 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">💡</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-purple-900 mb-2">
                  AI Detailed Explanation
                </p>
                <p className="text-sm text-purple-800 mb-3">{aiExplanation.reply}</p>
                <p className="text-sm text-purple-700">{aiExplanation.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  );
};
