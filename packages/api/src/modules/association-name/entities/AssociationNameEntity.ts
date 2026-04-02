import { Adresse } from "dto";
import Rna from "../../../identifier-objects/Rna";
import Siren from "../../../identifier-objects/Siren";

export default class AssociationNameEntity {
    constructor(
        public name: string,
        public siren: Siren,
        public rna?: Rna,
        public address?: Adresse,
        public nbEtabs?: number,
    ) {}
}
