import { InsertOneResult, MongoServerError } from "mongodb";
import { Siren } from "dto";
import UniteLegalNameEntity from "../../../entities/UniteLegalNameEntity";
import ExecutionSyncStack from "../../../shared/ExecutionSyncStack";
import { DuplicateIndexError } from "../../../shared/errors/dbErrror/DuplicateIndexError";
import MongoRepository from "../../../shared/MongoRepository";
import UniteLegalNameAdapter from "./UniteLegalName.adapter";
import UniteLegalNameDbo from "./UniteLegalNameDbo";

export class UniteLegalNamePort extends MongoRepository<UniteLegalNameDbo> {
    collectionName = "unite-legal-names";

    private insertSirenStack: ExecutionSyncStack<UniteLegalNameDbo, InsertOneResult>;

    constructor() {
        super();
        this.insertSirenStack = new ExecutionSyncStack(entity => {
            return this.collection.insertOne(entity);
        });
    }

    async createIndexes() {
        await this.collection.createIndex({ searchingKey: 1 }, { unique: true });
        await this.collection.createIndex({ siren: 1 });
    }

    search(searchQuery: string) {
        return this.collection
            .find({
                searchingKey: { $regex: searchQuery },
            })
            .map(doc => UniteLegalNameAdapter.toEntity(doc))
            .toArray();
    }

    /**
     * Find the latest name associate at the siren
     *
     * @param {Siren} siren
     * @returns the latest name associate at the siren
     */
    async findOneBySiren(siren: Siren) {
        const cursor = this.collection.find({ siren }).sort({ updatedDate: 1 });

        if (!cursor.hasNext()) return null;
        const dbo = await cursor.next();
        await cursor.close();
        if (!dbo) return null;
        return UniteLegalNameAdapter.toEntity(dbo);
    }

    insert(entity: UniteLegalNameEntity) {
        // Use stack because, sometimes to upsert on same entity as executed at the same time, please read : https://jira.mongodb.org/browse/SERVER-14322
        return this.insertSirenStack.addOperation(UniteLegalNameAdapter.toDbo(entity)).catch(error => {
            if (error instanceof MongoServerError && error.code === "E11000")
                throw new DuplicateIndexError(error.message, entity);
            return error;
        });
    }
}

const uniteLegalNamePort = new UniteLegalNamePort();

export default uniteLegalNamePort;
