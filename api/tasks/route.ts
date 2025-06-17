import { NextResponse } from 'next/server';

// Mock data for development
const mockTasks = [
  {
    id: 1,
    title: "Product Demo Prep",
    description: "Prepare demo for stakeholder meeting",
    goalId: 1,
    startTime: new Date(new Date().setHours(9, 0, 0, 0)),
    endTime: new Date(new Date().setHours(11, 0, 0, 0)),
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
    startTime: new Date(new Date().setHours(11, 0, 0, 0)),
    endTime: new Date(new Date().setHours(11, 30, 0, 0)),
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
    startTime: new Date(new Date().setHours(13, 0, 0, 0)),
    endTime: new Date(new Date().setHours(15, 30, 0, 0)),
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
    startTime: new Date(new Date().setHours(16, 0, 0, 0)),
    endTime: new Date(new Date().setHours(16, 30, 0, 0)),
    duration: 30,
    priority: "medium",
    isCompleted: false,
    isAiGenerated: true,
    color: "#10B981",
    createdAt: new Date(),
  },
];

export async function GET() {
  return NextResponse.json(mockTasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newTask = {
    id: mockTasks.length + 1,
    ...body,
    createdAt: new Date(),
  };
  
  mockTasks.push(newTask);
  
  return NextResponse.json(newTask, { status: 201 });
}