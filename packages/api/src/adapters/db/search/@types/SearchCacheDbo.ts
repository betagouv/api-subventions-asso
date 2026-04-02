import { AssociationNameDto } from "dto";

export default class SearchCacheEntity {
    public timestamp: Date;
    public total: number;

    constructor(
        public searchToken: string,
        public results: AssociationNameDto[],
    ) {
        this.timestamp = new Date();
        this.total = results.length;
    }
}
