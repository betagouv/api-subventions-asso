import { Rna, Siren } from "dto";

export default class AssociationNameEntity {
    constructor(
        public name: string,
        public siren: Siren,
        public rna?: Rna,
        public address?: {
            numero?: string;
            type_voie?: string;
            voie?: string;
            code_postal?: string;
            commune?: string;
        },
    ) {}
}
