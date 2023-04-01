const { MissingParamError } = require("../../shared/errors")

module.exports = class UpdateAccessTokenRepository {
  constructor(userModel) {
    if (!userModel) throw new Error()
    this.userModel = userModel
  }
  async update(userId, accessToken) {
    if (!userId) throw new MissingParamError('userId')
    if (!accessToken) throw new MissingParamError('accessToken')
    await this.userModel.updateOne({ _id: userId }, { $set: { accessToken } })
  }
}
