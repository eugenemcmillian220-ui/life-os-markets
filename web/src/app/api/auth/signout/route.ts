export async function POST() {
  try {
    return Response.json({ success: true, message: 'Signed out' })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
