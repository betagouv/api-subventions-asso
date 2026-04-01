import UserDbo from "../../../dataProviders/db/user/@types/UserDbo";
import AssociationVisitEntity from "./AssociationVisitEntity";

export interface UserWithAssociationVisitsEntity extends UserDbo {
    associationVisits: AssociationVisitEntity[];
}
