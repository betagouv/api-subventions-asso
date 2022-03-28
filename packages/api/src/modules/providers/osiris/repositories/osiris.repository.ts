import db from "../../../../shared/MongoConnection";
import { MONGO_BATCH_SIZE } from "../../../../configurations/mongo.conf";
import { FindOneAndUpdateOptions } from "mongodb";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";
import OsirisActionEntity from "../entities/OsirisActionEntity";
import { Siret, Rna, Siren } from "../../../../@types";
import OsirisActionEntityDbo from '../entities/OsirisActionEntityDbo';
import OsirisActionAdapter from './dboAdapters/osirisActionAdapter';
import MongoCnxError from '../../../../shared/errors/MongoCnxError';

export class OsirisRepository {
    private readonly requestCollection = db.collection<OsirisRequestEntity>("osiris-requests");
    private readonly actionCollection = db.collection<OsirisActionEntityDbo>("osiris-actions");

    // Request Part
    public async addRequest(osirisRequest: OsirisRequestEntity) {
        await this.requestCollection.insertOne(osirisRequest);
        return this.findRequestByOsirisId(osirisRequest.providerInformations.osirisId) as OsirisRequestEntity;
    }

    public async updateRequest(osirisRequest: OsirisRequestEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {_id, ...requestWithoutId } = osirisRequest;
        return (await this.requestCollection.findOneAndUpdate({ 
            "providerInformations.osirisId": osirisRequest.providerInformations.osirisId 
        },
        { $set: requestWithoutId }, options)).value as OsirisRequestEntity;
    }
    
    public async findAllRequests(limit:number = MONGO_BATCH_SIZE) {
        return this.requestCollection.find({}).limit(limit).batchSize(MONGO_BATCH_SIZE).toArray() as unknown as OsirisRequestEntity[];
    }

    public findRequestByOsirisId(osirisId: string) {
        return this.requestCollection.findOne({ "providerInformations.osirisId": osirisId }) as unknown as (OsirisRequestEntity | null);
    }

    public findRequestsBySiret(siret: Siret) {
        return this.requestCollection.find({
            "legalInformations.siret": siret
        }).toArray();
    }

    public findRequestsByRna(rna: Rna) {
        return this.requestCollection.find({
            "legalInformations.rna": rna
        }).toArray();
    }

    public async findRequestsBySiren(siren: Siren) {
        return this.requestCollection.find({
            "legalInformations.siret":  new RegExp(`^${siren}\\d{5}`)
        }).toArray();
    }

    // Action Part
    public async addAction(osirisAction: OsirisActionEntity) {
        await this.actionCollection.insertOne(OsirisActionAdapter.toDbo(osirisAction));
        const dbo = await this.findActionByOsirisId(osirisAction.indexedInformations.osirisActionId);
        if (!dbo) throw new MongoCnxError();
        return OsirisActionAdapter.toEntity(dbo);
    }

    public async updateAction(osirisAction: OsirisActionEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {_id, ...actionWithoutId } = OsirisActionAdapter.toDbo(osirisAction);
        const dbo =  (await this.actionCollection.findOneAndUpdate(
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
    public async findAllActions(limit:number = MONGO_BATCH_SIZE) {
        return this.actionCollection.find({}).limit(limit).batchSize(MONGO_BATCH_SIZE).toArray() as unknown as OsirisActionEntity[];
    }

    public async findActionByOsirisId(osirisId: string) {
        const dbo = await this.actionCollection.findOne({ "indexedInformations.osirisActionId": osirisId });
        if(!dbo) return null;
        return OsirisActionAdapter.toEntity(dbo);
    }

    public async findActionsByCompteAssoId(compteAssoId: string) {
        const dbos = await this.actionCollection.find({ "indexedInformations.compteAssoId": compteAssoId }).toArray();
        return dbos.map(dbo => OsirisActionAdapter.toEntity(dbo));
    }
}

const osirisRepository: OsirisRepository = new OsirisRepository();

export default osirisRepository;