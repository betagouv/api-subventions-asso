import { UserDbo } from "../../../adapters/outputs/db/user/user.dbo";
import AssociationVisitEntity from "./AssociationVisitEntity";

export type UserWithAssociationVisitsEntity = UserDbo & {
    associationVisits: AssociationVisitEntity[];
};
