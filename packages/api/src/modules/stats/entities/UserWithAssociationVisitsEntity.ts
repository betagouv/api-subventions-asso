import UserDbo from "../../user/repositories/dbo/UserDbo";
import AssociationVisitEntity from "./AssociationVisitEntity";

export interface UserWithAssociationVistitsEntity extends UserDbo {
    associationVisits: AssociationVisitEntity[];
}
