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
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
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

  // Load user data into form if available
  useEffect(() => {
    if (user) {
      setUserDetails({
        weight: user.weight,
        weightUnit: user.weightUnit,
        heightFeet: user.heightFeet,
        heightInches: user.heightInches,
        heightCm: user.heightCm,
        heightUnit: user.heightUnit,
        age: user.age,
        sex: user.sex,
        activityLevel: user.activityLevel,
        goal: user.goal
      });
    }
  }, [user]);

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

  // Handle login completion
  const handleLoginComplete = () => {
    setShowLogin(false);
  };

  // Handle signup completion
  const handleSignupComplete = () => {
    setShowSignup(false);
  };

  // Show login form
  const showLoginForm = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  // Show signup form
  const showSignupForm = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  // Determine what to show based on user state
  const shouldShowAuthForms = !user && !showResults && !showLogin && !showSignup;
  const shouldShowLogin = showLogin && !user;
  const shouldShowSignup = showSignup && !user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900">
      <Header onShowLogin={showLoginForm} onShowSignup={showSignupForm} />
      
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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* Show login form if user is not logged in and login is requested */}
            {shouldShowLogin && (
              <Login 
                onLoginComplete={handleLoginComplete} 
                onShowSignup={showSignupForm} 
              />
            )}
            
            {/* Show signup form if user is not logged in and signup is requested */}
            {shouldShowSignup && (
              <Signup 
                onSignupComplete={handleSignupComplete} 
                initialFitnessData={userDetails}
              />
            )}
            
            {/* Show auth forms by default if no user and no results */}
            {shouldShowAuthForms && (
              <Login 
                onLoginComplete={handleLoginComplete} 
                onShowSignup={showSignupForm} 
              />
            )}
            
            {/* Show main app content if user is logged in or showing results */}
            {(user || showResults) && (
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
            )}
            
            {/* Fallback: Always show login if nothing else is shown */}
            {!user && !showResults && !shouldShowAuthForms && !shouldShowLogin && !shouldShowSignup && (
              <Login 
                onLoginComplete={handleLoginComplete} 
                onShowSignup={showSignupForm} 
              />
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}