export async function GET() {
  try {
    const session = {
      user: {
        id: 'user_123',
        email: 'user@example.com',
        tier: 'builder',
      },
      expiresAt: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
    }

    return Response.json({ success: true, session })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
