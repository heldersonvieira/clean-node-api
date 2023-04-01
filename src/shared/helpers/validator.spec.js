const { MissingParamError } = require('../errors');
const Validator = require('./validator');

const makeSut = () => {
  return new Validator()
}

describe('Email Validator', () => {
  test('should return true if email is valid', () => {
    const sut = makeSut()
    const isValidEmail = sut.isEmail('valid_email@email.com')
    expect(isValidEmail).toBe(true)
  })

  test('should return false if email is invalid', () => {
    const sut = makeSut()
    const isValidEmail = sut.isEmail('invalid_email.com')
    expect(isValidEmail).toBe(false)
  })

  test('should throw if no email is provided', async () => {
    const sut = makeSut()
    expect(sut.isEmail).toThrow(new MissingParamError('email'))
  })
})