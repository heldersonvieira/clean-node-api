const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase');

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  loadUserByEmailRepositorySpy.user = {}
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
      return this.user
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
    await expect(promise).rejects.toThrow()
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
    await expect(promise).rejects.toThrow()
  })

  test('should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const attributes = {
      email: 'invalid@email.com',
      password: 'any',
    }
    const accessToken = await sut.auth(attributes)
    expect(accessToken).toBeNull()
  })

  test('should return null if an invalid password is provided', async () => {
    const { sut } = makeSut()
    const attributes = {
      email: 'valid@email.com',
      password: 'invalid',
    }
    const accessToken = await sut.auth(attributes)
    expect(accessToken).toBeNull()
  })
})
