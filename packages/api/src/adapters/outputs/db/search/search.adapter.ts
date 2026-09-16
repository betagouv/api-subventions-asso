import db from "../../../../shared/MongoConnection";
import { SearchPort } from "./search.port";
import SearchCacheEntity, { SearchResultDbo } from "./@types/SearchCacheDbo";
import AssociationNameEntity from "../../../../modules/association-name/entities/AssociationNameEntity";
import Rna from "../../../../identifier-objects/Rna";
import Siren from "../../../../identifier-objects/Siren";

function toEntity(dbo: SearchResultDbo): AssociationNameEntity {
    return new AssociationNameEntity(dbo.name, new Siren(dbo.siren), new Rna(dbo.rna), dbo.address, dbo.nbEtabs);
}

function toDbo(searchToken: string, searchResult: AssociationNameEntity[]): SearchCacheEntity {
    return new SearchCacheEntity(
        searchToken,
        searchResult.map(associationName => {
            return {
                name: associationName.name,
                rna: associationName.rna?.value,
                siren: associationName.siren.value,
                address: associationName.address,
                nbEtabs: associationName.nbEtabs,
            };
        }) as SearchResultDbo[],
    );
}

export class SearchCacheAdapter implements SearchPort {
    private readonly collection = db.collection<SearchCacheEntity>("search-cache");

    async saveResults(searchToken: string, searchResult: AssociationNameEntity[]) {
        await this.collection.insertOne(toDbo(searchToken, searchResult));
    }

    async getResults(searchToken: string, maxTimestamp: Date) {
        const aggregationResult = (await this.collection
            .aggregate([
                { $match: { searchToken, timestamp: { $gt: maxTimestamp } } },
                {
                    $project: {
                        _id: 0,
                    },
                },
            ])
            .toArray()) as SearchCacheEntity[];
        if (!aggregationResult[0]) return null;
        return aggregationResult[0].results.map(toEntity);
    }

    async deleteAll(): Promise<void> {
        await this.collection.deleteMany({});
    }
}

const searchCacheAdapter = new SearchCacheAdapter();

export default searchCacheAdapter;
