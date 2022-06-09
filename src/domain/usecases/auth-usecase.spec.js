const { MissingParamError, InvalidParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor(loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth({ email, password }) {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')
    if (!this.loadUserByEmailRepository)
      throw new MissingParamError('loadUserByEmailRepository')
    if (!this.loadUserByEmailRepository.load)
      throw new InvalidParamError('load')

    return await this.loadUserByEmailRepository.load(email)
  }
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  class AuthUseCase {
    constructor(loadUserByEmailRepository) {
      this.loadUserByEmailRepository = loadUserByEmailRepository
    }

    async auth({ email, password }) {
      if (!email) throw new MissingParamError('email')
      if (!password) throw new MissingParamError('password')
      if (!this.loadUserByEmailRepository)
        throw new MissingParamError('loadUserByEmailRepository')
      if (!this.loadUserByEmailRepository.load)
        throw new InvalidParamError('load')

      const user = await this.loadUserByEmailRepository.load(email)
      return user || null
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
    async load(email) {
      this.email = email
    }
  }
  return new LoadUserByEmailRepositorySpy()
}

describe('Auth UseCase', () => {
  test('should return throw if no email is provided', async () => {
    const { sut } = makeSut()
    const attributes = {
      password: 'fake_password',
    }
    const promise = sut.auth(attributes)
    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should return throw if no passsword is provided', async () => {
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

  test('should throw if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase()
    const attributes = {
      email: 'fake@email.com',
      password: 'fake',
    }
    const promise = sut.auth(attributes)
    await expect(promise).rejects.toThrow(
      new MissingParamError('loadUserByEmailRepository')
    )
  })

  test('should throw if no LoadUserByEmailRepository has no load method', async () => {
    class LoadUserByEmailRepositorySpy {}
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
    const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
    const attributes = {
      email: 'fake@email.com',
      password: 'fake',
    }
    const promise = sut.auth(attributes)
    await expect(promise).rejects.toThrow(new InvalidParamError('load'))
  })

  test('should return null if LoadUserByEmailRepository return null', async () => {
    const { sut } = makeSut()
    const attributes = {
      email: 'invalid@email.com',
      password: 'any',
    }
    const accessToken = await sut.auth(attributes)
    expect(accessToken).toBeNull()
  })
})
