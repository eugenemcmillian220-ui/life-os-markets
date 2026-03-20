export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return Response.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      )
    }

    const user = {
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      email,
      createdAt: new Date().toISOString(),
      tier: 'starter',
    }

    return Response.json({ success: true, user })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
