import { AssociationNameDto } from "dto";

export interface SearchPort {
    saveResults(searchToken: string, results: AssociationNameDto[]): Promise<void>;
    getResults(
        searchToken: string,
        page: number,
        pageSize: number,
        maxTimestamp: Date,
    ): Promise<{ results: AssociationNameDto[]; total: number } | null>;
    deleteAll(): Promise<void>;
}
