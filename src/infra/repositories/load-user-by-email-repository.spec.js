const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')

describe('LoadUserByEmailRepository', () => {
  let makeSut
  let client
  let database

  beforeAll(async () => {
    client = await MongoHelper.connect(process.env.MONGO_URL)
    database = await MongoHelper.getDatabase()

    makeSut = async () => {
      const userModel = await database.collection('users')
      const sut = new LoadUserByEmailRepository(userModel)
      return {
        sut,
        userModel,
      }
    }
  })

  beforeEach(async () => {
    await database.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return null if no user is found', async () => {
    const { sut } = await makeSut()
    const user = await sut.load('invalid@email.com')
    expect(user).toBeNull()
  })

  test('should return an user if user is found', async () => {
    const { sut, userModel } = await makeSut()
    await userModel.insertOne({
      email: 'valid@email.com',
      name: 'any_name',
      age: 35,
      state: 'any_state',
      password: 'hashed_passowrd',
    })
    const createdUser = await userModel.findOne({ email: 'valid@email.com' })

    const user = await sut.load('valid@email.com')
    expect(user).toEqual({
      _id: createdUser._id,
      password: createdUser.password,
    })
  })

  test('should throw if no userModel if provided', async () => {
    const sut = new LoadUserByEmailRepository()
    const noUserModel = sut.load('valid@email.com')
    await expect(noUserModel).rejects.toThrow()
  })
})
