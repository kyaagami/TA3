

export class UserNotExistError extends Error {
    constructor() {
        super('User Not Exist ');
        this.name = 'UserNotExistError'
      }
}