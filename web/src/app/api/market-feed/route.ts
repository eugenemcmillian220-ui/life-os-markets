import { fetchMarketNews } from '@/lib/market-client'

export async function GET() {
  try {
    const result = await fetchMarketNews()
    
    if (!result.success) {
      return Response.json(
        { status: 'error', message: 'Failed to fetch market feed', error: result.error },
        { status: 500 }
      )
    }

    return Response.json({
      status: 'success',
      data: result.data,
      count: result.data.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return Response.json(
      { status: 'error', message: 'Market feed error', error: String(error) },
      { status: 500 }
    )
  }
}
