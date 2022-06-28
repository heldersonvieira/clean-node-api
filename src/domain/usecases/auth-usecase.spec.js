const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  const tokenGeneratorSpy = makeTokenGenerator()
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
  })
  return {
    sut,
    loadUserByEmailRepositorySpy,
    updateAccessTokenRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
  }
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate(userId) {
      this.userId = userId
      return this.accessToken
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'any_token'
  return tokenGeneratorSpy
}

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate(userId) {
      throw new Error()
    }
  }
  return new TokenGeneratorSpy()
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

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare() {
      throw new Error()
    }
  }
  return new EncrypterSpy()
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
    id: 'any_id',
    password: 'hashed_password',
  }
  return loadUserByEmailRepositorySpy
}

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load() {
      throw new Error()
    }
  }
  return new LoadUserByEmailRepositorySpy()
}

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepositorySpy {
    async update({ userId, accessToken }) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
  return updateAccessTokenRepositorySpy
}

const makeUpdateAccessTokenRepositoryWithError = () => {
  class UpdateAccessTokenRepositorySpy {
    async update() {
      throw new Error()
    }
  }

  return new UpdateAccessTokenRepositorySpy()
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
    expect(encrypterSpy.hashedPassword).toBe(
      loadUserByEmailRepositorySpy.user.password
    )
  })

  test('should call TokenGenerator with userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    const attributes = {
      email: 'valid@email.com',
      password: 'any',
    }
    await sut.auth(attributes)
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  test('should return an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const attributes = {
      email: 'valid@email.com',
      password: 'any',
    }
    const acessToken = await sut.auth(attributes)
    await expect(acessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(acessToken).toBeTruthy()
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      loadUserByEmailRepositorySpy,
      tokenGeneratorSpy,
      updateAccessTokenRepositorySpy,
    } = makeSut()
    const attributes = {
      email: 'valid@email.com',
      password: 'any',
    }
    await sut.auth(attributes)
    expect(updateAccessTokenRepositorySpy.userId).toBe(
      loadUserByEmailRepositorySpy.user.id
    )
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(
      tokenGeneratorSpy.accessToken
    )
  })

  test('should throw if invalid dependencies is provided', async () => {
    const invalid = {}
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()

    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({
        loadUserByEmailRepository: null,
        encrypter: null,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository: invalid,
        encrypter: null,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: null,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: invalid,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: invalid,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: invalid,
      })
    )

    const attributes = {
      email: 'valid@email.com',
      password: 'any',
    }

    for (sut of suts) {
      const promise = sut.auth(attributes)
      await expect(promise).rejects.toThrow()
    }
  })

  test('should throw if any invalid dependency throw', async () => {
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()

    const suts = [].concat(
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError(),
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: makeEncrypterWithError(),
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError(),
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError(),
      })
    )

    const attributes = {
      email: 'valid@email.com',
      password: 'any',
    }

    for (sut of suts) {
      const promise = sut.auth(attributes)
      await expect(promise).rejects.toThrow()
    }
  })
})
