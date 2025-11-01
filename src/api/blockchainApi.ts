// Mock API for Blockchain Activity Log

const mockDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 400));

export interface BlockchainLog {
  txHash: string;
  action: string;
  actor: string;
  role: 'Patient' | 'Doctor' | 'Hospital' | 'Guardian' | 'System';
  time: string;
  status: 'Confirmed' | 'Pending' | 'Revoked';
  walletAddress?: string;
  blockNumber?: number;
  gasUsed?: string;
}

export interface FilterParams {
  actor?: string;
  role?: string;
  status?: string;
  dateRange?: [string, string];
}

// In-memory storage with initial mock data
let logs: BlockchainLog[] = [
  {
    txHash: '0xFF11AA22BB33CC44DD55EE66',
    action: 'Access Granted',
    actor: 'Apollo Hospital',
    role: 'Hospital',
    walletAddress: '0xAB12CD34EF56',
    time: '2025-10-20T09:00:00Z',
    status: 'Confirmed',
    blockNumber: 12345678,
    gasUsed: '0.0021 MATIC'
  },
  {
    txHash: '0xFF22BB33CC44DD55EE66FF77',
    action: 'Access Revoked',
    actor: 'Dr Sharma',
    role: 'Doctor',
    walletAddress: '0xDOC123456789',
    time: '2025-10-21T11:00:00Z',
    status: 'Confirmed',
    blockNumber: 12345890,
    gasUsed: '0.0018 MATIC'
  },
  {
    txHash: '0xREQ01234567890ABCDEF',
    action: 'Emergency Access Requested',
    actor: 'Apollo Hospital',
    role: 'Hospital',
    walletAddress: '0xAB12CD34EF56',
    time: '2025-11-01T09:00:00Z',
    status: 'Pending',
    blockNumber: 12346100,
    gasUsed: '0.0015 MATIC'
  },
  {
    txHash: '0xAPR01234567890FEDCBA',
    action: 'Emergency Access Approved',
    actor: 'Family Wallet',
    role: 'Guardian',
    walletAddress: '0xFAMILY123456',
    time: '2025-11-01T09:05:00Z',
    status: 'Confirmed',
    blockNumber: 12346105,
    gasUsed: '0.0022 MATIC'
  },
  {
    txHash: '0xKEY01234567890ABCDEF',
    action: 'Encryption Key Rotated',
    actor: 'Rahul Sharma',
    role: 'Patient',
    walletAddress: '0xPATIENT789012',
    time: '2025-10-25T14:30:00Z',
    status: 'Confirmed',
    blockNumber: 12345950,
    gasUsed: '0.0025 MATIC'
  },
  {
    txHash: '0xUPL01234567890FEDCBA',
    action: 'Medical Record Uploaded',
    actor: 'Rahul Sharma',
    role: 'Patient',
    walletAddress: '0xPATIENT789012',
    time: '2025-10-28T10:15:00Z',
    status: 'Confirmed',
    blockNumber: 12346000,
    gasUsed: '0.0032 MATIC'
  },
  {
    txHash: '0xRVK01234567890ABCDEF',
    action: 'Emergency Access Revoked',
    actor: 'System',
    role: 'System',
    walletAddress: '0xSYSTEM000000',
    time: '2025-11-01T10:05:00Z',
    status: 'Confirmed',
    blockNumber: 12346110,
    gasUsed: '0.0019 MATIC'
  }
];

export const blockchainApi = {
  // Get all blockchain logs
  async getLogs() {
    await mockDelay();
    return [...logs].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  },

  // Filter logs
  async filterLogs(params: FilterParams) {
    await mockDelay();
    let filtered = [...logs];

    if (params.actor) {
      filtered = filtered.filter(log => 
        log.actor.toLowerCase().includes(params.actor!.toLowerCase())
      );
    }

    if (params.role && params.role !== 'All') {
      filtered = filtered.filter(log => log.role === params.role);
    }

    if (params.status && params.status !== 'All') {
      filtered = filtered.filter(log => log.status === params.status);
    }

    if (params.dateRange && params.dateRange[0] && params.dateRange[1]) {
      const [start, end] = params.dateRange;
      filtered = filtered.filter(log => {
        const logTime = new Date(log.time).getTime();
        return logTime >= new Date(start).getTime() && logTime <= new Date(end).getTime();
      });
    }

    return filtered.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  },

  // Add new log (for simulation)
  async addLog(log: Omit<BlockchainLog, 'blockNumber' | 'gasUsed'>) {
    await mockDelay();
    const newLog: BlockchainLog = {
      ...log,
      blockNumber: 12346000 + Math.floor(Math.random() * 1000),
      gasUsed: `0.00${Math.floor(Math.random() * 30) + 15} MATIC`
    };
    logs.unshift(newLog);
    return newLog;
  },

  // Get summary stats
  async getStats() {
    await mockDelay();
    const total = logs.length;
    const confirmed = logs.filter(l => l.status === 'Confirmed').length;
    const pending = logs.filter(l => l.status === 'Pending').length;
    const revoked = logs.filter(l => l.status === 'Revoked').length;

    return {
      total,
      confirmed,
      pending,
      revoked,
      confirmedPercent: Math.round((confirmed / total) * 100),
      pendingPercent: Math.round((pending / total) * 100),
      revokedPercent: Math.round((revoked / total) * 100),
      lastSync: new Date().toISOString()
    };
  }
};
