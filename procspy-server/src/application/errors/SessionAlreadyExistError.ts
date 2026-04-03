

export class SessionAlreadyExistError extends Error {
    constructor() {
        super('Session Already Exist ');
        this.name = 'SessionAlreadyExistError'
      }
}