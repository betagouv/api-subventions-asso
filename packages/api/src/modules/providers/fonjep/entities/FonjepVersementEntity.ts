export default class FonjepVersementEntity {
    constructor(
        public PosteCode: string | null,
        public PeriodeDebut: Date | null,
        public PeriodeFin: Date | null,
        public DateVersement: Date | null,
        public MontantAPayer: number | null,
        public MontantPaye: number | null,
    ) {}
}
