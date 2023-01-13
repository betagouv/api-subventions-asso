import { ObjectId } from "mongodb";
import { AssociationIdentifiers } from "../../../@types";

export default interface AssociationVisitEntity {
    associationIndentifier: AssociationIdentifiers;
    userId: ObjectId;
    date: Date;
}
