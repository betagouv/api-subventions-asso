import db from "../../../shared/MongoConnection";
import { MONGO_BATCH_SIZE } from "../../../configurations/mongo.conf";
import { FindOneAndUpdateOptions } from "mongodb";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";
import OsirisActionEntity from "../entities/OsirisActionEntity";

export class OsirisRepository {
    private readonly requestCollection = db.collection<OsirisRequestEntity>("osiris-files");
    private readonly actionCollection = db.collection<OsirisActionEntity>("osiris-actions");

    // Request Part
    public async addRequest(osirisRequest: OsirisRequestEntity) {
        await this.requestCollection.insertOne(osirisRequest);
        osirisRequest.legalInformations.siret
        return this.findRequestByOsirisId(osirisRequest.providerInformations.osirisId) as OsirisRequestEntity;
    }

    public async updateRequest(osirisRequest: OsirisRequestEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        return (await this.requestCollection.findOneAndUpdate({ 
            "providerInformations.osirisId": osirisRequest.providerInformations.osirisId 
        },
        { $set: osirisRequest }, options)).value as OsirisRequestEntity;
    }
    
    public async findAllRequests(limit:number = MONGO_BATCH_SIZE) {
        return this.requestCollection.find({}).limit(limit).batchSize(MONGO_BATCH_SIZE).toArray() as unknown as OsirisRequestEntity[];
    }

    public findRequestByOsirisId(osirisId: string) {
        return this.requestCollection.findOne({ "providerInformations.osirisId": osirisId }) as unknown as (OsirisRequestEntity | null);
    }

    public findRequestsBySiret(siret: string) {
        return this.requestCollection.find({
            "legalInformations.siret": siret
        }).toArray();
    }

    public findRequestsByRna(rna: string) {
        return this.requestCollection.find({
            "legalInformations.rna": rna
        }).toArray();
    }

    // Action Part
    public async addAction(osirisAction: OsirisActionEntity) {
        await this.actionCollection.insertOne(osirisAction);
        return this.findActionByOsirisId(osirisAction.indexedInformations.osirisActionId) as OsirisActionEntity;
    }

    public async updateAction(osirisAction: OsirisActionEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        return (await this.actionCollection.findOneAndUpdate(
            { "indexedInformations.osirisActionId": osirisAction.indexedInformations.osirisActionId },
            { $set: osirisAction },
            options
        )).value as OsirisActionEntity;
    }
    
    public async findAllActions(limit:number = MONGO_BATCH_SIZE) {
        return this.actionCollection.find({}).limit(limit).batchSize(MONGO_BATCH_SIZE).toArray() as unknown as OsirisActionEntity[];
    }

    public findActionByOsirisId(osirisId: string) {
        return this.actionCollection.findOne({ "indexedInformations.osirisActionId": osirisId }) as unknown as (OsirisActionEntity | null);
    }

    public findActionByCompteAssoId(compteAssoId: string) {
        return this.actionCollection.findOne({ "indexedInformations.compteAssoId": compteAssoId }) as unknown as (OsirisActionEntity | null);
    }


    public findActionsByCompteAssoId(compteAssoId: string) {
        return this.actionCollection.find({ "indexedInformations.compteAssoId": compteAssoId }).toArray();
    }
}

const osirisRepository: OsirisRepository = new OsirisRepository();

export default osirisRepository;