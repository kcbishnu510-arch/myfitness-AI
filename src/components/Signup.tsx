'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';

interface SignupProps {
  onSignupComplete: () => void;
  initialFitnessData?: {
    weight: number | '';
    weightUnit: 'kg' | 'lbs';
    heightFeet: number | '';
    heightInches: number | '';
    heightCm: number | '';
    heightUnit: 'cm' | 'ft';
    age: number | '';
    sex: 'male' | 'female' | '';
    activityLevel: string;
    goal: 'bulk' | 'cut' | 'maintain' | '';
  };
}

const Signup: React.FC<SignupProps> = ({ onSignupComplete, initialFitnessData }) => {
  const { login } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Create user profile
    const userProfile = {
      name,
      email,
      password, // NOTE: In a real app, this should be hashed. Stored in plain text for demo purposes only.
      weight: initialFitnessData?.weight ?? '',
      weightUnit: initialFitnessData?.weightUnit ?? 'kg',
      heightFeet: initialFitnessData?.heightFeet ?? '',
      heightInches: initialFitnessData?.heightInches ?? '',
      heightCm: initialFitnessData?.heightCm ?? '',
      heightUnit: initialFitnessData?.heightUnit ?? 'cm',
      age: initialFitnessData?.age ?? '',
      sex: initialFitnessData?.sex ?? '',
      activityLevel: initialFitnessData?.activityLevel ?? 'Sedentary',
      goal: initialFitnessData?.goal ?? '',
    };
    
    // Save to context and localStorage
    login(userProfile);
    
    // Clear form
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    
    // Notify parent component
    onSignupComplete();
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 shadow-lg border border-white/50 max-w-md w-full mx-auto">
      <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-4 text-center">Create Account</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Create a password"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 xs:px-4 py-2 xs:py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Confirm your password"
          />
        </div>
        
        <motion.button
          type="submit"
          className="w-full py-2 xs:py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium hover:shadow-lg transition-shadow shadow-md"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Sign Up
        </motion.button>
      </form>
    </div>
  );
};

export default Signup;