export async function GET() {
  try {
    // Mock data for development
    const goals = [
      {
        id: "1",
        title: "Learn React",
        description: "Master React fundamentals and advanced concepts",
        priority: "high",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 60,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Build Portfolio",
        description: "Create a professional portfolio website",
        priority: "medium",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 30,
        createdAt: new Date().toISOString(),
      },
    ];

    return Response.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return Response.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Mock response - in real app, save to database
    const newGoal = {
      id: Date.now().toString(),
      ...body,
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    return Response.json(newGoal, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return Response.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}