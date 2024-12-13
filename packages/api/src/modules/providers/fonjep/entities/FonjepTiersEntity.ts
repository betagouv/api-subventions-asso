export default class FonjepTiersEntity {
    constructor(
        public Code: string,
        public RaisonSociale: string,
        public EstAssociation: string,
        public EstCoFinanceurPostes: string,
        public EstFinanceurPostes: string,
        public SiretOuRidet: string,
        public CodePostal: string,
        public Ville: string,
        public ContactEmail: string,
    ) {}
}
