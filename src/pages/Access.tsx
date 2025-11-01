import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AccessTable } from '../components/access/AccessTable';
import { GrantAccessModal } from '../components/access/GrantAccessModal';
import { RevokeConfirmModal } from '../components/access/RevokeConfirmModal';
import { AuditHistoryPanel } from '../components/access/AuditHistoryPanel';
import { KeyManagerCard } from '../components/access/KeyManagerCard';
import { Button } from '../components/shared/Button';
import { Toast } from '../components/shared/Toast';
import { accessApiService, AccessPermission, GrantAccessRequest } from '../api/accessApi';

// Reuse TxModal from records
import { TxModal } from '../components/records/TxModal';

export const Access: React.FC = () => {
  const [permissions, setPermissions] = useState<AccessPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<AccessPermission | null>(null);
  const [txModalData, setTxModalData] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentKey, setCurrentKey] = useState(accessApiService.getCurrentKey());

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const data = await accessApiService.getAccessList();
      setPermissions(data);
    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAccess = async (request: GrantAccessRequest) => {
    try {
      const result = await accessApiService.grantAccess(request);
      setTxModalData({
        ipfsCid: 'N/A',
        txHash: result.txHash,
        aiSummary: `Access granted to ${request.entity} with ${request.scope} permissions.`
      });

      setTimeout(() => {
        loadPermissions();
        setToast({ message: 'Access granted successfully!', type: 'success' });
      }, 1500);
    } catch (error) {
      console.error('Error granting access:', error);
      setToast({ message: 'Failed to grant access', type: 'error' });
    }
  };

  const handleRevokeAccess = async () => {
    if (!selectedPermission) return;

    try {
      const result = await accessApiService.revokeAccess(selectedPermission.id);
      setRevokeModalOpen(false);
      setSelectedPermission(null);

      setTxModalData({
        ipfsCid: 'N/A',
        txHash: result.txHash,
        aiSummary: `Access revoked for ${selectedPermission.entity}.`
      });

      loadPermissions();
      setToast({ message: 'Access revoked successfully!', type: 'success' });
    } catch (error) {
      console.error('Error revoking access:', error);
      setToast({ message: 'Failed to revoke access', type: 'error' });
    }
  };

  const handleRotateKey = async () => {
    try {
      const result = await accessApiService.rotateKey();
      setCurrentKey(result.newKeyMasked);

      setTxModalData({
        ipfsCid: 'N/A',
        txHash: result.txHash,
        aiSummary: `Encryption key rotated successfully. New key: ${result.newKeyMasked}`
      });

      setToast({ message: 'Encryption key rotated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error rotating key:', error);
      setToast({ message: 'Failed to rotate key', type: 'error' });
    }
  };

  const openRevokeModal = (id: string) => {
    const permission = permissions.find(p => p.id === id);
    if (permission) {
      setSelectedPermission(permission);
      setRevokeModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading access permissions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold gradient-text mb-4">
          Access & Privacy Control
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Manage who can access your medical records with blockchain-verified permissions
        </p>
      </motion.div>

      {/* Grant Access Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-center mb-8"
      >
        <Button
          variant="primary"
          onClick={() => setGrantModalOpen(true)}
        >
          ➕ Grant Access
        </Button>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Access Table & Audit History */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <AccessTable
            permissions={permissions}
            onRevoke={openRevokeModal}
            onRefresh={loadPermissions}
          />

          <AuditHistoryPanel permissions={permissions} />
        </motion.div>

        {/* Right Column - Key Manager */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <KeyManagerCard
            currentKey={currentKey}
            onRotate={handleRotateKey}
          />
        </motion.div>
      </div>

      {/* Modals */}
      <GrantAccessModal
        isOpen={grantModalOpen}
        onClose={() => setGrantModalOpen(false)}
        onSubmit={handleGrantAccess}
      />

      <RevokeConfirmModal
        isOpen={revokeModalOpen}
        onClose={() => setRevokeModalOpen(false)}
        onConfirm={handleRevokeAccess}
        permission={selectedPermission}
      />

      {txModalData && (
        <TxModal
          data={txModalData}
          onClose={() => setTxModalData(null)}
        />
      )}

      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'info'}
        isVisible={toast !== null}
        onClose={() => setToast(null)}
      />
    </div>
  );
};
