export const MAX_PRESCRIPTION_FILE_SIZE = 20 * 1024 * 1024
export const ALLOWED_PRESCRIPTION_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/heic',
  'application/pdf',
])

export function validatePrescriptionUpload(file: File | null) {
  if (!file) {
    return { ok: false as const, error: 'No file provided' }
  }

  if (!ALLOWED_PRESCRIPTION_MIME_TYPES.has(file.type)) {
    return {
      ok: false as const,
      error: 'Invalid file type. Only JPEG, PNG, HEIC, and PDF are supported.',
    }
  }

  if (file.size > MAX_PRESCRIPTION_FILE_SIZE) {
    return { ok: false as const, error: 'File size exceeds 20MB limit.' }
  }

  return { ok: true as const, error: null }
}
