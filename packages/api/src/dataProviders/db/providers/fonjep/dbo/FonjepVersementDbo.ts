import { ObjectId } from "mongodb";

export default interface FonjepVersementDbo {
    _id: ObjectId;
    PosteCode: string | null;
    PeriodeDebut: Date | null;
    PeriodeFin: Date | null;
    DateVersement: Date | null;
    MontantAPayer: number | null;
    MontantPaye: number | null;
}
