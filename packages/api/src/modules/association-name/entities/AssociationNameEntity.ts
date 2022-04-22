import { Rna, Siren } from "../../../@types";

export default class AssociationNameEntity {
    constructor(
        public rna: Rna,
        public siren: Siren,
        public name: string,
        public provider: string,
        public lastUpdate: Date
    ) {}
}