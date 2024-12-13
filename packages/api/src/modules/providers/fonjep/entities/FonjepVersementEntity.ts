export default class FonjepVersementEntity {
    constructor(
        public PosteCode: string,
        public PeriodeDebut: Date,
        public PeriodeFin: Date,
        public DateVersement: Date,
        public MontantAPayer: number,
        public MontantPaye: number,
    ) {}
}
