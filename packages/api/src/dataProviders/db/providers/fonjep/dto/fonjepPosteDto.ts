// null represents an empty cell in the file

export default interface FonjepPosteDto {
    Code: string;
    Annee: number;
    DateFinTriennalite: number; // dates in excel dates (i.e. days since 1900-01-01)
    FinanceurPrincipalCode: string;
    FinanceurAttributeurCode: string;
    AssociationBeneficiaireCode: string;
    DispositifId: number | null;
    PstStatutPosteLibelle: string | null;
    PstRaisonStatutLibelle: string | null;
    AssociationImplantationCode: string | null;
    MontantSubvention: number | null;
    PstTypePosteCode: string | null;
    PleinTemps: string | null;
    DoublementUniteCompte: string | null;
}

export interface FonjepPosteDtoWithJSDate extends Omit<FonjepPosteDto, "DateFinTriennalite"> {
    DateFinTriennalite: Date;
}
