import { ObjectId } from "mongodb";
import AssociationVisitEntity from "../../../../modules/stats/entities/AssociationVisitEntity";

export type AssociationVisitDbo = Omit<AssociationVisitEntity, "userId"> & { userId: ObjectId };
