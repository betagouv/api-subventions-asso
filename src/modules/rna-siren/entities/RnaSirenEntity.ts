import { Rna } from "../../../@types/Rna";
import { Siren } from "../../../@types/Siren";

export default class RnaSiren {
    constructor(
        public rna: Rna,
        public siren: Siren,
    ) {}
}