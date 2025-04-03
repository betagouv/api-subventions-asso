// null represents an empty cell in the file
export default interface FonjepVersementDtoWithExcelDate {
    PosteCode: string;
    PeriodeDebut: number | null; // dates in excel dates (i.e. days since 1900-01-01)
    PeriodeFin: number | null; // dates in excel dates (i.e. days since 1900-01-01)
    DateVersement: number | null; // dates in excel dates (i.e. days since 1900-01-01)
    MontantAPayer: number | null;
    MontantPaye: number | null;
}

export interface FonjepVersementDto
    extends Omit<FonjepVersementDtoWithExcelDate, "DateVersement" | "PeriodeDebut" | "PeriodeFin"> {
    PeriodeDebut: Date | null;
    PeriodeFin: Date | null;
    DateVersement: Date | null;
}
