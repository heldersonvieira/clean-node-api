class LoadUserByEmailRepository {
  async load(email) {
    return null
  }
}

describe('LoadUserByEmailRepository', () => {
  test('should return null if no user is found', async () => {
    const sut = new LoadUserByEmailRepository()
    const user = await sut.load('invalid@email.com')
    expect(user).toBeNull()
  })
})