export class MissingEntityFieldError extends Error {
    constructor(fieldName: string, entityName: string) {
        super(`${fieldName} is missing and required to create ${entityName}`);
    }
}
