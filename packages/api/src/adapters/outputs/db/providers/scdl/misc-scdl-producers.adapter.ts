import MongoAdapter from "../../MongoAdapter";
import MiscScdlProducerEntity from "../../../../../modules/providers/scdl/entities/MiscScdlProducerEntity";
import { MiscScdlProducersPort } from "./misc-scdl-producers.port";

export class MiscScdlProducersAdapter extends MongoAdapter<MiscScdlProducerEntity> implements MiscScdlProducersPort {
    readonly collectionName = "misc-scdl-producers";
    readonly joinIndexes = {
        miscScdlGrant: "siret",
    };

    public findAll(): Promise<MiscScdlProducerEntity[]> {
        return this.collection.find({}, { projection: { _id: 0 } }).toArray() as Promise<MiscScdlProducerEntity[]>;
    }

    public findBySiret(siret: string): Promise<MiscScdlProducerEntity | null> {
        return this.collection.findOne({ siret }, { projection: { _id: 0 } });
    }

    public async create(entity: MiscScdlProducerEntity): Promise<void> {
        await this.collection.insertOne(entity);
    }

    async createIndexes() {
        await this.collection.createIndex({ name: 1 }, { unique: true });
        await this.collection.createIndex({ siret: 1 }, { unique: true });
    }
}

const miscScdlProducersAdapter = new MiscScdlProducersAdapter();

export default miscScdlProducersAdapter;
