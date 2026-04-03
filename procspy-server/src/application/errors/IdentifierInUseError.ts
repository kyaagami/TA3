

export class IdentifierInUseError extends Error {
    constructor() {
        super('Identifier In Use ');
        this.name = 'IdentifierInUseError'
      }
}