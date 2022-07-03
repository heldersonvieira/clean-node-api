const { MongoClient } = require('mongodb')

class LoadUserByEmailRepository {
  constructor(userModel) {
    this.userModel = userModel
  }

  async load(email) {
    const user = await this.userModel.findOne({ email })
    return user
  }
}

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

    makeSut = () => {
      const userModel = db.collection('users')
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
    const { sut } = makeSut()
    const user = await sut.load('invalid@email.com')
    expect(user).toBeNull()
  })

  test('should return an user if user is found', async () => {
    const { sut, userModel } = makeSut()
    await userModel.insertOne({
      email: 'valid@email.com',
    })
    const user = await sut.load('valid@email.com')
    expect(user.email).toBe('valid@email.com')
  })
})
