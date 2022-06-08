const Validator = require('./validator');

const sut = () => {
  return new Validator()
}

describe('Email Validator', () => {
  test('should return true if email is valid', () => {
    const isValidEmail = sut().isEmail('valid_email@email.com')
    expect(isValidEmail).toBe(true)
  })

  test('should return false if email is invalid', () => {
    const isValidEmail = sut().isEmail('invalid_email.com')
    expect(isValidEmail).toBe(false)
  })
})