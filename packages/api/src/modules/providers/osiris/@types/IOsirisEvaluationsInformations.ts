import { SiretDto } from "dto";

export default interface IOsirisEvaluationsInformations {
    osirisActionId: string;
    siret: SiretDto;
    evaluation_resultat: string;
    exercise: number;
    cout_total_realise?: number;
}
