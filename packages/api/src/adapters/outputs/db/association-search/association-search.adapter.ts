import { Filter } from "mongodb";
import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import MongoAdapter from "../MongoAdapter";
import Siren from "../../../../identifier-objects/Siren";
import { AssociationSearchPort } from "./association-search.port";
import AssociationSearchMapper from "./association-search.mapper";
import AssociationSearchDbo, { AssociationSearchPartialUpdate } from "./@types/AssociationSearchDbo";
import type { AssociationSearchPostalCodes } from "../sirene/sirene-establishment.port";

export class AssociationSearchAdapter extends MongoAdapter<AssociationSearchDbo> implements AssociationSearchPort {
    collectionName = "association-search";

    async createIndexes(): Promise<void> {
        await this.collection.createIndex(
            { siren: 1 },
            { unique: true, partialFilterExpression: { siren: { $exists: true } } },
        );
        await this.collection.createIndex({
            postalCodes: 1,
            siren: 1,
        });
    }

    findByText(text: string, postalCode?: string): Promise<AssociationSearchEntity[]> {
        return this.collection
            .find(this.buildQueryWithPostalCodeFilter({ searchName: { $regex: text } }, postalCode))
            .map(doc => AssociationSearchMapper.toEntity(doc))
            .toArray();
    }

    /**
     * Find the latest name associate at the siren
     *
     * @param {Siren} siren
     * @returns the latest name associate at the siren
     */
    async findOneBySiren(siren: Siren, postalCode?: string): Promise<AssociationSearchEntity | null> {
        const cursor = this.collection
            .find(this.buildQueryWithPostalCodeFilter({ siren: siren.value }, postalCode))
            .sort({ updateDate: 1 });

        if (!cursor.hasNext()) return null;
        const dbo = await cursor.next();
        await cursor.close();
        if (!dbo) return null;
        return AssociationSearchMapper.toEntity(dbo);
    }

    // becarefull as here we do not pass entities but partial dbos
    public async upsertMany(dbos: Partial<AssociationSearchPartialUpdate>[]): Promise<void> {
        const operations = dbos.map(dbo => ({
            updateOne: {
                filter: dbo.siren ? { siren: dbo.siren } : { rna: dbo.rna }, // most of the time we update from siren
                update: { $set: dbo },
                upsert: true,
            },
        }));

        await this.collection.bulkWrite(operations);
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
