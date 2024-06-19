import { ObjectId } from "mongodb";

export default interface StateBudgetProgramDbo {
    _id: ObjectId;
    mission: string | null;
    label_programme: string;
    code_ministere: string;
    code_programme: number;
}
