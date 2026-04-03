

export class SessionLockedError extends Error {
    constructor() {
        super('Session Locked ');
        this.name = 'SessionLockedError'
      }
}