import { ObjectId } from "mongodb";

export type DataGouvExtractDbo = {
    _id: ObjectId;
    frequency: string;
    creation: Date;
    lastUpdate: Date;
    lastImport: Date;
    periodStartDate: Date;
    periodEndDate: Date;
    dataGouvDatasetId: string;
    dataGouvResourceId: string;
    dataProducer: string;
};
