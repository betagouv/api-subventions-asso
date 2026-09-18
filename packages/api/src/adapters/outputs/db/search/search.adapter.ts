import db from "../../../../shared/MongoConnection";
import { SearchPort } from "./search.port";
import SearchCacheEntity, { SearchResultDbo } from "./@types/SearchCacheDbo";
import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";

function toEntity(dbo: SearchResultDbo): AssociationSearchEntity {
    return new AssociationSearchEntity({
        name: dbo.name,
        siren: dbo.siren,
        rna: dbo.rna,
        mainEstablishmentSiret: dbo.mainEstablishmentSiret,
        address: dbo.address ?? undefined,
        nbEstabs: dbo.nbEstabs ?? undefined,
    });
}

function toDbo(searchToken: string, searchResult: Partial<AssociationSearchEntity>[]): SearchCacheEntity {
    return new SearchCacheEntity(
        searchToken,
        searchResult.map(associationName => {
            return {
                name: associationName.name,
                rna: associationName.rna?.value,
                siren: associationName.siren!.value, // should always be defined but all search cache will be refactored / removed soon
                address: associationName.address,
                nbEstabs: associationName.nbEstabs,
            };
        }) as SearchResultDbo[],
    );
}

export class SearchCacheAdapter implements SearchPort {
    private readonly collection = db.collection<SearchCacheEntity>("search-cache");

    async saveResults(searchToken: string, searchResult: Partial<AssociationSearchEntity>[]) {
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
