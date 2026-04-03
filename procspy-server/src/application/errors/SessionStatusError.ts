

export class SessionStatusError extends Error {
    constructor() {
        super('Hi, cant abort or complete session that not started yet and cancel session that already started');
        this.name = 'SessionStatusError'
      }
}