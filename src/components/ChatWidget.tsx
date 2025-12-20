'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
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

// Add interface for results data
interface ResultsData {
  maintenanceCalories: number;
  goalCalories: { min: number; max: number };
  protein: { min: number; max: number };
  fats: { min: number; max: number };
  carbs: { min: number; max: number };
}

// Update the component props
interface ChatWidgetProps {
  userDetails?: UserDetails;
  results?: ResultsData | null;
  isVisible: boolean; // Add prop to control visibility
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ userDetails, results, isVisible }) => {
  const { user } = useUser(); // Get user from context
  const [isOpen, setIsOpen] = useState(true); // Start open by default
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [workoutType, setWorkoutType] = useState<'full-body' | 'split' | 'push-pull-legs' | null>(null);
  const [location, setLocation] = useState<'gym' | 'home' | null>(null);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | null>(null);
  const [useTestApi, setUseTestApi] = useState(false); // Flag to use test API when rate-limited
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message only when widget becomes visible
  useEffect(() => {
    if (isVisible && messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: "Hi! I'm your Fitness AI assistant. Now that you've calculated your nutrition needs, ask me for personalized workout routines, nutrition advice, or any fitness-related questions!",
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }
  }, [isVisible, messages.length]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Generate AI response
    setTimeout(() => {
      generateAIResponse(inputValue);
      setIsTyping(false);
    }, 800);
  };

  const generateAIResponse = async (userInput: string) => {
    // Check if user is asking about workout type
    const lowerInput = userInput.toLowerCase();
    
    // Try to detect workout preferences from user input
    if (!workoutType) {
      if (lowerInput.includes('full') || lowerInput.includes('body')) {
        setWorkoutType('full-body');
      } else if (lowerInput.includes('split')) {
        setWorkoutType('split');
      } else if (lowerInput.includes('push') || lowerInput.includes('pull') || lowerInput.includes('leg')) {
        setWorkoutType('push-pull-legs');
      }
    }
    
    if (!location) {
      if (lowerInput.includes('gym') || lowerInput.includes('fitness')) {
        setLocation('gym');
      } else if (lowerInput.includes('home') || lowerInput.includes('house')) {
        setLocation('home');
      }
    }
    
    if (!difficulty) {
      if (lowerInput.includes('beginner')) {
        setDifficulty('Beginner');
      } else if (lowerInput.includes('intermediate')) {
        setDifficulty('Intermediate');
      } else if (lowerInput.includes('advanced')) {
        setDifficulty('Advanced');
      }
    }

    // Call the backend API to generate a response
    try {
      // Use environment variable for API base URL, fallback to relative path
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      
      // Determine which API endpoint to use
      const apiEndpoint = useTestApi ? `${apiBaseUrl}/api/test` : `${apiBaseUrl}/api/workout`;
      
      // Create user profile block for the prompt
      let userProfileBlock = '';
      if (user) {
        userProfileBlock = `
User Profile:
Age: ${user.age}
Weight: ${user.weight} ${user.weightUnit}
Height: ${user.heightUnit === 'cm' ? `${user.heightCm} cm` : `${user.heightFeet}'${user.heightInches}"`}
Sex: ${user.sex}
Activity Level: ${user.activityLevel}
Goal: ${user.goal}
`;
        
        // Add macro information if available
        if (results) {
          userProfileBlock += `Maintenance Calories: ${results.maintenanceCalories}
Goal Calories: ${results.goalCalories.min}-${results.goalCalories.max}
Protein: ${results.protein.min}-${results.protein.max}g
Fats: ${results.fats.min}-${results.fats.max}g
Carbs: ${results.carbs.min}-${results.carbs.max}g
`;
        }
        
        userProfileBlock += '\n';
      }
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workoutType,
          location,
          userDetails,
          results,
          difficulty,
          userInput,
          userProfile: userProfileBlock // Add user profile to the request
        }),
      });

      if (!response.ok) {
        let errorMessage = "Sorry, I couldn't process your request at the moment. Please try again later.";
        
        try {
          const errorData = await response.json();
          if (errorData.details && errorData.details.includes('rate-limited')) {
            errorMessage = "The AI service is currently busy. Please wait a moment and try again.";
            // Switch to test API for subsequent requests
            setUseTestApi(true);
          } else if (response.status === 429) {
            errorMessage = "Too many requests. Please wait a few minutes before trying again.";
            // Switch to test API for subsequent requests
            setUseTestApi(true);
          } else if (response.status >= 500) {
            errorMessage = "The AI service is temporarily unavailable. Please try again in a few minutes.";
          }
        } catch (e) {
          // If we can't parse the error, use the default message
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: data.response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Reset test API flag if we successfully got a response from the main API
      if (!useTestApi) {
        setUseTestApi(false);
      }
    } catch (error: any) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: error.message || "Sorry, I couldn't process your request at the moment. Please try again later.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    // Reset selections for next workout
    setWorkoutType(null);
    setLocation(null);
    setDifficulty(null);
  };

  // Format workout plan for better readability
  const formatWorkoutPlan = (text: string) => {
    // Split by sections
    const sections = text.split(/(?=### )/);
    
    return sections.map((section, index) => {
      if (section.startsWith('### ')) {
        const lines = section.split('\n');
        const title = lines[0].replace('### ', '');
        
        return (
          <div key={index} className="mb-3 xs:mb-4">
            <h4 className="font-semibold text-gray-800 mb-1 xs:mb-2 text-sm xs:text-base">{title}</h4>
            <ul className="space-y-1">
              {lines.slice(1).map((line, lineIndex) => {
                if (line.trim() !== '') {
                  return (
                    <li key={lineIndex} className="text-gray-700 text-xs xs:text-sm ml-2">
                      {line.trim().startsWith('-') ? line : `- ${line}`}
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        );
      } else if (section.startsWith('## ')) {
        // Handle title section
        const lines = section.split('\n');
        const title = lines[0].replace('## ', '');
        
        return (
          <div key={index} className="mb-3 xs:mb-4">
            <h3 className="font-bold text-gray-900 text-base xs:text-lg mb-2 xs:mb-3">{title}</h3>
            {lines.slice(1).map((line, lineIndex) => {
              if (line.trim() !== '') {
                return (
                  <p key={lineIndex} className="text-gray-700 text-xs xs:text-sm mb-1">
                    {line}
                  </p>
                );
              }
              return null;
            })}
          </div>
        );
      } else {
        return (
          <p key={index} className="text-gray-700 text-xs xs:text-sm mb-2">
            {section}
          </p>
        );
      }
    });
  };

  // Only render the chat widget if it's visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 shadow-lg border border-white/50 w-full max-w-5xl mx-auto">
      {/* Chat Header - More prominent with clear text */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl p-3 xs:p-4 md:p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base xs:text-lg md:text-xl">Fitness AI Assistant</h3>
            <p className="text-xs xs:text-sm text-white text-opacity-90">Ask me about workouts, nutrition, or fitness...</p>
          </div>
          <motion.button
            onClick={toggleChat}
            className="w-8 h-8 xs:w-9 xs:h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isOpen ? "Minimize chat" : "Maximize chat"}
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-3 xs:p-4 space-y-3 bg-gradient-to-b from-white/50 to-blue-50/50 rounded-xl xs:rounded-2xl my-4 border border-gray-100 max-h-60 xs:max-h-72 sm:max-h-80 md:max-h-96">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 xs:px-4 py-2 xs:py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                    }`}
                  >
                    {message.sender === 'ai' && (message.text.startsWith('##') || message.text.startsWith('###')) ? (
                      <div className="whitespace-pre-wrap text-xs xs:text-sm">
                        {formatWorkoutPlan(message.text)}
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-xs xs:text-sm">{message.text}</div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-3 xs:px-4 py-2 xs:py-3 shadow-sm border border-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white/80 rounded-b-2xl">
              <div className="flex space-x-2 p-2 xs:p-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about workouts, nutrition, or fitness..."
                  className="flex-1 px-3 xs:px-4 py-2 xs:py-3 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner form-input text-sm"
                />
                <motion.button
                  onClick={handleSend}
                  className="w-9 h-9 xs:w-10 xs:h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center hover:shadow-lg transition-shadow shadow-md btn-primary"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={inputValue.trim() === ''}
                  aria-label="Send message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;