'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  poundsToKg, 
  feetInchesToCm, 
  calculateBMR, 
  calculateTDEE, 
  getActivityMultiplier, 
  calculateGoalCalories, 
  calculateProteinRequirements 
} from '@/utils/calculations';

interface FormData {
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

interface ResultsData {
  maintenanceCalories: number;
  goalCalories: { min: number; max: number };
  protein: { min: number; max: number };
  fats: { min: number; max: number }; // Add fats calculation
  carbs: { min: number; max: number }; // Add carbs calculation
}

interface InputFormProps {
  onResults: (results: ResultsData) => void;
  onUserDetailsUpdate?: (details: FormData) => void;
  initialData?: FormData; // Add initial data prop
  onSaveProfile?: (profile: FormData) => void; // Add save profile prop
}

const InputForm: React.FC<InputFormProps> = ({ onResults, onUserDetailsUpdate, initialData, onSaveProfile }) => {
  const [formData, setFormData] = useState<FormData>(initialData || {
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: name.includes('height') || name === 'age' || name === 'weight' ? 
        (value === '' ? '' : Number(value)) : value
    };
    
    setFormData(updatedFormData);
    
    // Notify parent component about user details update
    if (onUserDetailsUpdate) {
      onUserDetailsUpdate(updatedFormData);
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.weight === '') newErrors.weight = 'Weight is required';
    else if (Number(formData.weight) <= 0) newErrors.weight = 'Weight must be greater than 0';
    
    if (formData.age === '') newErrors.age = 'Age is required';
    else if (Number(formData.age) <= 0 || Number(formData.age) > 120) newErrors.age = 'Please enter a valid age (1-120)';
    
    if (formData.sex === '') newErrors.sex = 'Sex is required';
    
    if (formData.goal === '') newErrors.goal = 'Fitness goal is required';
    
    if (formData.heightUnit === 'ft') {
      if (formData.heightFeet === '') newErrors.heightFeet = 'Feet is required';
      else if (Number(formData.heightFeet) < 0) newErrors.heightFeet = 'Feet cannot be negative';
      
      if (formData.heightInches === '') newErrors.heightInches = 'Inches is required';
      else if (Number(formData.heightInches) < 0 || Number(formData.heightInches) >= 12) newErrors.heightInches = 'Inches must be between 0 and 11';
    } else {
      if (formData.heightCm === '') newErrors.heightCm = 'Height is required';
      else if (Number(formData.heightCm) <= 0 || Number(formData.heightCm) > 300) newErrors.heightCm = 'Please enter a valid height in cm (1-300)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle unit conversions
  const handleWeightUnitChange = (unit: 'kg' | 'lbs') => {
    setFormData(prev => {
      // Convert weight when switching units
      let newWeight = prev.weight;
      if (prev.weight !== '' && unit !== prev.weightUnit) {
        if (unit === 'kg') {
          // Convert lbs to kg
          newWeight = Number((Number(prev.weight) * 0.453592).toFixed(1));
        } else {
          // Convert kg to lbs
          newWeight = Number((Number(prev.weight) / 0.453592).toFixed(1));
        }
      }
      return {
        ...prev,
        weight: newWeight,
        weightUnit: unit
      };
    });
  };

  const handleHeightUnitChange = (unit: 'cm' | 'ft') => {
    setFormData(prev => {
      return {
        ...prev,
        heightUnit: unit
      };
    });
  };

  // Calculate fats (20-30% of total calories)
  const calculateFats = (calories: number): { min: number; max: number } => {
    const minFats = Math.round((calories * 0.20) / 9); // 9 calories per gram of fat
    const maxFats = Math.round((calories * 0.30) / 9);
    return { min: minFats, max: maxFats };
  };

  // Calculate carbs (remaining calories after protein and fats)
  const calculateCarbs = (
    totalCalories: number, 
    proteinGrams: number, 
    fatsGrams: number
  ): { min: number; max: number } => {
    const proteinCalories = proteinGrams * 4; // 4 calories per gram of protein
    const fatsCalories = fatsGrams * 9; // 9 calories per gram of fat
    const remainingCalories = totalCalories - proteinCalories - fatsCalories;
    const minCarbs = Math.round(remainingCalories * 0.8 / 4); // 4 calories per gram of carbs
    const maxCarbs = Math.round(remainingCalories * 1.2 / 4);
    return { min: minCarbs, max: maxCarbs };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Save profile if onSaveProfile is provided
    if (onSaveProfile) {
      onSaveProfile(formData);
    }
    
    // Convert units
    const weightKg = formData.weightUnit === 'kg' ? 
      Number(formData.weight) : 
      poundsToKg(Number(formData.weight));
      
    let heightCm: number;
    if (formData.heightUnit === 'cm') {
      heightCm = Number(formData.heightCm);
    } else {
      heightCm = feetInchesToCm(
        Number(formData.heightFeet), 
        Number(formData.heightInches)
      );
    }
    
    // Calculate results
    const bmr = calculateBMR(
      weightKg, 
      heightCm, 
      Number(formData.age), 
      formData.sex as 'male' | 'female'
    );
    
    const activityMultiplier = getActivityMultiplier(formData.activityLevel);
    const tdee = calculateTDEE(bmr, activityMultiplier);
    const goalCalories = calculateGoalCalories(tdee, formData.goal as 'bulk' | 'cut' | 'maintain');
    const protein = calculateProteinRequirements(weightKg);
    
    // Calculate fats and carbs
    const fats = {
      min: calculateFats(goalCalories.min).min,
      max: calculateFats(goalCalories.max).max
    };
    
    const carbs = {
      min: calculateCarbs(goalCalories.min, protein.min, fats.min).min,
      max: calculateCarbs(goalCalories.max, protein.max, fats.max).max
    };
    
    onResults({
      maintenanceCalories: Math.round(tdee),
      goalCalories,
      protein,
      fats,
      carbs
    });
  };

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-xl rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 shadow-xl border border-white/50 w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <div className="text-center mb-5 xs:mb-6 sm:mb-8">
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent mb-1 xs:mb-2">
          Your Fitness Profile
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm md:text-base">Enter your details to get personalized nutrition recommendations</p>
        
        {/* Progress indicator */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-blue-600">Getting Started</span>
            <span className="text-xs font-medium text-gray-500">Results</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
        {/* Weight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 xs:gap-3 sm:gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Weight
            </label>
            <div className="flex">
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className={`flex-grow px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-l-md xs:rounded-l-lg sm:rounded-l-xl border ${
                  errors.weight ? 'border-red-500' : 'border-gray-300'
                } text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm form-input text-xs xs:text-sm sm:text-base`}
                placeholder="Enter weight"
              />
              <select
                name="weightUnit"
                value={formData.weightUnit}
                onChange={(e) => handleWeightUnitChange(e.target.value as 'kg' | 'lbs')}
                className="px-2 py-2 xs:px-2.5 xs:py-2.5 sm:px-3 sm:py-3 rounded-r-md xs:rounded-r-lg sm:rounded-r-xl border-t border-b border-r border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm form-select text-xs xs:text-sm sm:text-base"
              >
                <option value="kg" className="text-gray-800">kg</option>
                <option value="lbs" className="text-gray-800">lbs</option>
              </select>
            </div>
            {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
          </div>
        </div>
        
        {/* Height */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Height
          </label>
          <div className="flex space-x-1 xs:space-x-2 sm:space-x-3 mb-2">
            <button
              type="button"
              onClick={() => handleHeightUnitChange('cm')}
              className={`px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 sm:py-2 rounded-md xs:rounded-lg text-xs sm:text-sm ${
                formData.heightUnit === 'cm' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Centimeters
            </button>
            <button
              type="button"
              onClick={() => handleHeightUnitChange('ft')}
              className={`px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 sm:py-2 rounded-md xs:rounded-lg text-xs sm:text-sm ${
                formData.heightUnit === 'ft' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Feet & Inches
            </button>
          </div>
          
          {formData.heightUnit === 'cm' ? (
            <div>
              <input
                type="number"
                name="heightCm"
                value={formData.heightCm}
                onChange={handleInputChange}
                className={`w-full px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-md xs:rounded-lg sm:rounded-xl border ${
                  errors.heightCm ? 'border-red-500' : 'border-gray-300'
                } text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm form-input text-xs xs:text-sm sm:text-base`}
                placeholder="Enter height in cm"
              />
              {errors.heightCm && <p className="text-red-500 text-xs mt-1">{errors.heightCm}</p>}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
              <div>
                <input
                  type="number"
                  name="heightFeet"
                  value={formData.heightFeet}
                  onChange={handleInputChange}
                  className={`w-full px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-md xs:rounded-lg sm:rounded-xl border ${
                    errors.heightFeet ? 'border-red-500' : 'border-gray-300'
                  } text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm form-input text-xs xs:text-sm sm:text-base`}
                  placeholder="Feet"
                />
                {errors.heightFeet && <p className="text-red-500 text-xs mt-1">{errors.heightFeet}</p>}
              </div>
              <div>
                <input
                  type="number"
                  name="heightInches"
                  value={formData.heightInches}
                  onChange={handleInputChange}
                  className={`w-full px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-md xs:rounded-lg sm:rounded-xl border ${
                    errors.heightInches ? 'border-red-500' : 'border-gray-300'
                  } text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm form-input text-xs xs:text-sm sm:text-base`}
                  placeholder="Inches"
                />
                {errors.heightInches && <p className="text-red-500 text-xs mt-1">{errors.heightInches}</p>}
              </div>
            </div>
          )}
        </div>
        
        {/* Age */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className={`w-full px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-md xs:rounded-lg sm:rounded-xl border ${
              errors.age ? 'border-red-500' : 'border-gray-300'
            } text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm form-input text-xs xs:text-sm sm:text-base`}
            placeholder="Enter your age"
          />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </div>
        
        {/* Sex */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Sex
          </label>
          <div className="flex space-x-3 xs:space-x-4 sm:space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="sex"
                value="male"
                checked={formData.sex === 'male'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className={`w-4 xs:w-5 h-4 xs:h-5 rounded-full border-2 flex items-center justify-center mr-2 ${
                formData.sex === 'male' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              }`}>
                {formData.sex === 'male' && (
                  <div className="w-1.5 xs:w-2 h-1.5 xs:h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-gray-700 text-xs xs:text-sm">Male</span>
            </label>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="sex"
                value="female"
                checked={formData.sex === 'female'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className={`w-4 xs:w-5 h-4 xs:h-5 rounded-full border-2 flex items-center justify-center mr-2 ${
                formData.sex === 'female' 
                  ? 'border-pink-500 bg-pink-500' 
                  : 'border-gray-300'
              }`}>
                {formData.sex === 'female' && (
                  <div className="w-1.5 xs:w-2 h-1.5 xs:h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-gray-700 text-xs xs:text-sm">Female</span>
            </label>
          </div>
          {errors.sex && <p className="text-red-500 text-xs mt-1">{errors.sex}</p>}
        </div>
        
        {/* Activity Level */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Activity Level
          </label>
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleInputChange}
            className="w-full px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-md xs:rounded-lg sm:rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm form-select text-xs xs:text-sm sm:text-base"
          >
            <option value="Sedentary" className="text-gray-800">Sedentary (little or no exercise)</option>
            <option value="Lightly Active" className="text-gray-800">Lightly Active (light exercise 1-3 days/week)</option>
            <option value="Moderately Active" className="text-gray-800">Moderately Active (moderate exercise 3-5 days/week)</option>
            <option value="Very Active" className="text-gray-800">Very Active (hard exercise 6-7 days/week)</option>
            <option value="Extremely Active" className="text-gray-800">Extremely Active (very hard exercise & physical job)</option>
          </select>
        </div>
        
        {/* Goal */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Fitness Goal
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 xs:gap-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="goal"
                value="bulk"
                checked={formData.goal === 'bulk'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className={`w-full px-2 xs:px-3 py-2 xs:py-2.5 rounded-md xs:rounded-lg text-center ${
                formData.goal === 'bulk' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } text-xs xs:text-sm`}>
                Bulk
              </div>
            </label>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="goal"
                value="maintain"
                checked={formData.goal === 'maintain'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className={`w-full px-2 xs:px-3 py-2 xs:py-2.5 rounded-md xs:rounded-lg text-center ${
                formData.goal === 'maintain' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } text-xs xs:text-sm`}>
                Maintain
              </div>
            </label>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="goal"
                value="cut"
                checked={formData.goal === 'cut'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className={`w-full px-2 xs:px-3 py-2 xs:py-2.5 rounded-md xs:rounded-lg text-center ${
                formData.goal === 'cut' 
                  ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } text-xs xs:text-sm`}>
                Cut
              </div>
            </label>
          </div>
          {errors.goal && <p className="text-red-500 text-xs mt-1">{errors.goal}</p>}
        </div>
        
        {/* Submit Button */}
        <div className="pt-2 xs:pt-3 sm:pt-4">
          <motion.button
            type="submit"
            className="w-full py-2 xs:py-3 sm:py-4 rounded-md xs:rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium hover:shadow-lg transition-shadow shadow-md btn-primary text-sm xs:text-base sm:text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Calculate My Nutrition
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default InputForm;