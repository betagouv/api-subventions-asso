import { Rna } from "dto";

export class RnaOnlyError extends Error {
    constructor(rna: Rna) {
        super(`We could not found any SIREN for the given RNA : ${rna}`);
    }
}
