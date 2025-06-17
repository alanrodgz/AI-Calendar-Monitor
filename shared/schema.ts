import { z } from "zod";

// Goal schema
export const insertGoalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  progress: z.number().min(0).max(100).default(0),
  dueDate: z.date().nullable().optional(),
  isCompleted: z.boolean().default(false),
});

export const goalSchema = insertGoalSchema.extend({
  id: z.number(),
  createdAt: z.date(),
});

// Task schema
export const insertTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  goalId: z.number().nullable().optional(),
  startTime: z.date(),
  endTime: z.date(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  isCompleted: z.boolean().default(false),
  isAiGenerated: z.boolean().default(false),
  color: z.string().optional(),
});

export const taskSchema = insertTaskSchema.extend({
  id: z.number(),
  createdAt: z.date(),
});

// AI Suggestion schema
export const insertAiSuggestionSchema = z.object({
  content: z.string().min(1, "Content is required"),
  type: z.enum(["scheduling", "optimization", "reminder"]).default("scheduling"),
  isRead: z.boolean().default(false),
});

export const aiSuggestionSchema = insertAiSuggestionSchema.extend({
  id: z.number(),
  createdAt: z.date(),
});

// Types
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = z.infer<typeof goalSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = z.infer<typeof taskSchema>;
export type InsertAiSuggestion = z.infer<typeof insertAiSuggestionSchema>;
export type AiSuggestion = z.infer<typeof aiSuggestionSchema>;