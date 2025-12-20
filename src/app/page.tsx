'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import InputForm from '@/components/InputForm';
import ResultsCard from '@/components/ResultsCard';
import ChatWidget from '@/components/ChatWidget';
import Login from '@/components/Login';
import Signup from '@/components/Signup';
import { useUser } from '@/context/UserContext';

interface ResultsData {
  maintenanceCalories: number;
  goalCalories: { min: number; max: number };
  protein: { min: number; max: number };
  fats: { min: number; max: number };
  carbs: { min: number; max: number };
}

// Add this interface for user details
interface UserDetails {
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
}

// Add interface for quick tips
interface QuickTip {
  id: number;
  text: string;
}

export default function Home() {
  const { user, updateUser } = useUser();
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({ // Add user details state
    weight: '',
    weightUnit: 'kg',
    heightFeet: '',
    heightInches: '',
    heightCm: '',
    heightUnit: 'cm',
    age: '',
    sex: '',
    activityLevel: 'Sedentary',
    goal: ''
  });
  const [quickTips, setQuickTips] = useState<QuickTip[]>([]); // Add quick tips state

  const handleResults = (resultsData: ResultsData) => {
    setResults(resultsData);
    setShowResults(true);
    // Generate quick tips when results are shown
    generateQuickTips();
  };

  const handleRecalculate = () => {
    setShowResults(false);
    setResults(null);
    setQuickTips([]);
  };

  // Add function to update user details
  const handleUserDetailsUpdate = (details: UserDetails) => {
    setUserDetails(details);
  };

  // Generate quick fitness tips
  const generateQuickTips = () => {
    const tips = [
      { id: 1, text: "Stay hydrated - aim for 8-10 glasses of water daily." },
      { id: 2, text: "Get 7-9 hours of quality sleep for optimal recovery." },
      { id: 3, text: "Focus on progressive overload in your workouts." },
      { id: 4, text: "Include both cardio and strength training in your routine." },
      { id: 5, text: "Track your progress with photos, not just the scale." },
      { id: 6, text: "Warm up before and cool down after every workout." },
      { id: 7, text: "Eat a balanced meal with protein within 2 hours post-workout." },
      { id: 8, text: "Listen to your body - rest when you feel overly fatigued." }
    ];
    
    // Select 3 random tips
    const shuffled = [...tips].sort(() => 0.5 - Math.random());
    setQuickTips(shuffled.slice(0, 3));
  };

  // Show signup form
  const showSignupForm = () => {
    // No-op since we're removing login requirement
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900">
      <Header />
      
      <main className="container mx-auto px-3 xs:px-4 py-4 xs:py-6 md:py-8">
        <motion.div
          className="text-center py-6 xs:py-8 md:py-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 xs:mb-4 md:mb-6 bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            MyFitnessAI
          </motion.h1>
          
          <motion.p 
            className="text-base xs:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto mb-6 xs:mb-8 md:mb-16 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Your smart assistant for calories, macros & personalized workouts
          </motion.p>
          
          {/* Welcome message for first-time visitors */}
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 shadow-xl border border-white/50 max-w-3xl mx-auto mb-8 xs:mb-10 md:mb-16 hover-lift"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 xs:mb-4">Welcome to MyFitnessAI!</h2>
            <p className="text-gray-700 text-sm xs:text-base md:text-lg mb-4">
              Get personalized nutrition recommendations and AI-powered workout plans tailored to your goals.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 xs:gap-4">
              <div className="flex items-center justify-center p-2 xs:p-3 bg-blue-50 rounded-lg xs:rounded-xl">
                <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-blue-500 flex items-center justify-center mr-2 xs:mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xs xs:text-sm font-medium text-gray-800">No Account Needed</span>
              </div>
              <div className="flex items-center justify-center p-2 xs:p-3 bg-green-50 rounded-lg xs:rounded-xl">
                <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-green-500 flex items-center justify-center mr-2 xs:mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs xs:text-sm font-medium text-gray-800">Instant Results</span>
              </div>
              <div className="flex items-center justify-center p-2 xs:p-3 bg-purple-50 rounded-lg xs:rounded-xl">
                <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-purple-500 flex items-center justify-center mr-2 xs:mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-xs xs:text-sm font-medium text-gray-800">AI-Powered</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* Always show the main app content */}
            <>
                {!showResults ? (
                  <InputForm 
                    onResults={handleResults} 
                    onUserDetailsUpdate={handleUserDetailsUpdate} // Pass the update function
                    initialData={user ? userDetails : undefined} // Pre-fill form if user exists
                    onSaveProfile={updateUser} // Save profile after successful submit
                  />
                ) : (
                  results && (
                    <div className="space-y-6 xs:space-y-8">
                      <ResultsCard 
                        maintenanceCalories={results.maintenanceCalories}
                        goalCalories={results.goalCalories}
                        protein={results.protein}
                        fats={results.fats}
                        carbs={results.carbs}
                        onRecalculate={handleRecalculate}
                      />
                      
                      {/* Fitness AI Assistant - Main Chat Widget */}
                      <ChatWidget 
                        userDetails={userDetails} 
                        results={results} 
                        isVisible={true} 
                      />
                      
                      {/* Quick Tips Section */}
                      {quickTips.length > 0 && (
                        <motion.div 
                          className="bg-white/80 backdrop-blur-xl rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 shadow-lg border border-white/50 max-w-4xl mx-auto"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <h3 className="text-lg xs:text-xl md:text-2xl font-bold text-gray-900 mb-3 xs:mb-4">Quick Fitness Tips</h3>
                          <ul className="space-y-2 xs:space-y-3">
                            {quickTips.map((tip) => (
                              <motion.li 
                                key={tip.id}
                                className="flex items-start"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * tip.id, duration: 0.3 }}
                              >
                                <div className="flex-shrink-0 mt-1 xs:mt-1.5 mr-2 xs:mr-3">
                                  <div className="w-2 h-2 xs:w-2.5 xs:h-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                                </div>
                                <p className="text-gray-700 text-sm xs:text-base">{tip.text}</p>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  )
                )}
              </>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}