import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGoalSchema, insertTaskSchema, insertAiSuggestionSchema } from "@shared/schema";
import { optimizeSchedule, generateTasksFromGoal, getChatResponse } from "./services/openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Goals routes
  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await storage.getGoals();
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.get("/api/goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const goal = await storage.getGoal(id);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.json(goal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goal" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const validatedData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(validatedData);
      res.status(201).json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid goal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create goal" });
    }
  });

  app.put("/api/goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertGoalSchema.partial().parse(req.body);
      const goal = await storage.updateGoal(id, validatedData);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid goal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update goal" });
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGoal(id);
      if (!deleted) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });

  // Tasks routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const tasks = await storage.getTasks(date);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, validatedData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // AI Suggestions routes
  app.get("/api/ai-suggestions", async (req, res) => {
    try {
      const suggestions = await storage.getAiSuggestions();
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI suggestions" });
    }
  });

  app.post("/api/ai-suggestions/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markSuggestionAsRead(id);
      if (!success) {
        return res.status(404).json({ message: "Suggestion not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to mark suggestion as read" });
    }
  });

  // AI Integration routes
  app.post("/api/ai/optimize-schedule", async (req, res) => {
    try {
      const goals = await storage.getGoals();
      const tasks = await storage.getTasks();
      
      const result = await optimizeSchedule({
        goals,
        existingTasks: tasks,
        preferences: req.body.preferences
      });

      res.json(result);
    } catch (error) {
      console.error('Schedule optimization error:', error);
      res.status(500).json({ message: "Failed to optimize schedule" });
    }
  });

  app.post("/api/ai/generate-tasks/:goalId", async (req, res) => {
    try {
      const goalId = parseInt(req.params.goalId);
      const goal = await storage.getGoal(goalId);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }

      const tasks = await generateTasksFromGoal(goal);
      res.json(tasks);
    } catch (error) {
      console.error('Task generation error:', error);
      res.status(500).json({ message: "Failed to generate tasks from goal" });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const goals = await storage.getGoals();
      const tasks = await storage.getTasks();

      const response = await getChatResponse(message, { goals, tasks });
      res.json({ response });
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
