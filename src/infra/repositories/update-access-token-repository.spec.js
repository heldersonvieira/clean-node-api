const { MissingParamError } = require('../../shared/errors')
const MongoHelper = require('../helpers/mongo-helper')
const UpdateAccessTokenRepository = require('./update-access-token-token-repository')

describe('UpdateAccessTokenRepository', () => {
  let client
  let database
  let makeSut
  let fakeUser

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
    const userModel = await database.collection('users')
    await userModel.deleteMany()
    fakeUser = await userModel.insertOne({
      email: 'any@email.com',
      name: 'any_name',
      age: 35,
      state: 'any_state',
      password: 'hashed_passowrd',
    })
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should update the user with the given accessToken', async () => {
    const { sut, userModel } = await makeSut()
    const { insertedId: _id } = fakeUser
    await sut.update(_id, 'valid_token')
    const updatedUser = await userModel.findOne({ _id })
    expect(updatedUser.accessToken).toBe('valid_token')
  })

  test('should throw if no userModel is provided', () => {
    expect(() => new UpdateAccessTokenRepository()).toThrow()
  })

  test('should throw if no params is provided', async () => {
    const { sut } = await makeSut()
    const { insertedId: _id } = fakeUser
    await expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    await expect(sut.update(_id)).rejects.toThrow(
      new MissingParamError('accessToken')
    )
  })
})
