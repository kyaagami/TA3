

export class LogNotUpdatedError extends Error {
    constructor() {
        super('Log Not Updated due same value');
        this.name = 'LogNotUpdatedError'
      }
}