'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { kgToPounds } from '@/utils/calculations';

interface ResultsCardProps {
  maintenanceCalories: number;
  goalCalories: { min: number; max: number };
  protein: { min: number; max: number };
  fats: { min: number; max: number };
  carbs: { min: number; max: number };
  onRecalculate: () => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ 
  maintenanceCalories, 
  goalCalories, 
  protein,
  fats,
  carbs,
  onRecalculate
}) => {
  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-xl rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 shadow-xl border border-white/50 w-full max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <div className="text-center mb-5 xs:mb-6 sm:mb-8">
        <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent mb-1 xs:mb-2">
          Your Personalized Results
        </h2>
        <p className="text-gray-600 text-sm xs:text-base md:text-lg">Based on your profile and goals</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 mb-5 xs:mb-6 sm:mb-8">
        {/* Maintenance Calories Card */}
        <motion.div 
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl xs:rounded-2xl p-3 xs:p-4 text-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-xs xs:text-sm font-semibold text-white mb-1">Maintenance</h3>
          <div className="text-lg xs:text-xl md:text-2xl font-bold text-white">{maintenanceCalories}</div>
          <p className="text-white text-opacity-90 mt-1 text-xs">calories/day</p>
        </motion.div>
        
        {/* Goal Calories Card */}
        <motion.div 
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl xs:rounded-2xl p-3 xs:p-4 text-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-xs xs:text-sm font-semibold text-white mb-1">Goal Calories</h3>
          <div className="text-base xs:text-lg md:text-xl font-bold text-white">
            {goalCalories.min} - {goalCalories.max}
          </div>
          <p className="text-white text-opacity-90 mt-1 text-xs">calories/day</p>
        </motion.div>
        
        {/* Protein Card */}
        <motion.div 
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl xs:rounded-2xl p-3 xs:p-4 text-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-xs xs:text-sm font-semibold text-white mb-1">Protein</h3>
          <div className="text-base xs:text-lg md:text-xl font-bold text-white">
            {protein.min} - {protein.max}
          </div>
          <p className="text-white text-opacity-90 mt-1 text-xs">grams/day</p>
        </motion.div>
        
        {/* Fats Card */}
        <motion.div 
          className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl xs:rounded-2xl p-3 xs:p-4 text-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-xs xs:text-sm font-semibold text-white mb-1">Fats</h3>
          <div className="text-base xs:text-lg md:text-xl font-bold text-white">
            {fats.min} - {fats.max}
          </div>
          <p className="text-white text-opacity-90 mt-1 text-xs">grams/day</p>
        </motion.div>
        
        {/* Carbs Card */}
        <motion.div 
          className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl xs:rounded-2xl p-3 xs:p-4 text-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-xs xs:text-sm font-semibold text-white mb-1">Carbs</h3>
          <div className="text-base xs:text-lg md:text-xl font-bold text-white">
            {carbs.min} - {carbs.max}
          </div>
          <p className="text-white text-opacity-90 mt-1 text-xs">grams/day</p>
        </motion.div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 mb-5 xs:mb-6 sm:mb-8 border border-blue-100">
        <h3 className="text-lg xs:text-xl md:text-2xl font-bold text-gray-900 mb-3 xs:mb-4">What This Means</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4">
          <div className="space-y-3 xs:space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-500 rounded-full w-6 h-6 xs:w-7 xs:h-7 flex items-center justify-center mr-2 xs:mr-3 flex-shrink-0 mt-0.5">
                <span className="text-white text-xs xs:text-sm font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm xs:text-base">Maintenance Calories</p>
                <p className="text-gray-700 text-xs xs:text-sm">The number of calories you need to maintain your current weight based on your activity level.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-purple-500 rounded-full w-6 h-6 xs:w-7 xs:h-7 flex items-center justify-center mr-2 xs:mr-3 flex-shrink-0 mt-0.5">
                <span className="text-white text-xs xs:text-sm font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm xs:text-base">Goal Calories</p>
                <p className="text-gray-700 text-xs xs:text-sm">The calorie range you should aim for to achieve your fitness goal (bulk, cut, or maintain).</p>
              </div>
            </div>
          </div>
          <div className="space-y-3 xs:space-y-4">
            <div className="flex items-start">
              <div className="bg-green-500 rounded-full w-6 h-6 xs:w-7 xs:h-7 flex items-center justify-center mr-2 xs:mr-3 flex-shrink-0 mt-0.5">
                <span className="text-white text-xs xs:text-sm font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm xs:text-base">Protein</p>
                <p className="text-gray-700 text-xs xs:text-sm">The recommended daily protein intake to support muscle growth and recovery.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-amber-500 rounded-full w-6 h-6 xs:w-7 xs:h-7 flex items-center justify-center mr-2 xs:mr-3 flex-shrink-0 mt-0.5">
                <span className="text-white text-xs xs:text-sm font-bold">4</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm xs:text-base">Fats & Carbs</p>
                <p className="text-gray-700 text-xs xs:text-sm">Fats (20-30% of calories) and remaining calories as carbs for energy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col xs:flex-row justify-center gap-3 xs:gap-4">
        <motion.button
          onClick={onRecalculate}
          className="px-5 xs:px-6 py-2.5 xs:py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-lg xs:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm xs:text-base md:text-lg btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Recalculate
        </motion.button>
        
        <motion.button
          className="px-5 xs:px-6 py-2.5 xs:py-3 md:px-8 md:py-4 bg-white text-gray-800 font-bold rounded-lg xs:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-300 text-sm xs:text-base md:text-lg btn-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Results
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResultsCard;