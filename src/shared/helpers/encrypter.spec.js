const { encrypt } = require('../utils/crypto')
const { MissingParamError } = require('../errors/index');
const Encrypter = require('./encrypter');

const makeSut = () => {
  return new Encrypter()
}

describe('Encrypter', () => {
  let value
  let hash

  beforeAll(async () => {
    value = 'any_value'
    hash = await encrypt(value)
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

  test('should throw if no params are provided', async () => {
    const sut = makeSut()
    const promise = sut.compare()
    await expect(promise).rejects.toThrow(new MissingParamError('value'))
  })
})
