

export class GlobalSettingAlreadyExistError extends Error {
    constructor() {
        super('Global Setting Already Exist ');
        this.name = 'GlobalSettingAlreadyExistError'
      }
}