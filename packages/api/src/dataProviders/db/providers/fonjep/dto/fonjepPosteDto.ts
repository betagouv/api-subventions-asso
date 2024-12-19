export default interface FonjepPosteDto {
    [key: string]: any;
    // dates are excel dates (i.e. days since 1900-01-01)
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
