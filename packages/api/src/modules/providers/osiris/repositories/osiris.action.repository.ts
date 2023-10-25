import { FindOneAndUpdateOptions } from "mongodb";
import { Siren } from "dto";
import db from "../../../../shared/MongoConnection";
import OsirisActionEntity from "../entities/OsirisActionEntity";
import OsirisActionEntityDbo from "../entities/OsirisActionEntityDbo";
import MongoCnxError from "../../../../shared/errors/MongoCnxError";
import OsirisActionAdapter from "./dboAdapters/osirisActionAdapter";

export class OsirisActionRepository {
    private readonly collection = db.collection<OsirisActionEntityDbo>("osiris-actions");

    async createIndexes() {
        await this.collection.createIndex({ "indexedInformations.osirisActionId": 1 }, { unique: true });
        await this.collection.createIndex({ "indexedInformations.compteAssoId": 1 });
        await this.collection.createIndex({ "indexedInformations.siret": 1 });
    }

    // Action Part
    public async add(osirisAction: OsirisActionEntity) {
        await this.collection.insertOne(OsirisActionAdapter.toDbo(osirisAction));
        return osirisAction;
    }

    public async update(osirisAction: OsirisActionEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...actionWithoutId } = OsirisActionAdapter.toDbo(osirisAction);
        const dbo = (
            await this.collection.findOneAndUpdate(
                {
                    "indexedInformations.osirisActionId": osirisAction.indexedInformations.osirisActionId,
                },
                { $set: actionWithoutId },
                options,
            )
        ).value;
        if (!dbo) throw new MongoCnxError();
        return OsirisActionAdapter.toEntity(dbo);
    }

    public async findByOsirisId(osirisId: string) {
        const dbo = await this.collection.findOne({
            "indexedInformations.osirisActionId": osirisId,
        });
        if (!dbo) return null;
        return OsirisActionAdapter.toEntity(dbo);
    }

    public cursorFind(query = {}) {
        return this.collection.find(query);
    }

    public async findByCompteAssoId(compteAssoId: string) {
        const dbos = await this.collection.find({ "indexedInformations.compteAssoId": compteAssoId }).toArray();
        return dbos.map(dbo => OsirisActionAdapter.toEntity(dbo));
    }

    public async findBySiren(siren: Siren) {
        const dbos = await this.collection
            .find({ "indexedInformations.siret": new RegExp(`^${siren}\\d{5}`) })
            .toArray();
        return dbos.map(dbo => OsirisActionAdapter.toEntity(dbo));
    }
}

const osirisActionRepository: OsirisActionRepository = new OsirisActionRepository();

export default osirisActionRepository;
