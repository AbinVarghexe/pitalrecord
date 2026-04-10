import { describe, expect, it } from 'vitest'
import { validatePrescriptionUpload } from './prescriptions'

function mockFile({
  name,
  type,
  size,
}: {
  name: string
  type: string
  size: number
}): File {
  const content = 'x'.repeat(Math.max(1, Math.floor(size / 2)))
  return new File([content, content], name, { type })
}

describe('prescription upload validation', () => {
  it('rejects missing file', () => {
    const result = validatePrescriptionUpload(null)
    expect(result.ok).toBe(false)
  })

  it('rejects unsupported mime type', () => {
    const file = mockFile({ name: 'rx.txt', type: 'text/plain', size: 1024 })
    const result = validatePrescriptionUpload(file)
    expect(result.ok).toBe(false)
  })

  it('rejects files larger than 20MB', () => {
    const file = mockFile({
      name: 'big.pdf',
      type: 'application/pdf',
      size: 21 * 1024 * 1024,
    })
    const result = validatePrescriptionUpload(file)
    expect(result.ok).toBe(false)
  })

  it('accepts supported format within size limit', () => {
    const file = mockFile({
      name: 'rx.pdf',
      type: 'application/pdf',
      size: 1024 * 1024,
    })
    const result = validatePrescriptionUpload(file)
    expect(result.ok).toBe(true)
  })
})
