import { ObjectId } from "mongodb";
import { AssociationIdentifiers } from "dto";

export default interface AssociationVisitEntity {
    associationIdentifier: AssociationIdentifiers;
    userId: ObjectId;
    date: Date;
}
