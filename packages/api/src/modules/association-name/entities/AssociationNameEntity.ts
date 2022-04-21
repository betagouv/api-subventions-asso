import { Rna, Siren } from "../../../@types";

export default class AssociationNameEntity {
    constructor(
        public rna: Rna,
        public siren: Siren,
        public name: string,
        // TODO: ProviderEnum ?
        public provider: string,
        public lastUpdate: Date
    ) {}
}