import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { aiApiService, ImageAnalysisResult } from '../../api/aiApi';

interface ImageAnalyzerProps {
  onExplain: (explanation: string) => void;
}

export const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ onExplain }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setResult(null);

    // Create image URL for preview
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const analysis = await aiApiService.analyzeImage(file);
      setProgress(100);
      setTimeout(() => {
        setResult(analysis);
        setUploading(false);
        setProgress(0);
      }, 500);
    } catch (error) {
      console.error('Image analysis error:', error);
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Card title="Medical Image Analyzer">
      <div className="space-y-4">
        {!imageUrl ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">🔬</span>
              </div>
              <div>
                <p className="text-gray-700 font-medium mb-1">
                  Upload Medical Image
                </p>
                <p className="text-sm text-gray-500">
                  X-ray, ECG, MRI, or CT scan
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*"
              />
              <Button
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                📷 Select Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview with Highlights */}
            <div className="relative border rounded-lg overflow-hidden bg-gray-900">
              <img
                src={imageUrl}
                alt="Medical scan"
                className="w-full h-auto"
              />
              {result?.highlights.map((highlight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute border-2 border-red-500 bg-red-500/20"
                  style={{
                    left: `${(highlight.x / 500) * 100}%`,
                    top: `${(highlight.y / 500) * 100}%`,
                    width: `${(highlight.w / 500) * 100}%`,
                    height: `${(highlight.h / 500) * 100}%`
                  }}
                />
              ))}
            </div>

            {uploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Analyzing...</span>
                  <span className="text-primary font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h4 className="font-semibold text-gray-900">Analysis Results:</h4>
                {result.findings.map((finding, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{finding.label}</span>
                      <span className="text-sm text-gray-600">
                        {(finding.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${finding.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="bg-blue-50 border-l-4 border-primary p-3 rounded">
                  <p className="text-sm text-gray-700">{result.explanation}</p>
                </div>

                <Button
                  variant="primary"
                  onClick={() => onExplain(result.explanation)}
                  className="w-full"
                >
                  💡 Explain Analysis
                </Button>

                <button
                  onClick={() => {
                    setImageUrl(null);
                    setResult(null);
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-800"
                >
                  Upload Another Image
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
