import { AssociationIdentifiers } from "../../../@types";
import AssociationVisitEntity from "../entities/AssociationVisitEntity";

export default interface GroupAssociationVisits {
    _id: AssociationIdentifiers;
    visits: AssociationVisitEntity[];
}
