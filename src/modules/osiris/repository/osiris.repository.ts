import db from "../../../shared/MongoConnection";
import { MONGO_BATCH_SIZE } from "../../../configurations/mongo.conf";
import { FindOneAndUpdateOptions } from "mongodb";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";
import OsirisActionEntity from "../entities/OsirisActionEntity";
import { Siret } from "../../../@types/Siret";
import { Rna } from "../../../@types/Rna";
import { Siren } from "../../../@types/Siren";

export class OsirisRepository {
    private readonly requestCollection = db.collection<OsirisRequestEntity>("osiris-requests");
    private readonly actionCollection = db.collection<OsirisActionEntity>("osiris-actions");

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
        await this.actionCollection.insertOne(osirisAction);
        return this.findActionByOsirisId(osirisAction.indexedInformations.osirisActionId) as OsirisActionEntity;
    }

    public async updateAction(osirisAction: OsirisActionEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {_id, ...actionWithoutId } = osirisAction;
        return (await this.actionCollection.findOneAndUpdate(
            { "indexedInformations.osirisActionId": osirisAction.indexedInformations.osirisActionId },
            { $set: actionWithoutId },
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