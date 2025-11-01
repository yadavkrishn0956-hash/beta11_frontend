import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Icon } from '../shared/Icon';
import { recordsApiService } from '../../api/recordsApi';

interface UploadPanelProps {
  onUploadComplete: (data: any) => void;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
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

    // Simulate upload progress
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
      const result = await recordsApiService.uploadRecord(file);
      setProgress(100);
      setTimeout(() => {
        onUploadComplete(result);
        setUploading(false);
        setProgress(0);
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Card title="Upload Medical Record">
      <div className="space-y-4">
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
              <Icon name="records" size={32} className="text-primary" />
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-1">
                Drag & drop your file here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <Button
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-2"
            >
              📤 Select File
            </Button>
          </div>
        </div>

        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uploading...</span>
              <span className="text-primary font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>✓ Supported formats: PDF, JPG, PNG</p>
          <p>✓ Max file size: 10MB</p>
          <p>✓ Encrypted & stored on IPFS</p>
        </div>
      </div>
    </Card>
  );
};
