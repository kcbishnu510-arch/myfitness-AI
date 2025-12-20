import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userInput } = await request.json();
    
    // Simulate different responses based on input
    if (userInput.toLowerCase().includes('workout')) {
      return new Response(
        JSON.stringify({ 
          response: `## Home Full-Body Workout Plan

### Warm-up
- Jumping Jacks - 3 minutes
- Arm Circles - 1 minute
- Leg Swings - 1 minute

### Main Workout
1. Push-ups
   - Sets x Reps: 3 x 10-15
   - Rest: 60 seconds

2. Squats
   - Sets x Reps: 3 x 15-20
   - Rest: 60 seconds

3. Plank
   - Sets x Reps: 3 x 30-60 seconds
   - Rest: 60 seconds

4. Lunges
   - Sets x Reps: 3 x 10 each leg
   - Rest: 60 seconds

### Cool-down
- Hamstring Stretch - 30 seconds each leg
- Chest Stretch - 30 seconds

### Notes
- Focus on form over speed for best results`
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          response: "I can help with fitness-related questions. Try asking about workouts, nutrition, or specific exercises!"
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error: any) {
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