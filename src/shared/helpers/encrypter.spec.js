const crypto = require('../utils/crypto')

const makeSut = () => {
  class Encrypter {
    async compare(value, hash) {
      const isValid = await crypto.compare(value, hash)
      return isValid
    }
  
    async encrypt(value) {
      return await crypto.encrypt(value)
    }
  
    async decrypt(value) {
      return await crypto.decrypt(value)
    }
  }
  return new Encrypter()
}

describe('Encrypter', () => {
  let value
  let hash

  beforeAll(async () => {
    value = 'any_value'
    hash = await crypto.encrypt(value)
  })

  test('should return true if crypto returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.compare(value, hash)
    expect(isValid).toBe(true)
  })

  test('should return false if crypto returns false', async () => {
    const sut = makeSut()
    const isValid = await sut.compare(value, 'hash')
    expect(isValid).toBe(false)
  })

  test('should return a hash', async () => {
    const sut = makeSut()
    const hashedValue = await sut.encrypt(value)
    expect(hashedValue).toEqual(hash)
  })

  test('should returns value decrypted iquals input value', async () => {
    const sut = makeSut()
    const decryptedValue = await sut.decrypt(hash)
    expect(decryptedValue).toEqual(value)
  })
})
