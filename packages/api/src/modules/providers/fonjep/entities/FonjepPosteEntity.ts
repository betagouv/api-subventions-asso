import { ProviderDataEntity } from "../../../../@types/ProviderDataEntity";

interface FonjepPosteEntity extends ProviderDataEntity {
    // code to join with fonjepVersement collection and get information about the payment
    code: string;
    // code to join with fonjepTier collection and get information about the recipient association
    associationBeneficiaireCode: string | null;
    // One of the three years of the triennality
    annee: number | null;
    // every fonjep grant is triennial (given 3 years in a row)
    dateFinTriennalite: Date | null;
    // code to join with fonjepTier collection and get information about the financer
    financeurAttributeurCode: string | null;
    // code that determine program code (a.k.a bop)
    financeurPrincipalCode: string | null;
    dispositifId: number | null;
    pstStatutPosteLibelle: string | null;
    pstRaisonStatutLibelle: string | null;
    associationImplantationCode: string | null;
    montantSubvention: number | null;
    pstTypePosteCode: string | null;
    pleinTemps: string | null;
    doublementUniteCompte: string | null;
}

export default FonjepPosteEntity;
