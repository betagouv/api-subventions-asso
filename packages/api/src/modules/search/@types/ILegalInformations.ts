import { RnaDto, SiretDto } from "dto";

export default interface ILegalInformations {
    siret: SiretDto;
    rna?: RnaDto;
    name: string;
}
