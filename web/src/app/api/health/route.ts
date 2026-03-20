export async function GET() {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      apis: {
        supabase: 'ready',
        marketaux: 'ready',
        groq: 'ready',
        alphavantage: 'ready',
      },
    }
    return Response.json(health, { status: 200 })
  } catch (error) {
    return Response.json(
      { status: 'error', message: 'Health check failed', error: String(error) },
      { status: 500 }
    )
  }
}
