import { Rna, Siren } from "@api-subventions-asso/dto";

export default class RnaSiren {
    constructor(public rna: Rna, public siren: Siren, public names?: string[]) {}
}
