const MongoHelper = require("./mongo-helper")

describe('MongoHelper', () => {
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should reconnect when getDatabase method is calls and client is disconnected', async () => {
    const sut = await MongoHelper.connect(process.env.MONGO_URL)
    await MongoHelper.getDatabase()
    expect(MongoHelper.database).toBeTruthy()
    await MongoHelper.disconnect()
    expect(sut.s.hasBeenClosed).toBeTruthy()
    await MongoHelper.getDatabase()
    expect(MongoHelper.database).toBeTruthy()
  })
})