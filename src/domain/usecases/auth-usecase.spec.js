const { MissingParamError } = require('../../utils/errors')

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
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
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
  return {
    sut,
    loadUserByEmailRepositorySpy,
  }
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    load(email) {
      this.email = email
    }
  }
  return new LoadUserByEmailRepositorySpy()
}

describe('Auth UseCase', () => {
  test('should return null if no email is provided', async () => {
    const { sut } = makeSut()
    const attributes = {
      password: 'fake_password',
    }
    const promise = sut.auth(attributes)
    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should return null if no passsword is provided', async () => {
    const { sut } = makeSut()
    const attributes = {
      email: 'fake@email.com',
    }
    const promise = sut.auth(attributes)
    await expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('should call LoadUserByEmailRepository with coorect email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const attributes = {
      email: 'fake@email.com',
      password: 'fake',
    }
    await sut.auth(attributes)
    expect(loadUserByEmailRepositorySpy.email).toBe(attributes.email)
  })
})
