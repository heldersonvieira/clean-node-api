const { MissingParamError } = require('../../shared/errors')
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

  test('should open connection if connection was closed and return user', async () => {
    const { sut, userModel } = await makeSut()
    await userModel.insertOne({
      email: 'any@email.com',
      name: 'any_name',
      age: 35,
      state: 'any_state',
      password: 'hashed_passowrd',
    })
    const createdUser = await userModel.findOne({ email: 'any@email.com' })

    const user = await sut.load('any@email.com')
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

  test('should throw if no email if provided', async () => {
    const { sut } = await makeSut()
    const noEmail = sut.load()
    await expect(noEmail).rejects.toThrow(new MissingParamError('email'))
  })
})
