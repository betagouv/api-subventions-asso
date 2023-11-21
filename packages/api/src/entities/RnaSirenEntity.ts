import { Rna, Siren } from "dto";

export default class RnaSirenEntity {
    constructor(
        public rna: Rna,
        public siren: Siren,
        public id ?: string,
    ) {}
}