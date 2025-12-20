// Utility functions for calculating calories and protein requirements

/**
 * Calculates Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 * @param weightKg Weight in kilograms
 * @param heightCm Height in centimeters
 * @param age Age in years
 * @param sex Biological sex ('male' or 'female')
 * @returns BMR in calories
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, sex: 'male' | 'female'): number {
  if (sex === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE) based on activity level
 * @param bmr Basal Metabolic Rate
 * @param activityLevel Activity level multiplier
 * @returns TDEE in calories
 */
export function calculateTDEE(bmr: number, activityLevel: number): number {
  return bmr * activityLevel;
}

/**
 * Gets activity level multiplier
 * @param activityLevel Activity level string
 * @returns Multiplier value
 */
export function getActivityMultiplier(activityLevel: string): number {
  switch (activityLevel) {
    case 'Sedentary':
      return 1.2;
    case 'Lightly Active':
      return 1.375;
    case 'Moderately Active':
      return 1.55;
    case 'Very Active':
      return 1.725;
    case 'Extra Active':
      return 1.9;
    default:
      return 1.2; // Sedentary as default
  }
}

/**
 * Calculates goal-based calories
 * @param tdee Total Daily Energy Expenditure
 * @param goal Fitness goal ('bulk', 'cut', or 'maintain')
 * @returns Goal-based calorie intake
 */
export function calculateGoalCalories(tdee: number, goal: 'bulk' | 'cut' | 'maintain'): { min: number; max: number } {
  switch (goal) {
    case 'bulk':
      return {
        min: Math.round(tdee * 1.1),
        max: Math.round(tdee * 1.2)
      };
    case 'cut':
      return {
        min: Math.round(tdee * 0.8),
        max: Math.round(tdee * 0.9)
      };
    case 'maintain':
    default:
      return {
        min: Math.round(tdee),
        max: Math.round(tdee)
      };
  }
}

/**
 * Calculates protein requirements
 * @param weightKg Weight in kilograms
 * @returns Protein requirements in grams
 */
export function calculateProteinRequirements(weightKg: number): { min: number; max: number } {
  return {
    min: Math.round(weightKg * 1.6),
    max: Math.round(weightKg * 2.2)
  };
}

/**
 * Converts pounds to kilograms
 * @param pounds Weight in pounds
 * @returns Weight in kilograms
 */
export function poundsToKg(pounds: number): number {
  return pounds * 0.453592;
}

/**
 * Converts kilograms to pounds
 * @param kg Weight in kilograms
 * @returns Weight in pounds
 */
export function kgToPounds(kg: number): number {
  return kg / 0.453592;
}

/**
 * Converts feet and inches to centimeters
 * @param feet Feet
 * @param inches Inches
 * @returns Height in centimeters
 */
export function feetInchesToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54;
}

/**
 * Converts centimeters to inches
 * @param cm Height in centimeters
 * @returns Height in inches
 */
export function cmToInches(cm: number): number {
  return cm / 2.54;
}