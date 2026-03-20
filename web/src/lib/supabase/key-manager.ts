import { createClient } from './server'

export interface ApiKeyMetadata {
  id: string
  key_name: string
  created_at: string
  expires_at: string | null
  last_rotated: string | null
  status: 'active' | 'expired' | 'revoked'
  rotation_schedule: string
}

/**
 * Initialize API key tracking table
 * Run this once on app startup if table doesn't exist
 */
export async function initializeKeyMetadataTable(): Promise<void> {
  const supabase = await createClient()

  // SQL to create the table
  const sql = `
    CREATE TABLE IF NOT EXISTS api_key_metadata (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      key_name TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT NOW(),
      expires_at TIMESTAMP,
      last_rotated TIMESTAMP,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
      rotation_schedule TEXT DEFAULT '90 days',
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_api_key_status ON api_key_metadata(status);
    CREATE INDEX IF NOT EXISTS idx_api_key_expiry ON api_key_metadata(expires_at);
  `

  try {
    const { error } = await supabase.rpc('execute_raw_sql', { sql })
    if (error) {
      console.warn('[KEY_MANAGER] Table may already exist:', error.message)
    } else {
      console.log('[KEY_MANAGER] Key metadata table initialized')
    }
  } catch (error) {
    console.warn('[KEY_MANAGER] Could not initialize table:', error)
  }
}

/**
 * Register an API key for tracking
 */
export async function registerApiKey(
  keyName: string,
  expiresAt: Date,
  rotationSchedule: string = '90 days'
): Promise<ApiKeyMetadata | null> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('api_key_metadata').insert([
      {
        key_name: keyName,
        expires_at: expiresAt.toISOString(),
        rotation_schedule: rotationSchedule,
        status: 'active',
      },
    ])

    if (error) {
      console.error(`[KEY_MANAGER] Failed to register key ${keyName}:`, error)
      return null
    }

    console.log(`[KEY_MANAGER] Registered key: ${keyName}`)
    return data?.[0] || null
  } catch (error) {
    console.error('[KEY_MANAGER] Error registering key:', error)
    return null
  }
}

/**
 * Get all keys expiring within N days
 */
export async function getExpiringKeys(daysUntilExpiry: number = 30): Promise<ApiKeyMetadata[]> {
  const supabase = await createClient()

  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + daysUntilExpiry)

  try {
    const { data, error } = await supabase
      .from('api_key_metadata')
      .select('*')
      .eq('status', 'active')
      .lt('expires_at', expiryDate.toISOString())
      .gt('expires_at', new Date().toISOString())

    if (error) {
      console.error('[KEY_MANAGER] Failed to fetch expiring keys:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('[KEY_MANAGER] Error fetching expiring keys:', error)
    return []
  }
}

/**
 * Get all expired keys
 */
export async function getExpiredKeys(): Promise<ApiKeyMetadata[]> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('api_key_metadata')
      .select('*')
      .eq('status', 'active')
      .lt('expires_at', new Date().toISOString())

    if (error) {
      console.error('[KEY_MANAGER] Failed to fetch expired keys:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('[KEY_MANAGER] Error fetching expired keys:', error)
    return []
  }
}

/**
 * Mark a key as rotated
 */
export async function markKeyRotated(keyName: string, newExpiryDate: Date): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('api_key_metadata')
      .update({
        last_rotated: new Date().toISOString(),
        expires_at: newExpiryDate.toISOString(),
        status: 'active',
      })
      .eq('key_name', keyName)

    if (error) {
      console.error(`[KEY_MANAGER] Failed to mark key ${keyName} as rotated:`, error)
      return false
    }

    console.log(`[KEY_MANAGER] Marked key as rotated: ${keyName}`)
    return true
  } catch (error) {
    console.error('[KEY_MANAGER] Error marking key as rotated:', error)
    return false
  }
}

/**
 * Revoke a key
 */
export async function revokeKey(keyName: string): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('api_key_metadata')
      .update({
        status: 'revoked',
        expires_at: new Date().toISOString(),
      })
      .eq('key_name', keyName)

    if (error) {
      console.error(`[KEY_MANAGER] Failed to revoke key ${keyName}:`, error)
      return false
    }

    console.log(`[KEY_MANAGER] Revoked key: ${keyName}`)
    return true
  } catch (error) {
    console.error('[KEY_MANAGER] Error revoking key:', error)
    return false
  }
}

/**
 * Get key metadata
 */
export async function getKeyMetadata(keyName: string): Promise<ApiKeyMetadata | null> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('api_key_metadata')
      .select('*')
      .eq('key_name', keyName)
      .single()

    if (error) {
      console.warn(`[KEY_MANAGER] Key not found: ${keyName}`)
      return null
    }

    return data
  } catch (error) {
    console.error('[KEY_MANAGER] Error fetching key metadata:', error)
    return null
  }
}

/**
 * Check all keys and log status
 */
export async function checkAllKeysStatus(): Promise<{
  active: number
  expiring: number
  expired: number
  revoked: number
}> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('api_key_metadata').select('status, expires_at')

    if (error) {
      console.error('[KEY_MANAGER] Failed to fetch all keys:', error)
      return { active: 0, expiring: 0, expired: 0, revoked: 0 }
    }

    const now = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const status = {
      active: 0,
      expiring: 0,
      expired: 0,
      revoked: 0,
    }

    for (const key of data || []) {
      if (key.status === 'revoked') {
        status.revoked++
      } else if (key.status === 'expired' || (key.expires_at && new Date(key.expires_at) < now)) {
        status.expired++
      } else if (key.expires_at && new Date(key.expires_at) < thirtyDaysFromNow) {
        status.expiring++
      } else {
        status.active++
      }
    }

    console.log('[KEY_MANAGER] Key Status:', status)
    return status
  } catch (error) {
    console.error('[KEY_MANAGER] Error checking keys status:', error)
    return { active: 0, expiring: 0, expired: 0, revoked: 0 }
  }
}

/**
 * Default API keys to register on startup
 */
export const DEFAULT_KEYS = [
  {
    name: 'GROQ_API_KEY',
    rotationDays: 90,
  },
  {
    name: 'STRIPE_SECRET_KEY',
    rotationDays: 180,
  },
  {
    name: 'MARKETAUX_API_KEY',
    rotationDays: 180,
  },
  {
    name: 'ALPHA_VANTAGE_API_KEY',
    rotationDays: 365,
  },
  {
    name: 'GOOGLE_API_KEY',
    rotationDays: 90,
  },
  {
    name: 'HF_API_KEY',
    rotationDays: 180,
  },
]

/**
 * Initialize all default keys (call on app startup)
 */
export async function initializeDefaultKeys(): Promise<void> {
  console.log('[KEY_MANAGER] Initializing default API keys...')

  for (const key of DEFAULT_KEYS) {
    const existing = await getKeyMetadata(key.name)

    if (!existing) {
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + key.rotationDays)

      await registerApiKey(key.name, expiryDate, `${key.rotationDays} days`)
    }
  }

  // Check status
  await checkAllKeysStatus()
}
