import { ObjectId } from "mongodb";
// dates are reported as Excel dates
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
    DateFinTriennalite: number | null;
    PstTypePosteCode: string | null;
    PleinTemps: string | null;
    DoublementUniteCompte: string | null;
}
