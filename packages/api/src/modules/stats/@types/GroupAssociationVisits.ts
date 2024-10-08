import { AssociationIdentifiers } from "dto";
import AssociationVisitEntity from "../entities/AssociationVisitEntity";

export default interface GroupAssociationVisits {
    _id: AssociationIdentifiers;
    visits: AssociationVisitEntity[];
}
