import { Rna, Siren } from "@api-subventions-asso/dto";

export default interface IAssociationName {
    rna: Rna;
    siren: Siren;
    name: string;
    provider: string;
    lastUpdate: Date;
}
