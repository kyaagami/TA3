

export class RoomAlreadyExistError extends Error {
    constructor() {
        super('Room Already Exist ');
        this.name = 'RoomAlreadyExistError'
      }
}