import * as crypto from 'node:crypto'

const encryptionKey =
  process.env.ENCRYPTION_KEY || '0f9b32d5b5a29d7e7b1344d7517c9a9a'
const encryptionInputEncoding = 'utf8'
const encryptionOutputEncoding = 'hex'
const encryptionAlgorithm = process.env
  .ENCRYPTION_ALGORITHM as crypto.CipherGCMTypes

export function encrypt(data: string) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    encryptionAlgorithm,
    Buffer.from(encryptionKey),
    iv,
  )

  let encrypted = cipher.update(
    data,
    encryptionInputEncoding,
    encryptionOutputEncoding,
  )
  encrypted += cipher.final(encryptionOutputEncoding)
  encrypted += iv.toString(encryptionOutputEncoding)

  return encrypted
}

export function decrypt(data: string) {
  const iv = Buffer.from(data.slice(-32), encryptionOutputEncoding)
  const dataWithoutIv = data.slice(0, -32)

  const decipher = crypto.createDecipheriv(
    encryptionAlgorithm,
    Buffer.from(encryptionKey),
    iv,
  )
  let decrypted = decipher.update(
    dataWithoutIv,
    encryptionOutputEncoding,
    encryptionInputEncoding,
  )
  decrypted += decipher.final(encryptionInputEncoding)

  return decrypted
}
