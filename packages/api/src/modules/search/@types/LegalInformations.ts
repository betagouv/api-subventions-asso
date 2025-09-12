import { RnaDto, SiretDto } from "dto";

export default interface LegalInformations {
    siret: SiretDto;
    rna?: RnaDto;
    name: string;
}
