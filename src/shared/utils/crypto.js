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

const encrypt = async (value) => {
  return new Promise((resolve, reject) => {
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    let encrypted =
      cipher.update(value, 'utf-8', 'base64') + cipher.final('base64')
  
    resolve(Buffer.from(encrypted).toString('base64'))
  })
}

const decrypt = async (value) => {
  return new Promise((resolve, reject) => {
    const chunks = Buffer.from(value, 'base64')
    value = chunks.toString('utf-8')
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  
    resolve(decipher.update(value, 'base64', 'utf-8') + decipher.final('utf-8'))
  })
}

const compare = async (value, hash) => {
  const valueEncrypted = await encrypt(value)
  return hash === valueEncrypted
}

module.exports = {
  encrypt,
  decrypt,
  compare,
}
