import { ObjectId } from "mongodb";

export default interface ProviderRequestLogDbo {
    _id: ObjectId;
    providerName: string;
    route: string;
    date: Date;
    responseCode: number;
    type: "GET" | "POST";
}
