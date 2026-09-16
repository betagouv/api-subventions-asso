import AssociationNameEntity from "../../../../modules/association-name/entities/AssociationNameEntity";

export interface SearchPort {
    saveResults(searchToken: string, results: AssociationNameEntity[]): Promise<void>;
    getResults(searchToken: string, maxTimestamp: Date): Promise<AssociationNameEntity[] | null>;
    deleteAll(): Promise<void>;
}
