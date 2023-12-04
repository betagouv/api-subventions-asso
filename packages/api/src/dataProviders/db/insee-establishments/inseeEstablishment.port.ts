import { Siren } from "dto";
import MongoRepository from "../../../shared/MongoRepository";
import { InseeEstablishmentEntity } from "../../../entities/InseeEstablishmentEntity";
import InseeEstablishmentDbo from "./InseeEstablishmentDbo";
import InseeEstablishmentAdapter from "./InseeEstablishment.adapter";

export class InseeEstablishmentPort extends MongoRepository<InseeEstablishmentDbo> {
    collectionName = "insee-establishment";

    async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siret: 1 }, { unique: true });
        await this.collection.createIndex({ siren: 1, siege: 1 });
    }

    async findSiegeAddressBySiren(siren: Siren) {
        const dbo = await this.collection.findOne({ siren, siege: true });
        return dbo === null ? null : InseeEstablishmentAdapter.toAddressEntity(dbo);
    }

    async insert(entity: InseeEstablishmentEntity) {
        const dbo = InseeEstablishmentAdapter.fromEntity(entity)
        return this.collection.insertOne(dbo)
    }

    async insertMany(entities: InseeEstablishmentEntity[]) {
        const dbos = entities.map(entity => InseeEstablishmentAdapter.fromEntity(entity))
        return this.collection.insertMany(dbos)
    }
}

const inseeEstablishmentPort = new InseeEstablishmentPort()

export default inseeEstablishmentPort
