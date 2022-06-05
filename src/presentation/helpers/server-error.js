module.exports = class serverError extends Error {
  constructor(paramName) {
    super('Internal error')
    this.name = 'ServerError'
  }
}