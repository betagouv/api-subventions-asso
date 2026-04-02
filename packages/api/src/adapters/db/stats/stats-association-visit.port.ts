import AssociationVisitEntity from "../../../modules/stats/entities/AssociationVisitEntity";

export interface StatsAssociationVisitPort {
    createIndexes(): Promise<void>;

    add(entity: AssociationVisitEntity): Promise<void>;
    getLastSearchDate(userId): Promise<Date | null>;
    findGroupedByAssociationIdentifier(): Promise<{ _id: string; visits: AssociationVisitEntity[] }[]>;
    findGroupedByUserIdentifierOnPeriod(
        start: Date,
        end: Date,
    ): Promise<{ _id: string; associationVisits: AssociationVisitEntity[] }[]>;
    findByUserId(userId: string): Promise<AssociationVisitEntity[]>;
    findOnPeriod(start: Date, end: Date): Promise<AssociationVisitEntity[]>;
}
