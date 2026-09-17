import AssociationSearchEntity from "../../../../../entities/AssociationSearchEntity";

export type SearchResultDbo = Omit<AssociationSearchEntity, "rna" | "siren"> & { rna: string; siren: string };

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
