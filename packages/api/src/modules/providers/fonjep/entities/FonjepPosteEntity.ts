export default class FonjepPosteEntity {
    constructor(
        public Code: string,
        public DispositifId: number,
        public PstStatutPosteLibelle: string,
        public PstRaisonStatutLibelle: string,
        public FinanceurPrincipalCode: string,
        public FinanceurAttributeurCode: string,
        public AssociationBeneficiaireCode: string,
        public AssociationImplantationCode: string,
        public Annee: number,
        public MontantSubvention: number,
        public DateFinTriennalite: Date,
        public PstTypePosteCode: string,
        public PleinTemps: string,
        public DoublementUniteCompte: string,
    ) {}
}
