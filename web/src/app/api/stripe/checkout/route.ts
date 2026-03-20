export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tier, email } = body

    const session = {
      id: `cs_${Math.random().toString(36).substr(2, 9)}`,
      client_secret: `cs_secret_${Math.random().toString(36).substr(2, 9)}`,
      url: 'https://checkout.stripe.com/pay/mock',
      status: 'open',
      tier,
      email,
      createdAt: new Date().toISOString(),
    }

    return Response.json({ success: true, session })
  } catch (error) {
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
