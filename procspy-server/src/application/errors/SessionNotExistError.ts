

export class SessionNotExistError extends Error {
    constructor() {
        super('Session Not Exist ');
        this.name = 'SessionNotExistError'
      }
}