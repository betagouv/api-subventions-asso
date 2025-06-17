import { Adresse } from "dto";
import Rna from "../../../identifierObjects/Rna";
import Siren from "../../../identifierObjects/Siren";

export default class AssociationNameEntity {
    constructor(
        public name: string,
        public siren: Siren,
        public rna?: Rna,
        public address?: Adresse,
        public nbEtabs?: number,
    ) {}
}
