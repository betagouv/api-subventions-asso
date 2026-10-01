import { Filter } from "mongodb";
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
        await this.collection.createIndex(
            { siren: 1 },
            { unique: true, partialFilterExpression: { siren: { $type: "string" } } },
        );
        await this.collection.createIndex(
            { rna: 1 },
            { unique: true, partialFilterExpression: { rna: { $type: "string" } } },
        );
        await this.collection.createIndex({ postalCodes: 1 });
    }

    findByText(text: string, postalCode?: string): Promise<AssociationSearchEntity[]> {
        const cleanText = removeAccents(text.trim().toLowerCase());
        return this.collection
            .find(this.buildQueryWithPostalCodeFilter({ searchName: { $regex: cleanText } }, postalCode))
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
            const set: Required<Pick<EstablishmentAssociationSearch, "nbEstabs" | "postalCodes">> &
                Pick<EstablishmentAssociationSearch, "address"> = { nbEstabs, postalCodes };
            if (address) set.address = address;
            return {
                updateOne: {
                    filter: { siren },
                    update: { $set: set },
                    upsert: true,
                },
            };
        });
        await this.collection.bulkWrite(operations);
        return;
    }

    public async upsertFromRna(dbos: RnaAssociationSearch[]) {
        const operations = dbos.map(dbo => {
            const { rna, name, searchName, object, searchObject } = dbo;
            return {
                updateOne: {
                    filter: { rna: rna },
                    update: { $set: { searchName, object, searchObject, "name.rna": name.rna } },
                    upsert: true,
                },
            };
        });
        await this.collection.bulkWrite(operations);
        return;
    }

    public async upsertFromSirene(dbos: UniteLegaleAssociationSearch[]) {
        const operations = dbos
            .map(dbo => {
                const { siren, rna, name, searchName, mainEstablishmentSiret } = dbo;
                const rnaField = rna ? { rna } : {};
                // Rna name has more value than sirene name
                // we have a special process to only update name from sirene when not existing
                // Also, half of the time sirene provide a rna. We only update it if it does not exists
                return [
                    // 1. refresh searchName and rna only if no Rna import yet (no name from rna)
                    {
                        updateOne: {
                            filter: { siren: siren, "name.rna": { $exists: false } },
                            update: {
                                $set: { searchName, ...rnaField },
                            },
                        },
                    },
                    // 2. upsert the rest; searchName is only set on insert (otherwise it comes from Rna or from 1.)
                    {
                        updateOne: {
                            filter: { siren: siren },
                            update: {
                                $set: { mainEstablishmentSiret, "name.sirene": name.sirene },
                                $setOnInsert: { searchName, ...rnaField },
                            },
                            upsert: true,
                        },
                    },
                ];
            })
            .flat();
        await this.collection.bulkWrite(operations);
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
