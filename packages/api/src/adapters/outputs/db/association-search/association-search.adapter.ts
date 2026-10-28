import { AnyBulkWriteOperation, Filter } from "mongodb";
import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import MongoAdapter from "../MongoAdapter";
import Siren from "../../../../identifier-objects/Siren";
import { AssociationSearchPort, FindByTextOptions } from "./association-search.port";
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

    async createIndexes() {
        await this.collection.createIndex({ siren: 1, rna: 1 }, { unique: true });
        await this.collection.createIndex({ rna: 1 }); // for direct search on rna (no siren)
        await this.collection.createIndex({ postalCodes: 1 });
        await this.collection.createIndex({ nameTokens: 1 });
        await this.collection.createIndex({ objectTokens: 1 });
    }

    findByText(
        text: string,
        { postalCode, nameOnly = false }: FindByTextOptions = {},
    ): Promise<AssociationSearchEntity[]> {
        const needle = this.sanitize.execute(text); // search a needle in a haystack
        const words = this.split.execute(needle);

        const objectContainsPhrase = { $gte: [{ $indexOfCP: ["$searchObject", needle] }, 0] };
        const allWordsInName = { $setIsSubset: [words, { $ifNull: ["$nameTokens", []] }] };
        const allWordsInObject = { $setIsSubset: [words, { $ifNull: ["$objectTokens", []] }] };
        const nameContainsPhrase = {
            $or: [
                { $gte: [{ $indexOfCP: ["$searchName.rna", needle] }, 0] },
                { $gte: [{ $indexOfCP: ["$searchName.sirene", needle] }, 0] },
            ],
        };

        const phraseMatchesSearchScope = nameOnly
            ? nameContainsPhrase
            : { $and: [nameContainsPhrase, objectContainsPhrase] };

        const wordsMatchSearchScope = nameOnly ? allWordsInName : { $and: [allWordsInName, allWordsInObject] };

        if (words.length === 0) return Promise.resolve([]);

        return this.collection
            .aggregate<AssociationSearchDbo & { score: number }>([
                ...(postalCode ? [{ $match: { postalCodes: { $regex: `^${postalCode}` } } }] : []), // filter on post code when provided

                // 1. filter all documents having all given words in their name or object
                {
                    $match: nameOnly
                        ? { nameTokens: { $all: words } }
                        : { $or: [{ nameTokens: { $all: words } }, { objectTokens: { $all: words } }] },
                },

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
                                    { case: phraseMatchesSearchScope, then: 4 },
                                    // 3: all words in name and object, any order
                                    { case: wordsMatchSearchScope, then: 3 },
                                    // 2: all words in name
                                    { case: allWordsInName, then: 2 },
                                    // 1: all words in object only
                                    { case: allWordsInObject, then: 1 },
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

        if (!(await cursor.hasNext())) return null;
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
            const { rna, siren, name, searchName, nameTokens, object, searchObject, objectTokens } = dbo;

            const updateModel = {
                $set: { "searchName.rna": searchName.rna, object, searchObject, objectTokens, "name.rna": name.rna },
                $addToSet: { nameTokens: { $each: nameTokens } },
            };

            const updateModelWithSiren = { ...updateModel, $set: { ...updateModel.$set, siren } };

            if (siren) {
                // 1. tranform orphan into match
                // @ts-expect-error: mongo treats undefined and null the same but it could break with ignoreUndefined setting
                operations.push({ updateOne: { filter: { rna, siren: null }, update: updateModelWithSiren } });
                // 2. updates the pair if it was already matched
                // this duplicates the ops but ensure everything is updated
                operations.push({
                    updateOne: { filter: { siren, rna }, update: updateModelWithSiren, upsert: true },
                });
            } else {
                // updates all docs with this rna, or create one
                operations.push({ updateMany: { filter: { rna }, update: updateModel, upsert: true } });
            }
        });
        await this.collection.bulkWrite(operations);
        return;
    }

    public async upsertFromSirene(dbos: UniteLegaleAssociationSearch[]) {
        const operations: AnyBulkWriteOperation<AssociationSearchDbo>[] = [];
        dbos.forEach(dbo => {
            const { siren, rna, name, searchName, nameTokens, mainEstablishmentSiret } = dbo;

            const updateModel = {
                $set: {
                    mainEstablishmentSiret,
                    "name.sirene": name.sirene,
                    "searchName.sirene": searchName.sirene,
                },
                $addToSet: { nameTokens: { $each: nameTokens } },
            };

            const updateModelWithRna = { ...updateModel, $set: { ...updateModel.$set, rna } };

            if (rna) {
                // 1. tranform orphan into match
                // @ts-expect-error: mongo treats undefined and null the same but it could break with ignoreUndefined setting
                operations.push({ updateOne: { filter: { siren, rna: null }, update: updateModelWithRna } });
                // 2. updates the pair if it was already matched
                // this duplicates the ops but ensure everything is updated
                operations.push({
                    updateOne: {
                        filter: { siren, rna },
                        update: updateModelWithRna,
                        upsert: true,
                    },
                });
            } else {
                // updates all docs with this siren, or create one
                operations.push({
                    updateMany: {
                        filter: { siren },
                        update: updateModel,
                        upsert: true,
                    },
                });
            }
        });
        await this.collection.bulkWrite(operations);
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
