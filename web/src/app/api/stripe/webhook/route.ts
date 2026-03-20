export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        console.log('Subscription event:', type, data)
        break
      case 'invoice.payment_succeeded':
        console.log('Payment succeeded:', data)
        break
      case 'invoice.payment_failed':
        console.log('Payment failed:', data)
        break
    }

    return Response.json({ success: true, received: true })
  } catch (error) {
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
