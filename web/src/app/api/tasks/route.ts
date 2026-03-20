export async function GET(request: Request) {
  try {
    const mockTasks = [
      {
        id: 1,
        title: 'Review Q2 Budget',
        done: false,
        priority: 'high',
        marketLinked: true,
        date: '2026-03-20',
        category: 'finance',
      },
      {
        id: 2,
        title: 'Weekly Planning',
        done: true,
        priority: 'medium',
        marketLinked: false,
        date: '2026-03-19',
        category: 'personal',
      },
      {
        id: 3,
        title: 'Check EUR/USD Levels',
        done: false,
        priority: 'high',
        marketLinked: true,
        date: '2026-03-20',
        category: 'finance',
      },
    ]

    return Response.json({
      status: 'success',
      tasks: mockTasks,
      count: mockTasks.length,
    })
  } catch (error) {
    return Response.json(
      { status: 'error', message: 'Failed to fetch tasks', error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newTask = {
      id: Math.random(),
      ...body,
      createdAt: new Date().toISOString(),
    }

    return Response.json({
      status: 'success',
      message: 'Task created successfully',
      task: newTask,
    })
  } catch (error) {
    return Response.json(
      { status: 'error', message: 'Failed to create task', error: String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    return Response.json({
      status: 'success',
      message: 'Task updated successfully',
      task: body,
    })
  } catch (error) {
    return Response.json(
      { status: 'error', message: 'Failed to update task', error: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    return Response.json({
      status: 'success',
      message: `Task ${id} deleted successfully`,
    })
  } catch (error) {
    return Response.json(
      { status: 'error', message: 'Failed to delete task', error: String(error) },
      { status: 500 }
    )
  }
}
