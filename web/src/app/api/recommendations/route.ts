import { generateRecommendations } from '@/lib/llm-client'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await generateRecommendations({
      marketEvent: body.marketEvent || 'General market update',
      userGoals: body.userGoals || [],
      userTasks: body.userTasks || [],
      sentiment: body.sentiment || 'neutral',
    })

    if (!result.success) {
      return Response.json(
        { status: 'error', message: 'Failed to generate recommendations', error: result.error },
        { status: 500 }
      )
    }

    return Response.json({
      status: 'success',
      recommendations: result.recommendations,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return Response.json(
      { status: 'error', message: 'Recommendation error', error: String(error) },
      { status: 500 }
    )
  }
}
