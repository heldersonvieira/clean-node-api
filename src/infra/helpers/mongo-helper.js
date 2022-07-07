const { MongoClient } = require('mongodb')

module.exports = {
  async connect(uri, databaseName = '') {
    this.uri = uri
    this.databaseName = databaseName

    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    this.database = await this.client.db(databaseName)
    return this.client
  },

  async getDatabase() {
    return this.database
  },

  async disconnect() {
    await this.client.close()
  },
}
