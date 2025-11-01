// Mock API data and endpoints for MediTrust AI

export const mockDelay = () => Math.random() * 400 + 400; // 400-800ms

export const mockPatientOverview = {
  healthScore: 84,
  vitals: {
    sugar: 98,
    bp: "120/80",
    bmi: 22.4,
    cholesterol: 180,
  },
  lastUpdated: "2025-11-01T10:00:00Z",
};

export const mockTrends = [
  { date: "2025-10-25", sugar: 96, bp: 118 },
  { date: "2025-10-26", sugar: 99, bp: 120 },
  { date: "2025-10-27", sugar: 100, bp: 122 },
  { date: "2025-10-28", sugar: 94, bp: 116 },
  { date: "2025-10-29", sugar: 97, bp: 118 },
  { date: "2025-10-30", sugar: 98, bp: 119 },
  { date: "2025-10-31", sugar: 101, bp: 121 },
];

export const mockReminders = [
  "Blood test on 5 Nov 2025",
  "Doctor appointment tomorrow",
  "Medication refill on 7 Nov 2025",
];

export const mockBlockchainStatus = {
  wallet: "0xA3F291B2",
  lastVerified: "2h ago",
  lastTx: "0xAB12CD",
  status: "Synced",
};

export const mockAIResponse = {
  reply: "Your health score is 84, based on stable vitals and normal sugar levels.",
  explanation: "BP and sugar levels within healthy range, slight cholesterol rise detected.",
};

// Mock API functions
export const apiService = {
  getPatientOverview: async () => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    return mockPatientOverview;
  },

  getPatientTrends: async (days: number = 7) => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    return days === 7 ? mockTrends : [...mockTrends, ...mockTrends];
  },

  getReminders: async () => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    return mockReminders;
  },

  getBlockchainStatus: async () => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    return mockBlockchainStatus;
  },

  chatWithAI: async (_message: string) => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    return mockAIResponse;
  },
};
