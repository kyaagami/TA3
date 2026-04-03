

export class FlagNotExistError extends Error {
    constructor() {
        super('Flag Not Exist ');
        this.name = 'FlagNotExistError'
      }
}