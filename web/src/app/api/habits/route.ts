export async function GET() {
  try {
    const mockHabits = [
      { id: 1, name: 'Exercise', streak: 7, goal: 'Daily', lastDone: '2026-03-19', target: 30 },
      { id: 2, name: 'Meditation', streak: 14, goal: 'Daily', lastDone: '2026-03-19', target: 20 },
      { id: 3, name: 'Reading', streak: 3, goal: 'Daily', lastDone: '2026-03-19', target: 60 },
    ]
    return Response.json({ status: 'success', habits: mockHabits, count: mockHabits.length })
  } catch (error) {
    return Response.json({ status: 'error', error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return Response.json({ status: 'success', habit: { id: Math.random(), ...body } })
  } catch (error) {
    return Response.json({ status: 'error', error: String(error) }, { status: 500 })
  }
}
