import { describe, expect, it } from 'vitest'
import {
  generateRawAccessKey,
  hashAccessKey,
  isAllowedAccessDuration,
  resolveAccessExpiry,
} from './doctor-access'

describe('doctor access security helpers', () => {
  it('generates a 64-hex-char access key', () => {
    const key = generateRawAccessKey()
    expect(key).toMatch(/^[a-f0-9]{64}$/)
  })

  it('hashes a key deterministically', () => {
    const key = 'abc123'
    expect(hashAccessKey(key)).toBe(hashAccessKey(key))
    expect(hashAccessKey(key)).not.toBe(key)
  })

  it('accepts only PRD allowed TTL values', () => {
    expect(isAllowedAccessDuration(0.5)).toBe(true)
    expect(isAllowedAccessDuration(1)).toBe(true)
    expect(isAllowedAccessDuration(2)).toBe(true)
    expect(isAllowedAccessDuration(3)).toBe(false)
  })

  it('calculates expiry in the future', () => {
    const expiry = new Date(resolveAccessExpiry(1)).getTime()
    expect(expiry).toBeGreaterThan(Date.now())
  })
})
