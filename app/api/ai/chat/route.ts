import OpenAI from "openai";
import { insertTaskSchema, insertGoalSchema } from "@/shared/schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple in-memory storage for tasks and goals
let tasks: any[] = [];
let goals: any[] = [];

export async function POST(request: Request) {
  try {
    const { message, goals: userGoals = [], tasks: userTasks = [] } = await request.json();

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Update local state with current user data
    goals = userGoals;
    tasks = userTasks;

    // First, determine if this is an action request (create tasks/goals) or just a question
    const actionDetection = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that determines if a user message requires creating calendar tasks/events or is just a question. 
          
          Respond with JSON only in this exact format:
          {
            "action": "create_tasks" | "create_goal" | "question",
            "confidence": 0.0-1.0
          }
          
          Examples:
          - "Create a weekly workout plan" -> {"action": "create_tasks", "confidence": 0.9}
          - "Schedule my morning routine" -> {"action": "create_tasks", "confidence": 0.8}
          - "What's the best time for focused work?" -> {"action": "question", "confidence": 0.9}
          - "I want to learn Spanish this year" -> {"action": "create_goal", "confidence": 0.8}`
        },
        {
          role: "user",
          content: message
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 100,
      temperature: 0.3,
    });

    const actionResult = JSON.parse(actionDetection.choices[0]?.message?.content || '{"action": "question", "confidence": 0.5}');

    if (actionResult.action === "create_tasks" && actionResult.confidence > 0.7) {
      // Generate and create actual calendar tasks
      const taskGeneration = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a calendar assistant that creates structured tasks. Based on the user's request, generate specific calendar tasks with realistic timing.

            Respond with JSON only in this exact format:
            {
              "tasks": [
                {
                  "title": "Task Name",
                  "description": "Brief description",
                  "startTime": "2024-01-15T09:00:00.000Z",
                  "duration": 60,
                  "priority": "high" | "medium" | "low",
                  "goalId": null
                }
              ],
              "message": "I've created X tasks for your schedule..."
            }

            Rules:
            - Use realistic dates starting from tomorrow
            - Duration in minutes (30, 60, 90, 120 typical)
            - Create 3-7 specific, actionable tasks
            - Spread tasks across the week appropriately
            - Use ISO 8601 date format`
          },
          {
            role: "user",
            content: `Current date: ${new Date().toISOString()}. Request: ${message}`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
        temperature: 0.7,
      });

      const taskData = JSON.parse(taskGeneration.choices[0]?.message?.content || '{"tasks": [], "message": "I couldn\'t generate tasks."}');
      
      // Create the tasks by calling our tasks API
      const createdTasks = [];
      for (const task of taskData.tasks) {
        try {
          const response = await fetch(`${request.url.replace('/api/ai/chat', '/api/tasks')}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
          });
          if (response.ok) {
            const createdTask = await response.json();
            createdTasks.push(createdTask);
          }
        } catch (error) {
          console.error('Error creating task:', error);
        }
      }

      return Response.json({ 
        response: taskData.message || `I've created ${createdTasks.length} tasks for your schedule. Check your calendar to see them!`,
        tasksCreated: createdTasks.length,
        action: 'create_tasks'
      });

    } else if (actionResult.action === "create_goal" && actionResult.confidence > 0.7) {
      // Generate and create a goal
      const goalGeneration = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a goal-setting assistant. Based on the user's request, create a structured goal.

            Respond with JSON only in this exact format:
            {
              "goal": {
                "title": "Goal Name",
                "description": "Detailed description",
                "dueDate": "2024-06-15T00:00:00.000Z",
                "priority": "high" | "medium" | "low",
                "progress": 0
              },
              "message": "I've created a goal for you..."
            }

            Rules:
            - Set realistic due dates (weeks to months in the future)
            - Progress starts at 0
            - Use ISO 8601 date format`
          },
          {
            role: "user",
            content: `Current date: ${new Date().toISOString()}. Request: ${message}`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
        temperature: 0.7,
      });

      const goalData = JSON.parse(goalGeneration.choices[0]?.message?.content || '{"goal": null, "message": "I couldn\'t create a goal."}');
      
      if (goalData.goal) {
        try {
          const response = await fetch(`${request.url.replace('/api/ai/chat', '/api/goals')}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(goalData.goal)
          });
          if (response.ok) {
            return Response.json({ 
              response: goalData.message || "I've created a new goal for you!",
              action: 'create_goal'
            });
          }
        } catch (error) {
          console.error('Error creating goal:', error);
        }
      }
    }

    // Default to answering questions
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI productivity assistant specialized in task management and scheduling optimization. 
          
          Current user context:
          - Goals: ${goals.length > 0 ? goals.map(g => `"${g.title}" (${g.priority} priority, due ${g.dueDate})`).join(', ') : 'None set'}
          - Tasks: ${tasks.length > 0 ? tasks.map(t => `"${t.title}" on ${new Date(t.startTime).toLocaleDateString()}`).join(', ') : 'None scheduled'}
          
          Provide helpful, actionable advice about productivity, time management, and scheduling. Be concise and specific.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return Response.json({ response: reply, action: 'question' });
  } catch (error) {
    console.error('Error in AI chat:', error);
    return Response.json(
      { error: "Failed to process AI request" },
      { status: 500 }
    );
  }
}