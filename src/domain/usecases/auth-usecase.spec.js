const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase');

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy)
  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy
  }
}

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    password: 'hashed_password'
  }
  return loadUserByEmailRepositorySpy
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

  test('should return throw if no password is provided', async () => {
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
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const attributes = {
      email: 'valid@email.com',
      password: 'invalid',
    }
    const accessToken = await sut.auth(attributes)
    expect(accessToken).toBeNull()
  })

  test('should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    const attributes = {
      email: 'valid@email.com',
      password: 'any',
    }
    await sut.auth(attributes)
    expect(encrypterSpy.password).toBe('any')
    expect(encrypterSpy.hashedPassword)
      .toBe(
        loadUserByEmailRepositorySpy.user.password
      )
  })
})
