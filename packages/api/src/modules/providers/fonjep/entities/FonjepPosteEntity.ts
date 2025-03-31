type FonjepPosteEntity = {
    // code to join with fonjepVersement collection and get information about the payment
    code: string;
    // code to join with fonjepTier collection and get information about the recipient association
    associationBeneficiaireCode: string;
    // One of the three years of the triennality
    annee: number;
    // every fonjep grant is triennial (given 3 years in a row)
    dateFinTriennalite: Date;
    // code to join with fonjepTier collection and get information about the financer
    financeurAttributeurCode: string;
    // code that determine program code (a.k.a bop)
    financeurPrincipalCode: string;
    dispositifId: number | null;
    pstStatutPosteLibelle: string | null;
    pstRaisonStatutLibelle: string | null;
    associationImplantationCode: string | null;
    montantSubvention: number | null;
    pstTypePosteCode: string | null;
    pleinTemps: string | null;
    doublementUniteCompte: string | null;
};

export default FonjepPosteEntity;
