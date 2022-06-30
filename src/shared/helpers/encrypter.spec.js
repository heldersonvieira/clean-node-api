const crypto = require('../utils/crypto')

class Encrypter {
  async compare(value, hash) {
    const isValid = await crypto.compare(value, hash)
    return isValid
  }
}

describe('Encrypter', () => {
  let password
  let hashedPassword

  beforeAll(async () => {
    password = 'any_password'
    hashedPassword = await crypto.encrypt(password)
  })

  test('should return true if crypto returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare(password, hashedPassword)
    expect(isValid).toBe(true)
  })

  test('should return false if crypto returns false', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare(password, 'hashedPassword')
    expect(isValid).toBe(false)
  })
})
