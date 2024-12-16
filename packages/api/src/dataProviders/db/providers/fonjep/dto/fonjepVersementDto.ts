export default interface FonjepVersementDto {
    PosteCode: string | null;
    PeriodeDebut: Date | null;
    PeriodeFin: Date | null;
    DateVersement: Date | null;
    MontantAPayer: number | null;
    MontantPaye: number | null;
}
