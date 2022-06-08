const { MissingParamError } = require('../../utils/errors');

class AuthUseCase {
  async auth({ email, password }) {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')
  }
}

describe('Auth UseCase', () => {
  test('should return null if no email is provided', async () => {
    const sut = new AuthUseCase()
    const attributes = {
      password: 'fake_password',
    }
    const promise = sut.auth(attributes)
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should return null if no passsword is provided', async () => {
    const sut = new AuthUseCase()
    const attributes = {
      email: 'fake@email.com',
    }
    const promise = sut.auth(attributes)
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})