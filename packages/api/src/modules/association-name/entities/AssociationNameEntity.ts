import { Rna, Siren } from "@api-subventions-asso/dto";

export default class AssociationNameEntity {
    constructor(
        public rna: Rna,
        public name: string,
        public provider: string,
        public lastUpdate: Date,
        public siren: Siren | null = null
    ) {}
}