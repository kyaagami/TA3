

export class ProctoredUserNotExistError extends Error {
    constructor() {
        super('ProctoredUser Not Exist ');
        this.name = 'ProctoredUserNotExistError'
      }
}