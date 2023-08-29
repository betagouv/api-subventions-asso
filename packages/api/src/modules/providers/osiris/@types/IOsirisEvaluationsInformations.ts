import { Siret } from "dto";

export default interface IOsirisEvaluationsInformations {
    osirisActionId: string;
    siret: Siret;
    evaluation_resultat: string;
    extractYear: number;
    cout_total_realise?: number;
}
