const makeSut = () => {
  class TokenGenerator {
    async generate(id) {
      return null
    }
  }

  const tokenGenerator = new TokenGenerator()
  return tokenGenerator
}

describe('TokenGenerator', () => {
  test('should return null if JWT returns null', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })
})
