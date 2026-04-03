

export class LogNotExistError extends Error {
    constructor() {
        super('Log Not Exist ');
        this.name = 'LogNotExistError'
      }
}