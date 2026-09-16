import AssociationNameEntity from "../../../../../modules/association-name/entities/AssociationNameEntity";

export type SearchResultDbo = Omit<AssociationNameEntity, "rna" | "siren"> & { rna: string; siren: string };

export interface SearchCacheDbo {
    timestamp: Date;
    results: SearchResultDbo;
    searchToken: string;
}

export default class SearchCacheEntity {
    public timestamp: Date;

    constructor(
        public searchToken: string,
        public results: SearchResultDbo[],
    ) {
        this.timestamp = new Date();
    }
}
