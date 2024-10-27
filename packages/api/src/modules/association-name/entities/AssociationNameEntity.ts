import { Adresse } from "dto";
import Rna from "../../../valueObjects/Rna";
import Siren from "../../../valueObjects/Siren";

export default class AssociationNameEntity {
    constructor(
        public name: string,
        public siren: Siren,
        public rna?: Rna,
        public address?: Adresse,
        public nbEtabs?: number,
    ) {}
}
