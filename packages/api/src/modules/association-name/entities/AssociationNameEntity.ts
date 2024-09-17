import { Adresse, Rna, Siren } from "dto";

export default class AssociationNameEntity {
    constructor(
        public name: string,
        public siren: Siren,
        public rna?: Rna,
        public categorie_juridique?: string,
        public address?: Adresse,
        public nbEtabs?: number,
    ) {}
}
