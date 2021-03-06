const jwt = require('jsonwebtoken')
const { MissingParamError } = require('../errors')

class TokenGenerator {
  constructor(secret) {
    this.secret = secret
  }

  async generate(id) {
    if (!this.secret) throw new MissingParamError('secret')
    if (!id) throw new MissingParamError('id')
    return jwt.sign(id, this.secret)
  }
}

const makeSut = () => {
  const tokenGenerator = new TokenGenerator('secret')
  return tokenGenerator
}

describe('TokenGenerator', () => {
  test('should return null if JWT returns null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })

  test('should return token if JWT returns token', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })

  test('should call JWT with correct values', async () => {
    const sut = makeSut()
    await sut.generate('any_id')
    expect(jwt.id).toBe('any_id')
    expect(jwt.secret).toBe(sut.secret)
  })

  test('should throw if no secret is provided', async () => {
    const sut = new TokenGenerator()
    const noSecret = sut.generate('any_id')
    await expect(noSecret).rejects.toThrow(new MissingParamError('secret'))
  })

  test('should throw if no id is provided', async () => {
    const sut = makeSut()
    const noId = sut.generate()
    await expect(noId).rejects.toThrow(new MissingParamError('id'))
  })
})
