import { Rna, Siret } from "dto";

export default interface ILegalInformations {
    siret: Siret;
    rna?: Rna;
    name: string;
}
