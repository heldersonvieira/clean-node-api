const { MongoClient } = require('mongodb')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')

describe('LoadUserByEmailRepository', () => {
  let makeSut
  let client
  let db

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    db = await client.db()

    makeSut = async () => {
      const userModel = await db.collection('users')
      const sut = new LoadUserByEmailRepository(userModel)
      return {
        sut,
        userModel,
      }
    }
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await client.close()
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
})
