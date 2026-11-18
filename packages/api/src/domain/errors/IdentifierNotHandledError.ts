import { AnyIdentifierIdType } from "../../identifier-objects/@types/IdentifierType";
import { capitalizeFirstLetter } from "../../shared/helpers/StringHelper";

export class IdentifierNotHandledError extends Error {
    constructor(public type: AnyIdentifierIdType) {
        super(`${capitalizeFirstLetter(type.name)} identifier is not supported yet`);
    }
}
