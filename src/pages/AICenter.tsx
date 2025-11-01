import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Chatbot } from '../components/ai/Chatbot';
import { ImageAnalyzer } from '../components/ai/ImageAnalyzer';
import { ContextPanel } from '../components/ai/ContextPanel';
import { ExplainDrawer } from '../components/ai/ExplainDrawer';

export const AICenter: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [showImageAnalyzer, setShowImageAnalyzer] = useState(false);

  const handleExplain = (exp: string) => {
    setExplanation(exp);
    setDrawerOpen(true);
  };

  const handleImageUpload = () => {
    setShowImageAnalyzer(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <a href="/" className="hover:text-primary transition-colors">Overview</a>
          <span>→</span>
          <span className="text-gray-900">AI Health Assistant</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Health Assistant Center
        </h1>
        <p className="text-gray-600">
          Get personalized health guidance, analyze medical images, and understand your health data with AI
        </p>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chatbot */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <Chatbot 
            onExplain={handleExplain}
            onImageUpload={handleImageUpload}
          />
          
          {showImageAnalyzer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ImageAnalyzer onExplain={handleExplain} />
            </motion.div>
          )}
        </motion.div>

        {/* Right Column - Context Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ContextPanel />
        </motion.div>
      </div>

      {/* Explain Drawer */}
      <ExplainDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        explanation={explanation}
      />
    </div>
  );
};
