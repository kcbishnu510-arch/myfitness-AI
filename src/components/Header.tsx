'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';

interface HeaderProps {
  onShowLogin?: () => void;
  onShowSignup?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowLogin, onShowSignup }) => {
  const { user, logout } = useUser();

  return (
    <header className="py-3 xs:py-4 px-4 border-b border-gray-200/30 bg-white/70 backdrop-blur-xl">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
            MyFitnessAI
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <nav>
            <ul className="hidden xs:flex space-x-3 sm:space-x-4 md:space-x-6">
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium relative group py-2 text-xs xs:text-sm sm:text-base">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium relative group py-2 text-xs xs:text-sm sm:text-base">
                  Features
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium relative group py-2 text-xs xs:text-sm sm:text-base">
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium relative group py-2 text-xs xs:text-sm sm:text-base">
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a>
              </li>
              {user ? (
                <li>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 text-xs xs:text-sm sm:text-base">
                      Hi, {user.name}
                    </span>
                    <button
                      onClick={logout}
                      className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium relative group py-2 text-xs xs:text-sm sm:text-base"
                    >
                      Logout
                    </button>
                  </div>
                </li>
              ) : (
                <>
                  {onShowLogin && (
                    <li>
                      <button
                        onClick={onShowLogin}
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium relative group py-2 text-xs xs:text-sm sm:text-base"
                      >
                        Login
                      </button>
                    </li>
                  )}
                  {onShowSignup && (
                    <li>
                      <button
                        onClick={onShowSignup}
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium relative group py-2 text-xs xs:text-sm sm:text-base"
                      >
                        Sign Up
                      </button>
                    </li>
                  )}
                </>
              )}
            </ul>
            {/* Mobile menu button for smaller screens */}
            <button className="xs:hidden tap-target text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 xs:h-6 xs:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </nav>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;