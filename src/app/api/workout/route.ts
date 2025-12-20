import { NextRequest } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY || "";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const MODEL = "gemini-pro";

// Add interface for results data
interface ResultsData {
  maintenanceCalories: number;
  goalCalories: { min: number; max: number };
  protein: { min: number; max: number };
  fats: { min: number; max: number };
  carbs: { min: number; max: number };
}

// Function to classify if a question is fitness-related
function isFitnessRelated(input: string): boolean {
  // Handle case where input might be undefined
  if (!input) return false;
  
  const fitnessKeywords = [
    'workout', 'exercise', 'training', 'gym', 'fitness', 'muscle', 'strength', 'cardio', 'weight', 
    'lifting', 'reps', 'sets', 'routine', 'program', 'plan', 'diet', 'nutrition', 'calories', 
    'protein', 'carbs', 'fats', 'macros', 'meal', 'supplement', 'vitamin', 'mineral', 'bmr', 
    'tdee', 'metabolism', 'body fat', 'lean mass', 'bulking', 'cutting', 'maintenance', 'gain', 
    'lose', 'weight loss', 'muscle gain', 'recovery', 'rest', 'sleep', 'hydration', 'water', 
    'stretching', 'flexibility', 'mobility', 'injury', 'pain', 'soreness', 'cramps', 'fatigue',
    'energy', 'endurance', 'performance', 'athlete', 'sports', 'running', 'cycling', 'swimming',
    'push', 'pull', 'legs', 'upper body', 'lower body', 'core', 'abs', 'chest', 'back', 'shoulders',
    'arms', 'legs', 'glutes', 'quads', 'hamstrings', 'calves', 'biceps', 'triceps'
  ];
  
  const lowerInput = input.toLowerCase();
  return fitnessKeywords.some(keyword => lowerInput.includes(keyword));
}

// Function to classify fitness subtypes
function classifyFitnessType(input: string): string {
  // Handle case where input might be undefined
  if (!input) return 'general';
  
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('workout') || lowerInput.includes('routine') || lowerInput.includes('training') || 
      lowerInput.includes('program') || lowerInput.includes('plan') || lowerInput.includes('exercise') ||
      lowerInput.includes('push') || lowerInput.includes('pull') || lowerInput.includes('legs') ||
      lowerInput.includes('4-day') || lowerInput.includes('5-day') || lowerInput.includes('split')) {
    return 'workout';
  }
  
  if (lowerInput.includes('diet') || lowerInput.includes('nutrition') || lowerInput.includes('calories') || 
      lowerInput.includes('protein') || lowerInput.includes('carbs') || lowerInput.includes('fats') ||
      lowerInput.includes('macros') || lowerInput.includes('meal') || lowerInput.includes('bmr') ||
      lowerInput.includes('tdee') || lowerInput.includes('bulking') || lowerInput.includes('cutting') ||
      lowerInput.includes('maintenance')) {
    return 'nutrition';
  }
  
  return 'general';
}

export async function POST(request: NextRequest) {
  try {
    const { workoutType, location, userDetails, results, difficulty, userInput } = await request.json();

    // Check if the input is fitness-related
    if (!isFitnessRelated(userInput)) {
      return new Response(
        JSON.stringify({ 
          response: "I can help only with fitness-related questions like workouts, nutrition, calories, macros, protein goals, and training plans. Ask me anything in that domain!"
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Classify the fitness question type
    const fitnessType = classifyFitnessType(userInput);
    
    let prompt = '';
    
    if (fitnessType === 'workout' && workoutType && location) {
      // Create a prompt for workout plans
      prompt = `Generate a ${workoutType} workout plan for ${location} workouts based on the following user details:
      
User Profile:
- Age: ${userDetails?.age || 'Not provided'}
- Weight: ${userDetails?.weight} ${userDetails?.weightUnit || ''}
- Height: ${userDetails?.heightUnit === 'cm' ? `${userDetails?.heightCm} cm` : `${userDetails?.heightFeet}'${userDetails?.heightInches}"`}
- Sex: ${userDetails?.sex || 'Not provided'}
- Activity Level: ${userDetails?.activityLevel || 'Not provided'}
- Goal: ${userDetails?.goal || 'Not provided'}
- Difficulty Level: ${difficulty || 'Beginner'}

Results Data:
- Maintenance Calories: ${results?.maintenanceCalories || 'Not provided'}
- Goal Calories: ${results?.goalCalories ? `${results.goalCalories.min}-${results.goalCalories.max}` : 'Not provided'}
- Protein: ${results?.protein ? `${results.protein.min}-${results.protein.max}g` : 'Not provided'}
- Fats: ${results?.fats ? `${results.fats.min}-${results.fats.max}g` : 'Not provided'}
- Carbs: ${results?.carbs ? `${results.carbs.min}-${results.carbs.max}g` : 'Not provided'}

Please provide a workout plan that includes:
1. Warm-up (3-5 min)
2. Main Workout (5-8 exercises with sets x reps and rest time)
3. Cool-down (1-2 stretches)
4. Notes (1 short tip)

Format the response in this exact structure:
## Title (Goal + Gym/Home + Level)

### Warm-up
- [Exercise] - [Duration]

### Main Workout
1. [Exercise Name]
   - Sets x Reps: [sets] x [reps]
   - Rest: [time]

(Repeat for 5-8 exercises)

### Cool-down
- [Stretch] - [Duration]

### Notes
- [1 short actionable tip]

Keep response between 80-140 words. No disclaimers or long paragraphs.`;
    } else if (fitnessType === 'nutrition' && results) {
      // Create a prompt for nutrition questions with results data
      prompt = `Answer the following nutrition-related question with specific numbers based on the user's results:

Question: ${userInput}

User Profile:
- Age: ${userDetails?.age || 'Not provided'}
- Weight: ${userDetails?.weight} ${userDetails?.weightUnit || ''}
- Height: ${userDetails?.heightUnit === 'cm' ? `${userDetails?.heightCm} cm` : `${userDetails?.heightFeet}'${userDetails?.heightInches}"`}
- Sex: ${userDetails?.sex || 'Not provided'}
- Activity Level: ${userDetails?.activityLevel || 'Not provided'}
- Goal: ${userDetails?.goal || 'Not provided'}

Results Data:
- Maintenance Calories: ${results?.maintenanceCalories || 'Not provided'}
- Goal Calories: ${results?.goalCalories ? `${results.goalCalories.min}-${results.goalCalories.max}` : 'Not provided'}
- Protein: ${results?.protein ? `${results.protein.min}-${results.protein.max}g` : 'Not provided'}
- Fats: ${results?.fats ? `${results.fats.min}-${results.fats.max}g` : 'Not provided'}
- Carbs: ${results?.carbs ? `${results.carbs.min}-${results.carbs.max}g` : 'Not provided'}

Provide specific, actionable advice with numbers. Keep response between 80-140 words. No disclaimers.`;
    } else {
      // Create a prompt for general fitness questions
      prompt = `Answer the following fitness-related question concisely and professionally:
      
Question: ${userInput}

User Profile:
- Age: ${userDetails?.age || 'Not provided'}
- Weight: ${userDetails?.weight} ${userDetails?.weightUnit || ''}
- Height: ${userDetails?.heightUnit === 'cm' ? `${userDetails?.heightCm} cm` : `${userDetails?.heightFeet}'${userDetails?.heightInches}"`}
- Sex: ${userDetails?.sex || 'Not provided'}
- Activity Level: ${userDetails?.activityLevel || 'Not provided'}
- Goal: ${userDetails?.goal || 'Not provided'}

Results Data:
- Maintenance Calories: ${results?.maintenanceCalories || 'Not provided'}
- Goal Calories: ${results?.goalCalories ? `${results.goalCalories.min}-${results.goalCalories.max}` : 'Not provided'}
- Protein: ${results?.protein ? `${results.protein.min}-${results.protein.max}g` : 'Not provided'}
- Fats: ${results?.fats ? `${results.fats.min}-${results.fats.max}g` : 'Not provided'}
- Carbs: ${results?.carbs ? `${results.carbs.min}-${results.carbs.max}g` : 'Not provided'}

Provide specific, actionable advice. Keep response between 80-140 words. No disclaimers.`;
    }

    // Prepare headers for Gemini API
    const headers = {
      'Content-Type': 'application/json',
    };

    // Prepare data for Gemini API
    const data = {
      contents: [{
        parts: [{
          text: `You are a professional fitness coach. Provide structured, actionable fitness advice. Always format workout plans with clear sections. Keep responses concise and professional.\n\n${prompt}`
        }]
      }],
      // Add parameters to improve response quality
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      }
    };

    console.log('Making request to Gemini API...');
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      
      // Check if this is a rate limit error
      let errorMessage = 'Failed to generate response';
      let errorDetails = errorText;
      let statusCode = response.status;
      
      if (response.status === 429 || errorText.includes('rate-limited') || errorText.includes('quota')) {
        errorMessage = 'Rate limit exceeded';
        errorDetails = 'The AI service is temporarily busy. Please wait a moment and try again.';
        statusCode = 429;
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: errorDetails,
          status: statusCode
        }),
        { 
          status: statusCode,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await response.json();
    console.log('Gemini API response received');
    
    if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content) {
      return new Response(
        JSON.stringify({ error: 'No response generated' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const aiResponse = result.candidates[0].content.parts[0].text;
    
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Workout API Error:', error);
    
    // Handle timeout errors specifically
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return new Response(
        JSON.stringify({ 
          error: 'Request timeout',
          details: 'The request timed out. Please try again.'
        }),
        { 
          status: 408,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message || 'Unknown error occurred'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}