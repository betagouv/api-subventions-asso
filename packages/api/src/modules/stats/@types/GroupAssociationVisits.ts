import AssociationVisitEntity from "../entities/AssociationVisitEntity";

export default interface GroupAssociationVisits {
    _id: string;
    visits: AssociationVisitEntity[];
}
