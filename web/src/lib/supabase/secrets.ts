import { createClient } from './server'

// In-memory cache for secrets (rotates on deployment)
const secretCache = new Map<string, { value: string; timestamp: number }>()
const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch a secret from Supabase Vault
 * Throws error if secret not found
 */
export async function getSecret(name: string): Promise<string> {
  try {
    const supabase = await createClient()

    // Use vault.decrypted_secrets table (built-in Supabase Vault)
    const { data, error } = await supabase
      .from('vault')
      .select('secret')
      .eq('name', name)
      .single()

    if (error) {
      // If vault table doesn't exist yet, try env variables as fallback
      const envValue = process.env[name]
      if (envValue) {
        console.warn(
          `[SECURITY] Secret '${name}' fetched from environment (should migrate to vault)`
        )
        return envValue
      }

      console.error(`[SECURITY] Failed to fetch secret '${name}' from vault:`, error)
      throw new Error(`Secret not found: ${name}`)
    }

    if (!data?.secret) {
      throw new Error(`Secret '${name}' is empty in vault`)
    }

    return data.secret
  } catch (error) {
    console.error(`[SECURITY] Error retrieving secret '${name}':`, error)
    throw error
  }
}

/**
 * Get cached secret with automatic refresh
 * Returns cached value if fresh, otherwise fetches new one
 */
export async function getCachedSecret(name: string): Promise<string> {
  const cached = secretCache.get(name)
  const now = Date.now()

  if (cached && now - cached.timestamp < CACHE_DURATION_MS) {
    return cached.value
  }

  try {
    const secret = await getSecret(name)
    secretCache.set(name, { value: secret, timestamp: now })
    return secret
  } catch (error) {
    // If fresh fetch fails, return stale cache if available
    if (cached) {
      console.warn(`[SECURITY] Using stale cached secret for '${name}'`)
      return cached.value
    }
    throw error
  }
}

/**
 * Clear all cached secrets (call on deployment/rotation)
 */
export function clearSecretCache() {
  secretCache.clear()
  console.log('[SECURITY] Secret cache cleared')
}

/**
 * Pre-load critical secrets into cache on startup
 */
export async function preloadCriticalSecrets(): Promise<void> {
  const criticalSecrets = ['GROQ_API_KEY', 'STRIPE_SECRET_KEY']

  for (const secretName of criticalSecrets) {
    try {
      await getCachedSecret(secretName)
      console.log(`[SECURITY] Preloaded secret: ${secretName}`)
    } catch (error) {
      console.warn(`[SECURITY] Failed to preload secret '${secretName}':`, error)
    }
  }
}

/**
 * Validate that all required secrets are available
 */
export async function validateSecretsAvailable(required: string[]): Promise<string[]> {
  const missing: string[] = []

  for (const secret of required) {
    try {
      await getCachedSecret(secret)
    } catch (error) {
      missing.push(secret)
    }
  }

  if (missing.length > 0) {
    console.error('[SECURITY] Missing secrets:', missing)
  }

  return missing
}
