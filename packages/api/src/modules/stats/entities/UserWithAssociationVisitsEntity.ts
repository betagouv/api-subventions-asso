import UserDbo from "../../user/repositories/dbo/UserDbo";
import AssociationVisitEntity from "./AssociationVisitEntity";

export interface UserWithAssociationVisitsEntity extends UserDbo {
    associationVisits: AssociationVisitEntity[];
}
