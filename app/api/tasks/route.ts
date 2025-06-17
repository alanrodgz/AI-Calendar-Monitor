export async function GET() {
  try {
    // Mock data for development
    const tasks = [
      {
        id: "1",
        title: "Review React documentation",
        description: "Go through official React docs",
        goalId: "1",
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        duration: 120, // 2 hours in minutes
        priority: "high",
        status: "scheduled",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Set up project structure",
        description: "Initialize portfolio project",
        goalId: "2",
        startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        duration: 60, // 1 hour in minutes
        priority: "medium",
        status: "scheduled",
        createdAt: new Date().toISOString(),
      },
    ];

    return Response.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return Response.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Mock response - in real app, save to database
    const newTask = {
      id: Date.now().toString(),
      ...body,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };

    return Response.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return Response.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}