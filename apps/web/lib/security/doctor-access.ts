import crypto from 'crypto'

export const ALLOWED_ACCESS_DURATIONS = [0.5, 1, 2] as const
export type AllowedAccessDuration = (typeof ALLOWED_ACCESS_DURATIONS)[number]
export type AccessScope = 'read' | 'read_write'

export function isAllowedAccessDuration(value: number) {
  return ALLOWED_ACCESS_DURATIONS.includes(value as AllowedAccessDuration)
}

export function generateRawAccessKey() {
  return crypto.randomBytes(32).toString('hex')
}

export function hashAccessKey(rawKey: string) {
  return crypto.createHash('sha256').update(rawKey).digest('hex')
}

export function resolveAccessExpiry(durationHours: number) {
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + durationHours * 60)
  return expiresAt.toISOString()
}
