// Mock API for Medical Records

export const mockDelay = () => Math.random() * 400 + 400; // 400-800ms

export interface MedicalRecord {
  id: string;
  title: string;
  type: 'Lab' | 'Radiology' | 'Prescription' | 'MRI';
  date: string;
  hospital: string;
  ipfsCid: string;
  txHash: string;
  aiSummary: string;
  verified: boolean;
}

export const mockRecords: MedicalRecord[] = [
  {
    id: "r001",
    title: "Blood Test Report",
    type: "Lab",
    date: "2025-10-20",
    hospital: "Apollo Hospitals",
    ipfsCid: "bafybeiblood123",
    txHash: "0xAB12CD",
    aiSummary: "Slight glucose elevation noted; hemoglobin normal.",
    verified: true
  },
  {
    id: "r002",
    title: "MRI Scan",
    type: "MRI",
    date: "2025-09-18",
    hospital: "Medanta",
    ipfsCid: "bafybeimri456",
    txHash: "0xAC34EF",
    aiSummary: "No abnormal lesions detected.",
    verified: true
  },
  {
    id: "r003",
    title: "Prescription - Diabetes",
    type: "Prescription",
    date: "2025-10-15",
    hospital: "Fortis Healthcare",
    ipfsCid: "bafybeipres789",
    txHash: "0xAD78GH",
    aiSummary: "Metformin 500mg prescribed twice daily. Monitor blood sugar levels.",
    verified: true
  }
];

export const recordsApiService = {
  getRecords: async (): Promise<MedicalRecord[]> => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    return mockRecords;
  },

  getRecordById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    const record = mockRecords.find(r => r.id === id);
    return {
      ...record,
      signedUrl: `https://ipfs.io/ipfs/${record?.ipfsCid}`
    };
  },

  uploadRecord: async (_file: File) => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    return {
      ipfsCid: `bafynew${Math.random().toString(36).substr(2, 9)}`,
      txHash: `0x${Math.random().toString(16).substr(2, 6).toUpperCase()}`,
      aiSummary: "Report shows stable health indicators. All parameters within normal range."
    };
  },

  explainRecord: async (recordId: string) => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    const record = mockRecords.find(r => r.id === recordId);
    return {
      reply: `This ${record?.type} report from ${record?.hospital} shows: ${record?.aiSummary}`,
      explanation: "The AI analysis indicates that your health metrics are within acceptable ranges. Continue monitoring as advised by your healthcare provider."
    };
  }
};
