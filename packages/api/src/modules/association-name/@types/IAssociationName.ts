import { Rna, Siren } from "dto";

export default interface IAssociationName {
    rna: Rna;
    siren: Siren;
    name: string;
    provider: string;
    lastUpdate: Date;
}
