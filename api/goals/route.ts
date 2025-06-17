import { NextResponse } from 'next/server';

// Mock data for development
const mockGoals = [
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

export async function GET() {
  return NextResponse.json(mockGoals);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newGoal = {
    id: mockGoals.length + 1,
    ...body,
    createdAt: new Date(),
  };
  
  mockGoals.push(newGoal);
  
  return NextResponse.json(newGoal, { status: 201 });
}