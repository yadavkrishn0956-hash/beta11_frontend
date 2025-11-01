// Mock API for Feedback & Reputation System

const mockDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 400));

export interface Feedback {
  id: string;
  entity: string;
  role: 'Doctor' | 'Hospital';
  rating: number;
  review: string;
  txHash: string;
  time: string;
  wallet?: string;
}

export interface FeedbackAverages {
  Doctor: number;
  Hospital: number;
  TotalFeedbacks: number;
}

// In-memory storage
let feedbacks: Feedback[] = [
  {
    id: 'f001',
    entity: 'Apollo Hospital',
    role: 'Hospital',
    rating: 4.5,
    review: 'Professional staff and timely reports. Very satisfied with the service.',
    txHash: '0xFB001234567890ABCDEF',
    time: '2025-10-30T09:00:00Z',
    wallet: '0xPATIENT123456'
  },
  {
    id: 'f002',
    entity: 'Dr. Sharma',
    role: 'Doctor',
    rating: 4.8,
    review: 'Accurate diagnosis and helpful advice. Highly recommended!',
    txHash: '0xFB002234567890FEDCBA',
    time: '2025-10-31T11:00:00Z',
    wallet: '0xPATIENT789012'
  },
  {
    id: 'f003',
    entity: 'Medanta Hospital',
    role: 'Hospital',
    rating: 4.2,
    review: 'Good facilities but waiting time could be improved.',
    txHash: '0xFB003234567890ABCDEF',
    time: '2025-10-28T14:30:00Z',
    wallet: '0xPATIENT345678'
  },
  {
    id: 'f004',
    entity: 'Dr. Patel',
    role: 'Doctor',
    rating: 4.9,
    review: 'Excellent doctor with great bedside manner. Very thorough examination.',
    txHash: '0xFB004234567890FEDCBA',
    time: '2025-10-29T10:15:00Z',
    wallet: '0xPATIENT901234'
  },
  {
    id: 'f005',
    entity: 'Max Hospital',
    role: 'Hospital',
    rating: 4.6,
    review: 'State-of-the-art equipment and caring staff.',
    txHash: '0xFB005234567890ABCDEF',
    time: '2025-10-27T16:45:00Z',
    wallet: '0xPATIENT567890'
  }
];

export const feedbackApi = {
  // Get all feedbacks
  async getFeedbackList() {
    await mockDelay();
    return [...feedbacks].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  },

  // Submit new feedback
  async submitFeedback(data: {
    entity: string;
    role: 'Doctor' | 'Hospital';
    rating: number;
    review: string;
    wallet: string;
  }) {
    await mockDelay();
    
    const newFeedback: Feedback = {
      id: `f${Date.now().toString().slice(-6)}`,
      entity: data.entity,
      role: data.role,
      rating: data.rating,
      review: data.review,
      txHash: `0xFB${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      time: new Date().toISOString(),
      wallet: data.wallet
    };
    
    feedbacks.unshift(newFeedback);
    
    return {
      txHash: newFeedback.txHash,
      status: 'recorded'
    };
  },

  // Get average ratings
  async getAverages() {
    await mockDelay();
    
    const doctorFeedbacks = feedbacks.filter(f => f.role === 'Doctor');
    const hospitalFeedbacks = feedbacks.filter(f => f.role === 'Hospital');
    
    const doctorAvg = doctorFeedbacks.length > 0
      ? doctorFeedbacks.reduce((sum, f) => sum + f.rating, 0) / doctorFeedbacks.length
      : 0;
    
    const hospitalAvg = hospitalFeedbacks.length > 0
      ? hospitalFeedbacks.reduce((sum, f) => sum + f.rating, 0) / hospitalFeedbacks.length
      : 0;
    
    return {
      Doctor: Math.round(doctorAvg * 10) / 10,
      Hospital: Math.round(hospitalAvg * 10) / 10,
      TotalFeedbacks: feedbacks.length
    };
  },

  // Get top rated entities
  async getTopRated() {
    await mockDelay();
    
    // Group by entity and calculate average
    const entityMap = new Map<string, { entity: string; role: 'Doctor' | 'Hospital'; ratings: number[] }>();
    
    feedbacks.forEach(f => {
      if (!entityMap.has(f.entity)) {
        entityMap.set(f.entity, { entity: f.entity, role: f.role, ratings: [] });
      }
      entityMap.get(f.entity)!.ratings.push(f.rating);
    });
    
    const topRated = Array.from(entityMap.values())
      .map(item => ({
        entity: item.entity,
        role: item.role,
        avgRating: item.ratings.reduce((sum, r) => sum + r, 0) / item.ratings.length,
        count: item.ratings.length
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3);
    
    return topRated;
  }
};
