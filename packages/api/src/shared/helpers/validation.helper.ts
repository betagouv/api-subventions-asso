import { BadRequestError } from "core";

export type ValidationResult = { valid: false; error: Error } | { valid: true };
export type ValidationCriteria<T> = {
    value: T;

    method: (value: T) => boolean;
    error: Error;
};

export type ValidationCriterias = ValidationCriteria<unknown | unknown[]>[];

export function applyValidations(validations: ValidationCriterias): ValidationResult {
    let error: Error | undefined;
    for (const validation of validations) {
        if (!validation.method(validation.value)) {
            error = validation.error;
            break;
        }
    }
    return error ? { valid: false, error: error as BadRequestError } : { valid: true };
}
