import { BadRequestError } from "./httpErrors";

export class StructureIdentifiersError extends BadRequestError {
    constructor(type: string | undefined = undefined) {
        if (type) super(`Invalid ${type.toUpperCase()}`);
        else super("Invalid structure identifier (rna, siren or siret)");
    }
}
