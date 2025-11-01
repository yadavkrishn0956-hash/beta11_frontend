// Mock API for Interoperability & Integration Hub

const mockDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 400));

export interface FHIRRecord {
  recordId: string;
  type: string;
  format: string;
  status: 'Synced' | 'Pending' | 'Failed';
  lastSync: string;
}

export interface WearableDevice {
  id: string;
  name: string;
  connected: boolean;
  steps?: number;
  hr?: number;
  battery?: number;
  lastSync?: string;
}

export interface ABDMStatus {
  linked: boolean;
  lastSync: string;
  healthId: string;
}

// In-memory storage
let fhirRecords: FHIRRecord[] = [
  {
    recordId: 'r001',
    type: 'Lab Report',
    format: 'FHIR-R4',
    status: 'Synced',
    lastSync: '2025-10-30T08:00:00Z'
  },
  {
    recordId: 'r002',
    type: 'Prescription',
    format: 'FHIR-R4',
    status: 'Pending',
    lastSync: '2025-10-31T14:00:00Z'
  },
  {
    recordId: 'r003',
    type: 'Diagnostic Report',
    format: 'FHIR-R4',
    status: 'Synced',
    lastSync: '2025-10-29T10:30:00Z'
  }
];

let wearableDevices: WearableDevice[] = [
  {
    id: 'w001',
    name: 'Fitbit Sense',
    connected: true,
    steps: 7421,
    hr: 81,
    battery: 78,
    lastSync: new Date().toISOString()
  },
  {
    id: 'w002',
    name: 'Apple Watch',
    connected: false,
    steps: 0,
    hr: 0,
    battery: 0
  },
  {
    id: 'w003',
    name: 'Samsung Galaxy Watch',
    connected: true,
    steps: 5234,
    hr: 75,
    battery: 92,
    lastSync: new Date().toISOString()
  }
];

let abdmStatus: ABDMStatus = {
  linked: true,
  lastSync: '2025-11-01T09:00:00Z',
  healthId: 'ABDM-9988-4455'
};

export const integrationApi = {
  // Get FHIR records
  async getFHIRRecords() {
    await mockDelay();
    return fhirRecords;
  },

  // Sync FHIR record
  async syncFHIR(recordId: string) {
    await mockDelay();
    const record = fhirRecords.find(r => r.recordId === recordId);
    if (record) {
      record.status = 'Synced';
      record.lastSync = new Date().toISOString();
    }
    return {
      txHash: `0xFHIR${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      status: 'success'
    };
  },

  // Get wearable devices
  async getWearables() {
    await mockDelay();
    return { devices: wearableDevices };
  },

  // Connect/disconnect wearable
  async connectWearable(deviceId: string, connect: boolean) {
    await mockDelay();
    const device = wearableDevices.find(d => d.id === deviceId);
    if (device) {
      device.connected = connect;
      if (connect) {
        device.steps = Math.floor(Math.random() * 10000);
        device.hr = Math.floor(Math.random() * 40) + 60;
        device.battery = Math.floor(Math.random() * 50) + 50;
        device.lastSync = new Date().toISOString();
      }
    }
    return {
      device: device?.name,
      status: connect ? 'connected' : 'disconnected'
    };
  },

  // Update wearable metrics (for real-time simulation)
  async updateWearableMetrics() {
    await mockDelay();
    wearableDevices.forEach(device => {
      if (device.connected) {
        device.steps = (device.steps || 0) + Math.floor(Math.random() * 50);
        device.hr = Math.floor(Math.random() * 40) + 60;
        device.battery = Math.max(0, (device.battery || 100) - Math.random() * 0.5);
        device.lastSync = new Date().toISOString();
      }
    });
    return { devices: wearableDevices };
  },

  // Get ABDM status
  async getABDMStatus() {
    await mockDelay();
    return abdmStatus;
  },

  // Sync with ABDM
  async syncABDM() {
    await mockDelay();
    abdmStatus.lastSync = new Date().toISOString();
    return {
      txHash: `0xABDM${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      status: 'completed'
    };
  },

  // Get integration summary
  async getSummary() {
    await mockDelay();
    const totalFHIR = fhirRecords.length;
    const syncedFHIR = fhirRecords.filter(r => r.status === 'Synced').length;
    const activeWearables = wearableDevices.filter(d => d.connected).length;
    
    return {
      totalFHIR,
      syncedFHIR,
      syncedPercent: Math.round((syncedFHIR / totalFHIR) * 100),
      activeWearables,
      abdmLinked: abdmStatus.linked
    };
  }
};
