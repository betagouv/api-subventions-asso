import { Siret } from "dto";

export default interface IApiEntrepriseHeadcount {
    siret: Siret;
    annee: string;
    mois: string;
    effectifs_mensuels: string;
}
