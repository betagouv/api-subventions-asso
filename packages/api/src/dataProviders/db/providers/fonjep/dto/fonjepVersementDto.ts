export default interface FonjepVersementDto {
    // dates are excel dates (i.e. days since 1900-01-01)
    PosteCode: string | null;
    PeriodeDebut: number | null;
    PeriodeFin: number | null;
    DateVersement: number | null;
    MontantAPayer: number | null;
    MontantPaye: number | null;
}
