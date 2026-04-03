

export class GlobalSettingNotExistError extends Error {
    constructor() {
        super('Global Setting Not Exist ');
        this.name = 'GlobalSettingNotExistError'
      }
}