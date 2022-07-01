const { compare, encrypt, decrypt } = require('../utils/crypto')

module.exports = class Encrypter {
  async compare(value, hash) {
    const isValid = await compare(value, hash)
    return isValid
  }

  async encrypt(value) {
    return await encrypt(value)
  }

  async decrypt(value) {
    return await decrypt(value)
  }
}
