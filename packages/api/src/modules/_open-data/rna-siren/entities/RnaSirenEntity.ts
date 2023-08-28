import { Rna, Siren } from "dto";

export default class RnaSiren {
    constructor(public rna: Rna, public siren: Siren, public names?: string[]) {}
}
