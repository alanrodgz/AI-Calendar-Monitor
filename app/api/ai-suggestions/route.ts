export async function GET() {
  try {
    // Mock data for development
    const suggestions = [
      {
        id: "1",
        content: "Consider breaking down 'Learn React' into smaller, specific tasks like 'Complete React Tutorial' and 'Build Practice Component'",
        type: "task_breakdown",
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        content: "You have 2 hours of free time tomorrow morning - perfect for your 'Review React documentation' task",
        type: "schedule_optimization",
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ];

    return Response.json(suggestions);
  } catch (error) {
    console.error('Error fetching AI suggestions:', error);
    return Response.json({ error: 'Failed to fetch AI suggestions' }, { status: 500 });
  }
}