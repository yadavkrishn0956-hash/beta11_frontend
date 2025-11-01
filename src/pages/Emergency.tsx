import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { emergencyApi, EmergencyRequest, ActiveEmergencySession, TrustedEntity } from '../api/emergencyApi';
import { EmergencyStatusBanner } from '../components/emergency/EmergencyStatusBanner';
import { HospitalRequestForm } from '../components/emergency/HospitalRequestForm';
import { FamilyApprovalPanel } from '../components/emergency/FamilyApprovalPanel';
import { ActiveEmergencyCard } from '../components/emergency/ActiveEmergencyCard';
import { EmergencySettingsCard } from '../components/emergency/EmergencySettingsCard';
import { EmergencyTxModal } from '../components/emergency/EmergencyTxModal';
import { Toast } from '../components/shared/Toast';

export const Emergency = () => {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveEmergencySession[]>([]);
  const [trustedEntities, setTrustedEntities] = useState<TrustedEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [currentTxHash, setCurrentTxHash] = useState('');
  const [txStatus, setTxStatus] = useState<'pending' | 'confirmed'>('pending');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requestsData, sessionsData, entitiesData] = await Promise.all([
        emergencyApi.getRequests(),
        emergencyApi.getActiveSessions(),
        emergencyApi.getTrustedEntities()
      ]);
      setRequests(requestsData);
      setActiveSessions(sessionsData);
      setTrustedEntities(entitiesData);
    } catch (error) {
      showToast('Failed to load emergency data', 'error');
    }
  };

  const handleRequestAccess = async (data: { hospital: string; wallet: string; reason: string }) => {
    setIsLoading(true);
    try {
      const result = await emergencyApi.requestAccess(data);
      setCurrentTxHash(result.txHash);
      setTxStatus('pending');
      setTxModalOpen(true);

      // Simulate confirmation
      setTimeout(() => {
        setTxStatus('confirmed');
        setTimeout(() => {
          setTxModalOpen(false);
          showToast('Emergency access request submitted');
          loadData();
        }, 1500);
      }, 2000);
    } catch (error) {
      showToast('Failed to submit request', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    setIsLoading(true);
    try {
      const result = await emergencyApi.approveRequest(requestId);
      setCurrentTxHash(result.txHash);
      setTxStatus('pending');
      setTxModalOpen(true);

      setTimeout(() => {
        setTxStatus('confirmed');
        setTimeout(() => {
          setTxModalOpen(false);
          showToast('Emergency access approved');
          loadData();
        }, 1500);
      }, 2000);
    } catch (error) {
      showToast('Failed to approve request', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (requestId: string) => {
    setIsLoading(true);
    try {
      await emergencyApi.rejectRequest(requestId);
      showToast('Request rejected');
      loadData();
    } catch (error) {
      showToast('Failed to reject request', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const result = await emergencyApi.revokeAccess(sessionId);
      setCurrentTxHash(result.txHash);
      setTxStatus('pending');
      setTxModalOpen(true);

      setTimeout(() => {
        setTxStatus('confirmed');
        setTimeout(() => {
          setTxModalOpen(false);
          showToast('Emergency access revoked');
          loadData();
        }, 1500);
      }, 2000);
    } catch (error) {
      showToast('Failed to revoke access', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpire = async (sessionId: string) => {
    try {
      await emergencyApi.revokeAccess(sessionId);
      showToast('Emergency access expired automatically', 'info');
      loadData();
    } catch (error) {
      console.error('Failed to expire session:', error);
    }
  };

  const handleAddEntity = async (data: { name: string; wallet: string; type: 'hospital' | 'family' }) => {
    setIsLoading(true);
    try {
      await emergencyApi.addTrustedEntity(data);
      showToast(`${data.type === 'hospital' ? 'Hospital' : 'Family member'} added`);
      loadData();
    } catch (error) {
      showToast('Failed to add entity', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const activeSession = activeSessions.find(s => s.status === 'active');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0E9AA7] to-[#0B3D91] text-white p-8 rounded-lg shadow-lg mb-6">
          <h1 className="text-4xl font-bold mb-2">🚨 Emergency Access Management System</h1>
          <p className="text-lg opacity-90">
            Secure temporary access for critical medical situations
          </p>
        </div>

        {/* Emergency Status Banner */}
        {activeSession && (
          <EmergencyStatusBanner
            expiry={activeSession.expiry}
            onExpire={() => handleExpire(activeSession.sessionId)}
          />
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Request Form */}
          <div className="lg:col-span-2">
            <HospitalRequestForm
              onSubmit={handleRequestAccess}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column - Settings */}
          <div>
            <EmergencySettingsCard
              trustedEntities={trustedEntities}
              onAddEntity={handleAddEntity}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Family Approval Panel */}
        <div className="mb-6">
          <FamilyApprovalPanel
            requests={requests}
            onApprove={handleApprove}
            onReject={handleReject}
            isLoading={isLoading}
          />
        </div>

        {/* Active Emergency Sessions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🟢 Active Emergency Sessions</h2>
          {activeSessions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              <p className="text-4xl mb-2">🔒</p>
              <p>No active emergency sessions</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSessions.map((session) => (
                <ActiveEmergencyCard
                  key={session.sessionId}
                  session={session}
                  onRevoke={handleRevoke}
                  onExpire={handleExpire}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Transaction Modal */}
      <EmergencyTxModal
        isOpen={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        txHash={currentTxHash}
        status={txStatus}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};
