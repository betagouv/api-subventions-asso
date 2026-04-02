export interface StatsUniqueVisitByDayPort {
    createIndexes(): void;
    createCollectionFromStatsAssociationVisits(): Promise<void>;
}
