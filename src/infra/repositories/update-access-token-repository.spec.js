const MongoHelper = require('../helpers/mongo-helper')

class UpdateAccessTokenRepository {
  constructor(userModel) {
    if (!userModel) throw new Error()
    this.userModel = userModel
  }
  async update(userId, accessToken) {
    await this.userModel.updateOne({ _id: userId }, { $set: { accessToken } })
  }
}

describe('UpdateAccessTokenRepository', () => {
  let makeSut
  let client
  let database

  beforeAll(async () => {
    client = await MongoHelper.connect(process.env.MONGO_URL)
    database = await MongoHelper.getDatabase()
    makeSut = async () => {
      const userModel = await database.collection('users')
      const sut = new UpdateAccessTokenRepository(userModel)
      return { sut, userModel }
    }
  })

  beforeEach(async () => {
    await database.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should update the user with the given accessToken', async () => {
    const { sut, userModel } = await makeSut()
    const user = await userModel.insertOne({
      email: 'any@email.com',
      name: 'any_name',
      age: 35,
      state: 'any_state',
      password: 'hashed_passowrd',
    })
    await sut.update(user.insertedId, 'valid_token')
    const updatedUser = await userModel.findOne({ _id: user.insertedId })
    expect(updatedUser.accessToken).toBe('valid_token')
  })

  test('should throw if no userModel is provided', () => {
    expect(() => new UpdateAccessTokenRepository()).toThrow()
  })
})
