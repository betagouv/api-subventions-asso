import { ObjectId } from "mongodb";

export default interface FonjepPosteDbo {
    _id: ObjectId;
    Code: string | null;
    DispositifId: number | null;
    PstStatutPosteLibelle: string | null;
    PstRaisonStatutLibelle: string | null;
    FinanceurPrincipalCode: string | null;
    FinanceurAttributeurCode: string | null;
    AssociationBeneficiaireCode: string | null;
    AssociationImplantationCode: string | null;
    Annee: number | null;
    MontantSubvention: number | null;
    DateFinTriennalite: Date | null;
    PstTypePosteCode: string | null;
    PleinTemps: string | null;
    DoublementUniteCompte: string | null;
}
