import db from "../../../../shared/MongoConnection";
import { MONGO_BATCH_SIZE } from "../../../../configurations/mongo.conf";
import { FindOneAndUpdateOptions } from "mongodb";
import OsirisActionEntity from "../entities/OsirisActionEntity";
import { Siren } from "@api-subventions-asso/dto";
import OsirisActionEntityDbo from '../entities/OsirisActionEntityDbo';
import OsirisActionAdapter from './dboAdapters/osirisActionAdapter';
import MongoCnxError from '../../../../shared/errors/MongoCnxError';

export class OsirisActionRepository {
    private readonly collection = db.collection<OsirisActionEntityDbo>("osiris-actions");

    // Action Part
    public async add(osirisAction: OsirisActionEntity) {
        await this.collection.insertOne(OsirisActionAdapter.toDbo(osirisAction));
        const dbo = await this.findByOsirisId(osirisAction.indexedInformations.osirisActionId);
        if (!dbo) throw new MongoCnxError();
        return OsirisActionAdapter.toEntity(dbo);
    }

    public async update(osirisAction: OsirisActionEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {_id, ...actionWithoutId } = OsirisActionAdapter.toDbo(osirisAction);
        const dbo =  (await this.collection.findOneAndUpdate(
            { "indexedInformations.osirisActionId": osirisAction.indexedInformations.osirisActionId },
            { $set: actionWithoutId },
            options
        )).value;
        if (!dbo) throw new MongoCnxError();
        return OsirisActionAdapter.toEntity(dbo);
    }
    
    /**
     * @depricated
     */
    public async findAll(limit:number = MONGO_BATCH_SIZE) {
        return this.collection.find({}).limit(limit).batchSize(MONGO_BATCH_SIZE).toArray() as unknown as OsirisActionEntity[];
    }

    public async findByOsirisId(osirisId: string) {
        const dbo = await this.collection.findOne({ "indexedInformations.osirisActionId": osirisId });
        if(!dbo) return null;
        return OsirisActionAdapter.toEntity(dbo);
    }

    public cursorFind(query = {}){
        return this.collection.find(query);
    }

    public async findByCompteAssoId(compteAssoId: string) {
        const dbos = await this.collection.find({ "indexedInformations.compteAssoId": compteAssoId }).toArray();
        return dbos.map(dbo => OsirisActionAdapter.toEntity(dbo));
    }

    public async findBySiren(siren: Siren) {
        const dbos = await this.collection.find({ "indexedInformations.siret": new RegExp(`^${siren}\\d{5}`) }).toArray();
        return dbos.map(dbo => OsirisActionAdapter.toEntity(dbo));
    }
}

const osirisActionRepository: OsirisActionRepository = new OsirisActionRepository();

export default osirisActionRepository;