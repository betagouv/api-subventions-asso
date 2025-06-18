import Rna from "../identifierObjects/Rna";
import Siren from "../identifierObjects/Siren";

export default class RnaSirenEntity {
    constructor(
        public rna: Rna,
        public siren: Siren,
        public id?: string,
    ) {}
}
