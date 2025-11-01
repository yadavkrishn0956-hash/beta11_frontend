// Mock API for Emergency Access Management System

const mockDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 400));

export interface EmergencyRequest {
  requestId: string;
  hospital: string;
  wallet: string;
  reason?: string;
  txHash: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

export interface ActiveEmergencySession {
  sessionId: string;
  hospital: string;
  patient: string;
  wallet: string;
  txHash: string;
  expiry: string;
  status: 'active' | 'expired' | 'revoked';
  approvedAt: string;
}

export interface TrustedEntity {
  id: string;
  name: string;
  wallet: string;
  type: 'hospital' | 'family';
}

// In-memory storage
let requests: EmergencyRequest[] = [
  {
    requestId: 'req001',
    hospital: 'Apollo Hospital',
    wallet: '0xAB12CD34EF56',
    reason: 'Patient unconscious, requires immediate medical history',
    txHash: '0xREQ01234567890ABCDEF',
    status: 'pending',
    requestedAt: new Date().toISOString()
  }
];

let activeSessions: ActiveEmergencySession[] = [];

let trustedEntities: TrustedEntity[] = [
  { id: 'h1', name: 'Apollo Hospital', wallet: '0xAB12CD34EF56', type: 'hospital' },
  { id: 'h2', name: 'Medanta Hospital', wallet: '0x1234567890AB', type: 'hospital' },
  { id: 'f1', name: 'Priya Sharma (Wife)', wallet: '0xFAMILY123456', type: 'family' },
  { id: 'f2', name: 'Amit Sharma (Son)', wallet: '0xFAMILY789012', type: 'family' }
];

export const emergencyApi = {
  // Request emergency access
  async requestAccess(data: { hospital: string; wallet: string; reason: string }) {
    await mockDelay();
    const requestId = `req${Date.now().toString().slice(-6)}`;
    const txHash = `0xREQ${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
    
    const newRequest: EmergencyRequest = {
      requestId,
      hospital: data.hospital,
      wallet: data.wallet,
      reason: data.reason,
      txHash,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };
    
    requests.push(newRequest);
    
    return {
      requestId,
      hospital: data.hospital,
      wallet: data.wallet,
      txHash,
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    };
  },

  // Get all pending requests
  async getRequests() {
    await mockDelay();
    return requests.filter(r => r.status === 'pending');
  },

  // Approve emergency request
  async approveRequest(requestId: string) {
    await mockDelay();
    const request = requests.find(r => r.requestId === requestId);
    if (!request) throw new Error('Request not found');
    
    request.status = 'approved';
    const txHash = `0xAPR${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
    const expiry = new Date(Date.now() + 60 * 1000).toISOString(); // 60 seconds for demo
    
    const session: ActiveEmergencySession = {
      sessionId: `ses${Date.now().toString().slice(-6)}`,
      hospital: request.hospital,
      patient: 'Rahul Sharma',
      wallet: request.wallet,
      txHash,
      expiry,
      status: 'active',
      approvedAt: new Date().toISOString()
    };
    
    activeSessions.push(session);
    
    return {
      txHash,
      status: 'approved',
      expiry
    };
  },

  // Reject emergency request
  async rejectRequest(requestId: string) {
    await mockDelay();
    const request = requests.find(r => r.requestId === requestId);
    if (!request) throw new Error('Request not found');
    
    request.status = 'rejected';
    requests = requests.filter(r => r.requestId !== requestId);
    
    return {
      txHash: `0xREJ${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      status: 'rejected'
    };
  },

  // Get active emergency sessions
  async getActiveSessions() {
    await mockDelay();
    return activeSessions.filter(s => s.status === 'active');
  },

  // Revoke emergency access
  async revokeAccess(sessionId: string) {
    await mockDelay();
    const session = activeSessions.find(s => s.sessionId === sessionId);
    if (!session) throw new Error('Session not found');
    
    session.status = 'revoked';
    
    return {
      txHash: `0xRVK${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      status: 'revoked'
    };
  },

  // Get trusted entities
  async getTrustedEntities() {
    await mockDelay();
    return trustedEntities;
  },

  // Add trusted entity
  async addTrustedEntity(data: { name: string; wallet: string; type: 'hospital' | 'family' }) {
    await mockDelay();
    const newEntity: TrustedEntity = {
      id: `${data.type[0]}${Date.now().toString().slice(-6)}`,
      name: data.name,
      wallet: data.wallet,
      type: data.type
    };
    
    trustedEntities.push(newEntity);
    
    return newEntity;
  }
};
