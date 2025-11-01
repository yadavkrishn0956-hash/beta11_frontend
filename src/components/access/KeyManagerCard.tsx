import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';

interface KeyManagerCardProps {
  currentKey: string;
  onRotate: () => void;
}

export const KeyManagerCard: React.FC<KeyManagerCardProps> = ({ currentKey, onRotate }) => {
  const [rotating, setRotating] = useState(false);

  const handleRotate = async () => {
    setRotating(true);
    await onRotate();
    setTimeout(() => setRotating(false), 1000);
  };

  return (
    <Card title="Encryption Key Manager">
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Current Encryption Key</p>
          <motion.div
            key={currentKey}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-between"
          >
            <code className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
              {currentKey}
            </code>
            <span className="text-green-500 text-2xl">🔐</span>
          </motion.div>
        </div>

        <div className="bg-blue-50 border-l-4 border-primary p-3 rounded">
          <p className="text-xs text-gray-700">
            <strong>Security Tip:</strong> Rotating keys periodically keeps your data safe. We recommend rotating your encryption key every 90 days.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleRotate}
          disabled={rotating}
          className="w-full"
        >
          {rotating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">🔄</span>
              Rotating Key...
            </span>
          ) : (
            '🔑 Rotate Encryption Key'
          )}
        </Button>

        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Rotation Benefits:</h4>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>• Limits exposure if a key is compromised</li>
            <li>• Meets compliance requirements</li>
            <li>• Enhances overall data security</li>
            <li>• Automatic re-encryption of records</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
