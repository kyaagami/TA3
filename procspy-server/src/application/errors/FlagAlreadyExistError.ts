

export class FlagAlreadyExistError extends Error {
    constructor() {
        super('Flag Already Exist ');
        this.name = 'FlagAlreadyExistError'
      }
}