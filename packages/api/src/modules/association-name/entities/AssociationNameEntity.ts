import { Rna, Siren } from "dto";

export default class AssociationNameEntity {
    constructor(
        public name: string,
        public siren: Siren,
        public rna?: Rna,
    ) {}
}
