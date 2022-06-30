require('dotenv/config')
const crypto = require('crypto')

const SECRET_KEY = process.env.SECRET_KEY
const SECRET_IV = process.env.SECRET_IV
const ALGORITHM = process.env.ALGORITHM
const ALGORITHM_HASH = process.env.ALGORITHM_HASH

const key = crypto
  .createHash(ALGORITHM_HASH)
  .update(SECRET_KEY, 'utf-8')
  .digest('hex')
  .substring(0, 32)

const iv = crypto
  .createHash(ALGORITHM_HASH)
  .update(SECRET_IV, 'utf-8')
  .digest('hex')
  .substring(0, 16)

const encrypt = (password) => {
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  let encrypted =
    cipher.update(password, 'utf-8', 'base64') + cipher.final('base64')

  return Buffer.from(encrypted).toString('base64')
}

const decrypt = (password) => {
  const chunks = Buffer.from(password, 'base64')
  password = chunks.toString('utf-8')
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

  return decipher.update(password, 'base64', 'utf-8') + decipher.final('utf-8')
}

const compare = (password, hash) => {
  const valueEncrypted = encrypt(password)
  return hash === valueEncrypted
}

module.exports = {
  encrypt,
  decrypt,
  compare,
}
