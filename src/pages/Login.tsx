import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/shared/Button';
import { Icon } from '../components/shared/Icon';
import { WalletConnect } from '../components/shared/WalletConnect';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'wallet'>('email');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation
      if (email === 'patient@meditrust.ai' && password === 'demo123') {
        localStorage.setItem('userRole', 'patient');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = '/';
      } else if (email === 'patient@meditrust.ai' && password === 'demo123') {
  localStorage.setItem('userRole', 'patient');
  localStorage.setItem('userEmail', email);
  localStorage.setItem('isAuthenticated', 'true');
  window.location.href = '/';
} else if (email === 'doctor@meditrust.ai' && password === 'demo123') {
  localStorage.setItem('userRole', 'doctor');
  localStorage.setItem('userEmail', email);
  localStorage.setItem('isAuthenticated', 'true');
  window.location.href = '/doctor';
} else if (email === 'lab@meditrust.ai' && password === 'demo123') {
  localStorage.setItem('userRole', 'lab');
  localStorage.setItem('userEmail', email);
  localStorage.setItem('isAuthenticated', 'true');
  window.location.href = '/lab';
} else {
  setError('Invalid email or password. Please try again.');
}
    }
  }