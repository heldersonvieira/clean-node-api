const { MissingParamError } = require('../../utils/errors');

class AuthUseCase {
  constructor(loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth({ email, password }) {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')

    return await this.loadUserByEmailRepository.load(email)
  }
}


describe('Auth UseCase', () => {
  test('should return null if no email is provided', async () => {
    const sut = new AuthUseCase()
    const attributes = {
      password: 'fake_password',
    }
    const promise = sut.auth(attributes)
    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should return null if no passsword is provided', async () => {
    const sut = new AuthUseCase()
    const attributes = {
      email: 'fake@email.com',
    }
    const promise = sut.auth(attributes)
    await expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('should call LoadUserByEmailRepository with coorect email', async () => {
    class LoadUserByEmailRepositorySpy {
      load(email) {
        this.email = email
      }
    }
    const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy()
    const sut = new AuthUseCase(loadUserByEmailRepository)
    const attributes = {
      email: 'fake@email.com',
      password: 'fake',
    }
    await sut.auth(attributes)
    expect(loadUserByEmailRepository.email).toBe(attributes.email)
  })
})