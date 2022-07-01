const { compare, encrypt, decrypt } = require('../utils/crypto')
const { MissingParamError } = require('../errors')

module.exports = class Encrypter {
  async compare(value, hash) {
    if (!value || !hash) throw new MissingParamError('value')
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
