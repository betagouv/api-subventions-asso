import { ObjectId } from "mongodb";

export default interface AssociationVisitEntity {
    associationIdentifier: string;
    userId: ObjectId;
    date: Date;
}
