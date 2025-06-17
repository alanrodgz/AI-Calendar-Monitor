import { NextResponse } from 'next/server';

const mockSuggestions = [
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

export async function GET() {
  return NextResponse.json(mockSuggestions);
}