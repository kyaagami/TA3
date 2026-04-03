

export class SessionEndedError extends Error {
    constructor(custom: string) {
        super('Session Ended due ' + custom);
        this.name = 'SessionEndedError'
      }
}