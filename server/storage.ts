import { goals, tasks, aiSuggestions, type Goal, type Task, type AiSuggestion, type InsertGoal, type InsertTask, type InsertAiSuggestion } from "@shared/schema";

export interface IStorage {
  // Goals
  getGoals(): Promise<Goal[]>;
  getGoal(id: number): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, updates: Partial<InsertGoal>): Promise<Goal | undefined>;
  deleteGoal(id: number): Promise<boolean>;

  // Tasks
  getTasks(date?: Date): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  getTasksByGoal(goalId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // AI Suggestions
  getAiSuggestions(): Promise<AiSuggestion[]>;
  createAiSuggestion(suggestion: InsertAiSuggestion): Promise<AiSuggestion>;
  markSuggestionAsRead(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private goals: Map<number, Goal>;
  private tasks: Map<number, Task>;
  private aiSuggestions: Map<number, AiSuggestion>;
  private currentGoalId: number;
  private currentTaskId: number;
  private currentSuggestionId: number;

  constructor() {
    this.goals = new Map();
    this.tasks = new Map();
    this.aiSuggestions = new Map();
    this.currentGoalId = 1;
    this.currentTaskId = 1;
    this.currentSuggestionId = 1;

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample goals
    const sampleGoals: Goal[] = [
      {
        id: 1,
        title: "Complete Product Launch",
        description: "Launch new SaaS product by end of Q1",
        priority: "high",
        progress: 60,
        dueDate: new Date("2024-03-31"),
        isCompleted: false,
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "Learn Spanish",
        description: "30 minutes daily practice",
        priority: "medium",
        progress: 25,
        dueDate: null,
        isCompleted: false,
        createdAt: new Date(),
      },
      {
        id: 3,
        title: "Fitness Goals",
        description: "Workout 4x per week",
        priority: "low",
        progress: 50,
        dueDate: null,
        isCompleted: false,
        createdAt: new Date(),
      },
    ];

    sampleGoals.forEach(goal => {
      this.goals.set(goal.id, goal);
      this.currentGoalId = Math.max(this.currentGoalId, goal.id + 1);
    });

    // Sample tasks
    const today = new Date();
    const sampleTasks: Task[] = [
      {
        id: 1,
        title: "Product Demo Prep",
        description: "Prepare demo for stakeholder meeting",
        goalId: 1,
        startTime: new Date(today.setHours(9, 0, 0, 0)),
        endTime: new Date(today.setHours(11, 0, 0, 0)),
        duration: 120,
        priority: "high",
        isCompleted: false,
        isAiGenerated: true,
        color: "#6366F1",
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "Team Standup",
        description: "Daily standup with product team",
        goalId: 1,
        startTime: new Date(today.setHours(11, 0, 0, 0)),
        endTime: new Date(today.setHours(11, 30, 0, 0)),
        duration: 30,
        priority: "medium",
        isCompleted: false,
        isAiGenerated: false,
        color: "#10B981",
        createdAt: new Date(),
      },
      {
        id: 3,
        title: "Deep Work Block",
        description: "Feature development & coding",
        goalId: 1,
        startTime: new Date(today.setHours(13, 0, 0, 0)),
        endTime: new Date(today.setHours(15, 30, 0, 0)),
        duration: 150,
        priority: "high",
        isCompleted: false,
        isAiGenerated: true,
        color: "#8B5CF6",
        createdAt: new Date(),
      },
      {
        id: 4,
        title: "Spanish Practice",
        description: "Daily language learning session",
        goalId: 2,
        startTime: new Date(today.setHours(16, 0, 0, 0)),
        endTime: new Date(today.setHours(16, 30, 0, 0)),
        duration: 30,
        priority: "medium",
        isCompleted: false,
        isAiGenerated: true,
        color: "#10B981",
        createdAt: new Date(),
      },
    ];

    sampleTasks.forEach(task => {
      this.tasks.set(task.id, task);
      this.currentTaskId = Math.max(this.currentTaskId, task.id + 1);
    });

    // Sample AI suggestions
    const sampleSuggestions: AiSuggestion[] = [
      {
        id: 1,
        content: "Schedule product demo prep for tomorrow 2-4 PM when you're most focused.",
        type: "scheduling",
        isRead: false,
        createdAt: new Date(),
      },
      {
        id: 2,
        content: "Move Spanish practice to 8 AM - studies show language learning is 40% more effective in the morning.",
        type: "optimization",
        isRead: false,
        createdAt: new Date(),
      },
    ];

    sampleSuggestions.forEach(suggestion => {
      this.aiSuggestions.set(suggestion.id, suggestion);
      this.currentSuggestionId = Math.max(this.currentSuggestionId, suggestion.id + 1);
    });
  }

  // Goals
  async getGoals(): Promise<Goal[]> {
    return Array.from(this.goals.values());
  }

  async getGoal(id: number): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = this.currentGoalId++;
    const goal: Goal = {
      ...insertGoal,
      id,
      createdAt: new Date(),
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: number, updates: Partial<InsertGoal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;

    const updatedGoal = { ...goal, ...updates };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(id: number): Promise<boolean> {
    return this.goals.delete(id);
  }

  // Tasks
  async getTasks(date?: Date): Promise<Task[]> {
    const allTasks = Array.from(this.tasks.values());
    if (!date) return allTasks;

    // Filter tasks for the specific date
    return allTasks.filter(task => {
      const taskDate = new Date(task.startTime);
      return taskDate.toDateString() === date.toDateString();
    });
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByGoal(goalId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.goalId === goalId);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = {
      ...insertTask,
      id,
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // AI Suggestions
  async getAiSuggestions(): Promise<AiSuggestion[]> {
    return Array.from(this.aiSuggestions.values());
  }

  async createAiSuggestion(insertSuggestion: InsertAiSuggestion): Promise<AiSuggestion> {
    const id = this.currentSuggestionId++;
    const suggestion: AiSuggestion = {
      ...insertSuggestion,
      id,
      createdAt: new Date(),
    };
    this.aiSuggestions.set(id, suggestion);
    return suggestion;
  }

  async markSuggestionAsRead(id: number): Promise<boolean> {
    const suggestion = this.aiSuggestions.get(id);
    if (!suggestion) return false;

    suggestion.isRead = true;
    this.aiSuggestions.set(id, suggestion);
    return true;
  }
}

export const storage = new MemStorage();
