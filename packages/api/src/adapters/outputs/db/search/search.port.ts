import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";

export interface SearchPort {
    saveResults(searchToken: string, results: AssociationSearchEntity[]): Promise<void>;
    getResults(searchToken: string, maxTimestamp: Date): Promise<AssociationSearchEntity[] | null>;
    deleteAll(): Promise<void>;
}
