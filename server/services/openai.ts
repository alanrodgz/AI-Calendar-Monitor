import OpenAI from "openai";
import { Goal, Task, InsertTask } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

export interface ScheduleOptimizationRequest {
  goals: Goal[];
  existingTasks: Task[];
  preferences?: {
    workHours?: { start: number; end: number };
    focusBlocks?: number[];
    breakDuration?: number;
  };
}

export interface ScheduleOptimizationResponse {
  suggestedTasks: Omit<InsertTask, 'id' | 'createdAt'>[];
  suggestions: string[];
  reasoning: string;
}

export async function optimizeSchedule(request: ScheduleOptimizationRequest): Promise<ScheduleOptimizationResponse> {
  try {
    const prompt = `
You are an AI productivity assistant similar to Motion. Analyze the user's goals and existing tasks to create an optimized schedule.

Goals:
${request.goals.map(goal => `- ${goal.title}: ${goal.description} (Priority: ${goal.priority}, Progress: ${goal.progress}%)`).join('\n')}

Existing Tasks:
${request.existingTasks.map(task => `- ${task.title}: ${new Date(task.startTime).toLocaleString()} - ${new Date(task.endTime).toLocaleString()}`).join('\n')}

User Preferences:
- Work Hours: ${request.preferences?.workHours?.start || 9}:00 - ${request.preferences?.workHours?.end || 17}:00
- Focus Blocks: ${request.preferences?.focusBlocks?.join(', ') || 'Not specified'}
- Break Duration: ${request.preferences?.breakDuration || 15} minutes

Please provide:
1. Suggested new tasks to help achieve the goals
2. Optimization suggestions for existing schedule
3. Reasoning behind your recommendations

Respond with JSON in this format:
{
  "suggestedTasks": [
    {
      "title": "Task name",
      "description": "Task description",
      "goalId": 1,
      "startTime": "2024-03-15T14:00:00.000Z",
      "endTime": "2024-03-15T15:00:00.000Z",
      "duration": 60,
      "priority": "high",
      "isCompleted": false,
      "isAiGenerated": true,
      "color": "#6366F1"
    }
  ],
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2"
  ],
  "reasoning": "Explanation of the optimization strategy"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI productivity assistant that helps users optimize their schedules based on their goals and priorities. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      suggestedTasks: result.suggestedTasks || [],
      suggestions: result.suggestions || [],
      reasoning: result.reasoning || "No reasoning provided"
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error("Failed to optimize schedule: " + (error as Error).message);
  }
}

export async function generateTasksFromGoal(goal: Goal): Promise<Omit<InsertTask, 'id' | 'createdAt'>[]> {
  try {
    const prompt = `
Break down this goal into actionable tasks:

Goal: ${goal.title}
Description: ${goal.description}
Priority: ${goal.priority}
Current Progress: ${goal.progress}%
Due Date: ${goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : 'No deadline'}

Create 3-5 specific, actionable tasks that would help achieve this goal. Consider the current progress and remaining work needed.

Respond with JSON in this format:
{
  "tasks": [
    {
      "title": "Specific task name",
      "description": "Detailed task description",
      "goalId": ${goal.id},
      "duration": 60,
      "priority": "high",
      "isCompleted": false,
      "isAiGenerated": true,
      "color": "#6366F1"
    }
  ]
}

Note: Do not include startTime and endTime - these will be scheduled separately.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that breaks down goals into actionable tasks. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Add default scheduling (user can adjust later)
    const now = new Date();
    const tasks = result.tasks?.map((task: any, index: number) => ({
      ...task,
      startTime: new Date(now.getTime() + (index + 1) * 24 * 60 * 60 * 1000), // Next few days
      endTime: new Date(now.getTime() + (index + 1) * 24 * 60 * 60 * 1000 + task.duration * 60 * 1000),
    })) || [];

    return tasks;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error("Failed to generate tasks from goal: " + (error as Error).message);
  }
}

export async function getChatResponse(message: string, context: { goals: Goal[]; tasks: Task[] }): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const contextString = `
Current Goals:
${context.goals.map(goal => `- ${goal.title}: ${goal.description} (${goal.progress}% complete)`).join('\n')}

Today's Tasks:
${context.tasks.map(task => `- ${task.title}: ${new Date(task.startTime).toLocaleTimeString()} - ${new Date(task.endTime).toLocaleTimeString()}`).join('\n')}
`;

    console.log('Making OpenAI API request for chat...');
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI productivity assistant helping users manage their schedule and achieve their goals. You have access to their current goals and tasks. Be helpful, concise, and actionable in your responses.

${contextString}`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    console.log('OpenAI API response received successfully');
    return response.choices[0].message.content || "I'm sorry, I couldn't process your request right now.";
  } catch (error) {
    console.error('OpenAI API error details:', error);
    if (error.code === 'invalid_api_key') {
      return "The OpenAI API key appears to be invalid. Please check your API key configuration.";
    }
    if (error.code === 'insufficient_quota') {
      return "The OpenAI API quota has been exceeded. Please check your OpenAI account billing.";
    }
    return `I'm experiencing technical difficulties: ${error.message}. Please try again later.`;
  }
}
