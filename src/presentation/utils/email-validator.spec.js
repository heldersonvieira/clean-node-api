const EmailValidator = require('./email-validator');

describe('Email Validator', () => {
  test('should return true if email is valid', () => {
    const sut = new EmailValidator()
    const isValidEmail = sut.isValid('valid_email@email.com')
    expect(isValidEmail).toBe(true)
  })

  test('should return false if email is invalid', () => {
    const sut = new EmailValidator()
    const isValidEmail = sut.isValid('invalid_email.com')
    expect(isValidEmail).toBe(false)
  })
})