export default class FonjepVersementEntity {
    // dates are reported as Excel dates
    constructor(
        public PosteCode: string | null,
        public PeriodeDebut: number | null,
        public PeriodeFin: number | null,
        public DateVersement: number | null,
        public MontantAPayer: number | null,
        public MontantPaye: number | null,
    ) {}
}
