import { AssociationNameDto } from "dto";
import db from "../../../shared/MongoConnection";
import SearchCacheEntity from "./entities/searchCacheDbo";

export class SearchCacheRepository {
    private readonly collection = db.collection<SearchCacheEntity>("search-cache");

    saveResults(searchToken: string, results: AssociationNameDto[]) {
        return this.collection.insertOne(new SearchCacheEntity(searchToken, results));
    }

    async getResults(searchToken: string, page: number, pageSize: number, maxTimestamp: Date) {
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

    deleteAll() {
        return this.collection.deleteMany({});
    }
}

const searchCacheRepository = new SearchCacheRepository();

export default searchCacheRepository;
