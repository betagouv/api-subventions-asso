import { RnaDto } from "dto";

export class RnaOnlyError extends Error {
    constructor(rna: RnaDto) {
        super(`We could not find any SIREN for the given RNA : ${rna}`);
    }
}
