export default class FonjepPosteEntity {
    constructor(
        public Code: string | null,
        public DispositifId: number | null,
        public PstStatutPosteLibelle: string | null,
        public PstRaisonStatutLibelle: string | null,
        public FinanceurPrincipalCode: string | null,
        public FinanceurAttributeurCode: string | null,
        public AssociationBeneficiaireCode: string | null,
        public AssociationImplantationCode: string | null,
        public Annee: number | null,
        public MontantSubvention: number | null,
        public DateFinTriennalite: Date | null,
        public PstTypePosteCode: string | null,
        public PleinTemps: string | null,
        public DoublementUniteCompte: string | null,
    ) {}
}
