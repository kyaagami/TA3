

export class RoomNotExistError extends Error {
    constructor() {
        super('Room Not Exist ');
        this.name = 'RoomNotExistError'
      }
}