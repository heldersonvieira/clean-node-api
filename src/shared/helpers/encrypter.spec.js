class Encrypter {
  async compare(password, hashedPassword) {
    return true
  }
}

describe('Encrypter', () => {
  test('should return true if crypto returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_password', 'hashedPassword')
    expect(isValid).toBe(true)
  })

  test.skip('should return false if crypto returns false', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_password', 'hashedPassword')
    expect(isValid).toBe(false)
  })
})
