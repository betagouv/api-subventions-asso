import Rna from "../identifier-objects/Rna";
import Siren from "../identifier-objects/Siren";

export default class RnaSirenEntity {
    constructor(
        public rna: Rna,
        public siren: Siren,
        public id?: string,
    ) {}
}
