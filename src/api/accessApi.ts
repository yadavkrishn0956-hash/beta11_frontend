// Mock API for Access & Privacy Control

export const mockDelay = () => Math.random() * 400 + 400; // 400-800ms

export interface AccessPermission {
  id: string;
  entity: string;
  role: 'Hospital' | 'Doctor' | 'Lab';
  wallet: string;
  scope: string;
  grantedOn: string;
  expiry: string;
  txHash: string;
  status: 'Active' | 'Expired' | 'Revoked';
}

export interface GrantAccessRequest {
  entity: string;
  wallet: string;
  scope: string;
  expiry: string;
}

const mockPermissions: AccessPermission[] = [
  {
    id: "a001",
    entity: "Apollo Hospital",
    role: "Hospital",
    wallet: "0xAB12CD",
    scope: "View Reports",
    grantedOn: "2025-10-20",
    expiry: "2025-11-03",
    txHash: "0xFF11AA",
    status: "Active"
  },
  {
    id: "a002",
    entity: "Dr Sharma",
    role: "Doctor",
    wallet: "0xCC98EF",
    scope: "Read-Only",
    grantedOn: "2025-10-22",
    expiry: "2025-11-02",
    txHash: "0xFF22BB",
    status: "Expired"
  },
  {
    id: "a003",
    entity: "Medanta Lab",
    role: "Lab",
    wallet: "0xDD45GH",
    scope: "View Lab Results",
    grantedOn: "2025-10-25",
    expiry: "2025-12-25",
    txHash: "0xFF33CC",
    status: "Active"
  }
];

let permissions = [...mockPermissions];
let currentKey = "***9F4A";

export const accessApiService = {
  getAccessList: async (): Promise<AccessPermission[]> => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    return permissions;
  },

  grantAccess: async (request: GrantAccessRequest): Promise<{ txHash: string; status: string }> => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    
    const txHash = `0x${Math.random().toString(16).substr(2, 6).toUpperCase()}`;
    
    // Simulate pending status
    const response = { txHash, status: 'pending' };
    
    // After 1 second, add to permissions
    setTimeout(() => {
      const newPermission: AccessPermission = {
        id: `a${Date.now()}`,
        entity: request.entity,
        role: 'Doctor', // Default role
        wallet: request.wallet,
        scope: request.scope,
        grantedOn: new Date().toISOString().split('T')[0],
        expiry: request.expiry,
        txHash,
        status: 'Active'
      };
      permissions.unshift(newPermission);
    }, 1000);
    
    return response;
  },

  revokeAccess: async (id: string): Promise<{ txHash: string; status: string }> => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    
    const txHash = `0x${Math.random().toString(16).substr(2, 6).toUpperCase()}`;
    
    // Remove permission
    permissions = permissions.filter(p => p.id !== id);
    
    return { txHash, status: 'confirmed' };
  },

  rotateKey: async (): Promise<{ txHash: string; newKeyMasked: string }> => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    
    const txHash = `0x${Math.random().toString(16).substr(2, 6).toUpperCase()}`;
    const newKey = `***${Math.random().toString(16).substr(2, 4).toUpperCase()}`;
    
    currentKey = newKey;
    
    return { txHash, newKeyMasked: newKey };
  },

  getCurrentKey: () => currentKey
};
