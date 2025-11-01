// Mock API for AI Health Assistant

export const mockDelay = () => Math.random() * 500 + 400; // 400-900ms

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  explanation?: string;
}

export interface ImageAnalysisResult {
  findings: Array<{
    label: string;
    confidence: number;
  }>;
  highlights: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
  explanation: string;
}

const generateAIResponse = (message: string): { reply: string; explanation: string } => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('fever') || lowerMessage.includes('cough')) {
    return {
      reply: "I understand you're experiencing fever and cough. These symptoms could indicate a respiratory infection. I recommend monitoring your temperature, staying hydrated, and consulting with your doctor if symptoms persist for more than 3 days or worsen.",
      explanation: "Keywords detected: 'fever', 'cough'. These are common symptoms of respiratory infections. The AI considers your recent health data and suggests monitoring and medical consultation based on symptom severity patterns."
    };
  }
  
  if (lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
    return {
      reply: "I'm sorry to hear you're in pain. Can you describe where the pain is located and its intensity (1-10)? This will help me provide better guidance.",
      explanation: "Pain-related keywords detected. The AI is gathering more specific information to provide accurate recommendations based on pain location and severity."
    };
  }
  
  if (lowerMessage.includes('sugar') || lowerMessage.includes('diabetes') || lowerMessage.includes('glucose')) {
    return {
      reply: "Based on your recent blood sugar readings (98 mg/dL), your glucose levels are within normal range. Continue monitoring regularly and maintain your current diet and medication schedule.",
      explanation: "Diabetes-related query detected. AI accessed your latest vitals showing sugar level at 98 mg/dL (normal range: 70-100 mg/dL fasting). Recommendation based on stable readings."
    };
  }
  
  if (lowerMessage.includes('pressure') || lowerMessage.includes('bp')) {
    return {
      reply: "Your latest blood pressure reading is 120/80 mmHg, which is in the optimal range. Keep up with your healthy lifestyle habits!",
      explanation: "Blood pressure query detected. AI retrieved your most recent BP reading (120/80 mmHg) which falls within the normal range (< 120/80 mmHg)."
    };
  }
  
  return {
    reply: "I'm here to help with your health questions. You can ask me about your symptoms, recent test results, medications, or general health advice. How can I assist you today?",
    explanation: "General health query. AI is ready to provide information based on your medical history, recent vitals, and symptom descriptions."
  };
};

export const aiApiService = {
  chat: async (message: string, _context?: any): Promise<{ reply: string; explanation: string }> => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    return generateAIResponse(message);
  },

  analyzeImage: async (file: File): Promise<ImageAnalysisResult> => {
    await new Promise(resolve => setTimeout(resolve, mockDelay()));
    
    // Simulate different findings based on file name
    const fileName = file.name.toLowerCase();
    
    if (fileName.includes('xray') || fileName.includes('chest')) {
      return {
        findings: [
          { label: 'Pneumonia', confidence: 0.87 },
          { label: 'No fracture', confidence: 0.12 },
          { label: 'Normal heart size', confidence: 0.95 }
        ],
        highlights: [
          { x: 120, y: 80, w: 220, h: 160 }
        ],
        explanation: "Model detected patchy opacity consistent with pneumonia in left lower lobe. The AI analyzed lung field density patterns and identified an area of consolidation. Confidence: 87%. Recommend clinical correlation and follow-up imaging."
      };
    }
    
    if (fileName.includes('ecg') || fileName.includes('ekg')) {
      return {
        findings: [
          { label: 'Normal sinus rhythm', confidence: 0.92 },
          { label: 'No ST elevation', confidence: 0.88 }
        ],
        highlights: [
          { x: 50, y: 100, w: 300, h: 80 }
        ],
        explanation: "ECG analysis shows normal sinus rhythm with regular intervals. No signs of ischemia or arrhythmia detected. Heart rate within normal range."
      };
    }
    
    // Default generic medical image analysis
    return {
      findings: [
        { label: 'No abnormalities detected', confidence: 0.91 },
        { label: 'Image quality: Good', confidence: 0.95 }
      ],
      highlights: [],
      explanation: "AI analysis completed. No significant abnormalities detected in the uploaded medical image. Image quality is sufficient for diagnostic purposes."
    };
  }
};
