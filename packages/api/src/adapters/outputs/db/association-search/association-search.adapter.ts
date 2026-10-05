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
import type { AssociationSearchPostalCodes } from "../sirene/sirene-establishment.port";
import { removeAccents } from "../../../../shared/helpers/StringHelper";
import { Rna } from "../../../../identifier-objects";

export class AssociationSearchAdapter extends MongoAdapter<AssociationSearchDbo> implements AssociationSearchPort {
    collectionName = "association-search";

    tmpCollectionName = `${this.collectionName}-tmp`;

    async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siren: 1, rna: 1 }, { unique: true });
        await this.collection.createIndex({ siren: 1 }); // non-unique, for lookups
        await this.collection.createIndex({ rna: 1 }); // non-unique, for lookups
        await this.collection.createIndex({ postalCodes: 1, searchName: 1 });
    }

    findByText(text: string, postalCode?: string): Promise<AssociationSearchEntity[]> {
        const cleanText = removeAccents(text.trim().toLowerCase());

        return this.collection
            .find(
                this.buildQueryWithPostalCodeFilter(
                    {
                        $or: [{ searchName: { $regex: cleanText } }, { searchObject: { $regex: cleanText } }],
                    },
                    postalCode,
                ),
            )
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

    public async updatePostalCodesBySirens(dbos: AssociationSearchPostalCodes[]): Promise<void> {
        if (!dbos.length) return;

        const operations = dbos.map(({ siren, postalCodes }) => ({
            updateOne: {
                filter: { siren },
                update: { $set: { postalCodes } },
            },
        }));

        await this.collection.bulkWrite(operations);
    }

    private buildQueryWithPostalCodeFilter(
        query: Filter<AssociationSearchDbo>,
        postalCode?: string,
    ): Filter<AssociationSearchDbo> {
        if (!postalCode) return query;
        return { ...query, postalCodes: { $regex: `^${postalCode}` } };
    }
}

const associationSearchAdapter = new AssociationSearchAdapter();

export default associationSearchAdapter;
