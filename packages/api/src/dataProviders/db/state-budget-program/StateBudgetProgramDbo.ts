import { ObjectId } from "mongodb";

export default interface StateBudgetProgramDbo {
    _id: ObjectId;
    mission: string;
    label_programme: string;
    code_ministere: string;
    code_programme: string;
}
