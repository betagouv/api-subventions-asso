import { Rna } from "../../../@types/Rna";
import { Siret } from "../../../@types/Siret";

export default interface ILegalInformations {
    siret: Siret;
    rna: Rna;
    name: string;
}