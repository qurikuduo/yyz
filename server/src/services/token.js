import crypto from 'node:crypto'

const SCRYPT_KEYLEN = 64

/** Generate an unguessable, URL-safe share token. */
export function generateToken() {
  return crypto.randomBytes(12).toString('base64url') // 16 chars
}

/** Hash a password with a random salt using scrypt. */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(String(password), salt, SCRYPT_KEYLEN).toString('hex')
  return { salt, hash }
}

/** Constant-time password verification. */
export function verifyPassword(password, salt, expectedHash) {
  const test = crypto.scryptSync(String(password), salt, SCRYPT_KEYLEN)
  const expected = Buffer.from(expectedHash, 'hex')
  if (test.length !== expected.length) return false
  return crypto.timingSafeEqual(test, expected)
}
