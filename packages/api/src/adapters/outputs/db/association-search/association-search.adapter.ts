import { AnyBulkWriteOperation, Filter } from "mongodb";
import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import MongoAdapter from "../MongoAdapter";
import Siren from "../../../../identifier-objects/Siren";
import { AssociationSearchPort } from "./association-search.port";
import AssociationSearchMapper from "./association-search.mapper";
import AssociationSearchDbo, {
    EstablishmentAssociationSearch,
    RnaAssociationSearch,
    UniteLegaleAssociationSearch,
} from "./@types/AssociationSearchDbo";
import { Rna } from "../../../../identifier-objects";
import { SanitizeSearchText } from "../../../../usecases/search/sanitize-search-text";
import { SplitTextInTokens } from "../../../../usecases/search/split-text-in-tokens";

export class AssociationSearchAdapter extends MongoAdapter<AssociationSearchDbo> implements AssociationSearchPort {
    constructor(
        private sanitize: SanitizeSearchText,
        private split: SplitTextInTokens,
    ) {
        super();
    }

    collectionName = "association-search";

    tmpCollectionName = `${this.collectionName}-tmp`;

    async createIndexes() {
        await this.collection.createIndex({ siren: 1, rna: 1 }, { unique: true });
        await this.collection.createIndex({ rna: 1 }); // for direct search on rna (no siren)
        await this.collection.createIndex({ postalCodes: 1 });
        await this.collection.createIndex({ nameTokens: 1 });
        await this.collection.createIndex({ objectTokens: 1 });
    }

    findByText(text: string, postalCode?: string): Promise<AssociationSearchEntity[]> {
        const words = this.split.execute(text);

        if (words.length === 0) return Promise.resolve([]);

        const needle = this.sanitize.execute(text); // search a needle in a haystack

        return this.collection
            .aggregate<AssociationSearchDbo & { score: number }>([
                ...(postalCode ? [{ $match: { postalCodes: postalCode } }] : []), // filter on post code when provided

                // 1. filter all documents having all given words in their name or object
                { $match: { $or: [{ nameTokens: { $all: words } }, { objectTokens: { $all: words } }] } },

                // 2. build a score for each document, based on :
                //      4 => the phrase is present in both name and object (words in order)
                //      3 => all words match in both name or object (in any order)
                //      2 => all words match only in name
                //      1 => all words match only in object
                {
                    $addFields: {
                        score: {
                            $switch: {
                                branches: [
                                    // 4: whole phrase, in order, in name and object
                                    {
                                        case: {
                                            $and: [
                                                { $gte: [{ $indexOfCP: ["$searchName", needle] }, 0] },
                                                { $gte: [{ $indexOfCP: ["$searchObject", needle] }, 0] },
                                            ],
                                        },
                                        then: 4,
                                    },
                                    // 3: all words in name and object, any order
                                    {
                                        case: {
                                            $and: [
                                                { $setIsSubset: [words, { $ifNull: ["$nameTokens", []] }] },
                                                { $setIsSubset: [words, { $ifNull: ["$objectTokens", []] }] },
                                            ],
                                        },
                                        then: 3,
                                    },
                                    // 2: all words in name
                                    { case: { $setIsSubset: [words, { $ifNull: ["$nameTokens", []] }] }, then: 2 },
                                    // 1: all words in object only
                                    {
                                        case: { $setIsSubset: [words, { $ifNull: ["$objectTokens", []] }] },
                                        then: 1,
                                    },
                                ],
                                default: 0,
                            },
                        },
                    },
                },

                // 3. clean up and sort
                { $match: { score: { $gt: 0 } } },
                { $sort: { score: -1 } },
                { $limit: 50 },
            ])
            .map(doc => AssociationSearchMapper.toEntity(doc))
            .toArray();
    }

    /**
     * Find the latest name associate at the siren
     *
     * @param {Siren} siren
     * @returns the latest name associate at the siren
     */
    async findByIdentifier(identifier: Siren | Rna, postalCode?: string): Promise<AssociationSearchEntity | null> {
        const query = identifier instanceof Siren ? { siren: identifier.value } : { rna: identifier.value };
        const cursor = this.collection.find(this.buildQueryWithPostalCodeFilter(query, postalCode));

        if (!cursor.hasNext()) return null;
        const dbo = await cursor.next();
        await cursor.close();
        if (!dbo) return null;
        return AssociationSearchMapper.toEntity(dbo);
    }

    public async upsertFromEstablishment(dbos: EstablishmentAssociationSearch[]) {
        const operations = dbos.map(dbo => {
            const { siren, address, nbEstabs, postalCodes } = dbo;
            return {
                updateMany: {
                    filter: { siren },
                    update: { $set: { nbEstabs, postalCodes, ...(address && { address }) } },
                    upsert: true,
                },
            };
        });
        await this.collection.bulkWrite(operations);
        return;
    }

    public async upsertFromRna(dbos: RnaAssociationSearch[]) {
        const operations: AnyBulkWriteOperation<AssociationSearchDbo>[] = [];
        dbos.forEach(dbo => {
            const { rna, siren, name, searchName, object, searchObject } = dbo;
            const rnaFields = { searchName, object, searchObject, "name.rna": name.rna };

            if (siren) {
                // updates the pair if it exists
                operations.push({
                    updateOne: { filter: { siren, rna }, update: { $set: rnaFields }, upsert: true },
                });
                // updates all document with the rna
                operations.push({ updateMany: { filter: { rna }, update: { $set: rnaFields } } });
            } else {
                // updates all docs with this rna, or create one
                operations.push({ updateMany: { filter: { rna }, update: { $set: rnaFields }, upsert: true } });
            }
        });
        await this.collection.bulkWrite(operations.flat());
        return;
    }

    public async upsertFromSirene(dbos: UniteLegaleAssociationSearch[]) {
        const operations: AnyBulkWriteOperation<AssociationSearchDbo>[] = [];
        dbos.forEach(dbo => {
            const { siren, rna, name, searchName, mainEstablishmentSiret } = dbo;
            const sireneFields = { mainEstablishmentSiret, "name.sirene": name.sirene };

            if (rna) {
                // 1. updates the rna-siren pair
                operations.push({
                    updateOne: {
                        filter: { siren, rna },
                        update: { $set: sireneFields, $setOnInsert: { searchName } },
                        upsert: true,
                    },
                });
                // 2. updates orphans
                operations.push({ updateMany: { filter: { siren }, update: { $set: sireneFields } } });
            } else {
                // updates all docs with this siren, or create one
                operations.push({
                    updateMany: {
                        filter: { siren },
                        update: { $set: sireneFields, $setOnInsert: { searchName } },
                        upsert: true,
                    },
                });
            }
        });
        await this.collection.bulkWrite(operations.flat());
        return;
    }

    private buildQueryWithPostalCodeFilter(
        query: Filter<AssociationSearchDbo>,
        postalCode?: string,
    ): Filter<AssociationSearchDbo> {
        if (!postalCode) return query;
        return { ...query, postalCodes: { $regex: `^${postalCode}` } };
    }
}

const associationSearchAdapter = new AssociationSearchAdapter(new SanitizeSearchText(), new SplitTextInTokens());

export default associationSearchAdapter;
