import { Rna, Siret } from "@api-subventions-asso/dto";

export default interface ILegalInformations {
    siret: Siret;
    rna?: Rna;
    name: string;
}