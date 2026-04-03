export class InvalidAuthTokenError extends Error {
  constructor(message:string = "") {
    super('Invalid authentication token ' + message)
    this.name = 'InvalidAuthTokenError'
  }
}