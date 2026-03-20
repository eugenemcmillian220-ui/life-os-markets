export async function GET() {
  try {
    const mockPreferences = {
      markets: ['US', 'EU', 'ASIA'],
      riskTolerance: 'medium',
      notifications: true,
      currencies: ['EUR', 'USD'],
      alertThreshold: 'high',
    }
    return Response.json({ status: 'success', preferences: mockPreferences })
  } catch (error) {
    return Response.json({ status: 'error', error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return Response.json({ status: 'success', preferences: body })
  } catch (error) {
    return Response.json({ status: 'error', error: String(error) }, { status: 500 })
  }
}
