export async function GET() {
  try {
    const mockGoals = [
      { id: 1, name: 'Save €10k', progress: 65, target: '€10,000', category: 'financial', tags: ['ECB-sensitive'], currency: 'EUR' },
      { id: 2, name: 'Rebalance Portfolio', progress: 40, target: '50% equity', category: 'financial', tags: ['Fed-dependent'], currency: 'USD' },
      { id: 3, name: 'Learn Forex Trading', progress: 30, target: '100 hours', category: 'personal', tags: [], currency: null },
    ]
    return Response.json({ status: 'success', goals: mockGoals, count: mockGoals.length })
  } catch (error) {
    return Response.json({ status: 'error', error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return Response.json({ status: 'success', goal: { id: Math.random(), ...body } })
  } catch (error) {
    return Response.json({ status: 'error', error: String(error) }, { status: 500 })
  }
}
