import React from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { AccessPermission } from '../../api/accessApi';

interface RevokeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  permission: AccessPermission | null;
}

export const RevokeConfirmModal: React.FC<RevokeConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  permission 
}) => {
  if (!permission) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Revoke Access Permission">
      <div className="space-y-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-sm text-red-800 font-medium mb-2">
            Are you sure you want to revoke access?
          </p>
          <p className="text-sm text-red-700">
            This action will immediately revoke all permissions for:
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Entity:</span>
            <span className="text-sm font-medium text-gray-900">{permission.entity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Role:</span>
            <span className="text-sm font-medium text-gray-900">{permission.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Wallet:</span>
            <code className="text-xs bg-gray-200 px-2 py-1 rounded">{permission.wallet}</code>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Scope:</span>
            <span className="text-sm font-medium text-gray-900">{permission.scope}</span>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> This action will be recorded on the blockchain. The entity will no longer be able to access your medical records.
          </p>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Revoke Access
          </Button>
        </div>
      </div>
    </Modal>
  );
};
