import { AssociationNameDto } from "dto";
import db from "../../../shared/MongoConnection";
import SearchCacheEntity from "./searchCacheDbo";
import { SearchPort } from "./search.port";

export class SearchCacheAdapter implements SearchPort {
    private readonly collection = db.collection<SearchCacheEntity>("search-cache");

    async saveResults(searchToken: string, results: AssociationNameDto[]): Promise<void> {
        await this.collection.insertOne(new SearchCacheEntity(searchToken, results));
    }

    async getResults(
        searchToken: string,
        page: number,
        pageSize: number,
        maxTimestamp: Date,
    ): Promise<{ results: AssociationNameDto[]; total: number } | null> {
        const aggregationResult = (await this.collection
            .aggregate([
                { $match: { searchToken, timestamp: { $gt: maxTimestamp } } },
                {
                    $project: {
                        _id: 0,
                        results: { $slice: ["$results", (page - 1) * pageSize, pageSize] },
                        total: "$total",
                    },
                },
            ])
            .toArray()) as { results: AssociationNameDto[]; total: number }[];
        if (!aggregationResult[0]) return null;
        return { results: aggregationResult[0].results, total: aggregationResult[0].total };
    }

    async deleteAll(): Promise<void> {
        await this.collection.deleteMany({});
    }
}

const searchCacheAdapter = new SearchCacheAdapter();

export default searchCacheAdapter;
