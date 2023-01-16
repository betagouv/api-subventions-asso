import { ObjectId } from "mongodb";
import { AssociationIdentifiers } from "../../../@types";

export default interface AssociationVisitEntity {
    associationIdentifier: AssociationIdentifiers;
    userId: ObjectId;
    date: Date;
}
