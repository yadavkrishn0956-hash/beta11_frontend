import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { FormField } from '../shared/FormField';
import { GrantAccessRequest } from '../../api/accessApi';

interface GrantAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: GrantAccessRequest) => void;
}

export const GrantAccessModal: React.FC<GrantAccessModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [entity, setEntity] = useState('');
  const [wallet, setWallet] = useState('');
  const [scope, setScope] = useState('Read-Only');
  const [expiry, setExpiry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ entity, wallet, scope, expiry });
    // Reset form
    setEntity('');
    setWallet('');
    setScope('Read-Only');
    setExpiry('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Grant Access Permission">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Entity Name"
          type="text"
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
          placeholder="e.g., Dr. Smith, Apollo Hospital"
          required
        />

        <FormField
          label="Wallet Address"
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="0x..."
          helperText="Ethereum wallet address of the entity"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Access Scope
          </label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="Read-Only">Read-Only</option>
            <option value="View Reports">View Reports</option>
            <option value="View Lab Results">View Lab Results</option>
            <option value="Full Access">Full Access</option>
          </select>
        </div>

        <FormField
          label="Expiry Date"
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          helperText="Access will automatically expire on this date"
          required
        />

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> This action will be recorded on the blockchain and cannot be undone. You can revoke access later if needed.
          </p>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Grant Access
          </Button>
        </div>
      </form>
    </Modal>
  );
};
