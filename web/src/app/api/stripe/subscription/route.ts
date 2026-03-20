export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    const subscription = {
      userId,
      tier: 'builder',
      status: 'active',
      currentPeriodStart: new Date(Date.now() - 19 * 24 * 3600000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 12 * 24 * 3600000).toISOString(),
      price: 12.99,
      cancelAtPeriodEnd: false,
    }

    return Response.json({ success: true, subscription })
  } catch (error) {
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
