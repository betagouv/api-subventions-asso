import MongoPort from "../../../../shared/MongoPort";
import MiscScdlProducerEntity from "../../../../modules/providers/scdl/entities/MiscScdlProducerEntity";

export class MiscScdlProducersPort extends MongoPort<MiscScdlProducerEntity> {
    readonly collectionName = "misc-scdl-producers";
    readonly joinIndexes = {
        miscScdlGrant: "siret",
    };

    public findAll() {
        return this.collection.find({}, { projection: { _id: 0 } }).toArray() as Promise<MiscScdlProducerEntity[]>;
    }

    public findBySiret(siret: string) {
        return this.collection.findOne({ siret });
    }

    public create(entity: MiscScdlProducerEntity) {
        return this.collection.insertOne(entity);
    }

    async createIndexes() {
        await this.collection.createIndex({ name: 1 }, { unique: true });
        await this.collection.createIndex({ siret: 1 }, { unique: true });
    }
}

const miscScdlProducersPort = new MiscScdlProducersPort();

export default miscScdlProducersPort;
