// Authentication client with Supabase Auth
export async function signUp(email: string, password: string) {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) throw new Error('Signup failed')
    return await response.json()
  } catch (error) {
    console.error('Signup error:', error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) throw new Error('Signin failed')
    return await response.json()
  } catch (error) {
    console.error('Signin error:', error)
    throw error
  }
}

export async function signOut() {
  try {
    const response = await fetch('/api/auth/signout', { method: 'POST' })
    if (!response.ok) throw new Error('Signout failed')
    return await response.json()
  } catch (error) {
    console.error('Signout error:', error)
    throw error
  }
}

export async function getSession() {
  try {
    const response = await fetch('/api/auth/session')
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error('Session fetch error:', error)
    return null
  }
}
