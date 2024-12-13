export default class FonjepTiersEntity {
    constructor(
        public Code: string | null,
        public RaisonSociale: string | null,
        public EstAssociation: string | null,
        public EstCoFinanceurPostes: string | null,
        public EstFinanceurPostes: string | null,
        public SiretOuRidet: string | null,
        public CodePostal: string | null,
        public Ville: string | null,
        public ContactEmail: string | null,
    ) {}
}
