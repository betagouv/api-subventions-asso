import { Rna, Siren } from "dto";

export default class AssociationNameEntity {
    constructor(
        public rna: Rna | null,
        public name: string,
        public provider: string,
        public lastUpdate: Date,
        public siren: Siren | null = null,
    ) {}
}
