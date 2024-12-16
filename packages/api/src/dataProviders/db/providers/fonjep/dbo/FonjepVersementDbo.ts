import { ObjectId } from "mongodb";
// dates are reported as Excel dates
export default interface FonjepVersementDbo {
    _id: ObjectId;
    PosteCode: string | null;
    PeriodeDebut: number | null;
    PeriodeFin: number | null;
    DateVersement: number | null;
    MontantAPayer: number | null;
    MontantPaye: number | null;
}
