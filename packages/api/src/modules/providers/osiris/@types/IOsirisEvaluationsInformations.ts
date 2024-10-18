import { SiretDto } from "dto";

export default interface IOsirisEvaluationsInformations {
    osirisActionId: string;
    siret: SiretDto;
    evaluation_resultat: string;
    extractYear: number;
    cout_total_realise?: number;
}
