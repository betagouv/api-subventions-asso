import db from "../../../../shared/MongoConnection";
import { FindOneAndUpdateOptions, ObjectId } from 'mongodb';
import { MONGO_BATCH_SIZE } from "../../../../configurations/mongo.conf";
import OsirisRequestEntity from '../entities/OsirisRequestEntity';
import { Rna, Siren, Siret } from '@api-subventions-asso/dto';

export class OsirisRequestRepository {
    private readonly collection = db.collection<OsirisRequestEntity>("osiris-requests");

    public async add(osirisRequest: OsirisRequestEntity) {
        await this.collection.insertOne(osirisRequest);
        return this.findByOsirisId(osirisRequest.providerInformations.osirisId) as OsirisRequestEntity;
    }

    public async update(osirisRequest: OsirisRequestEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {_id, ...requestWithoutId } = osirisRequest;
        return (await this.collection.findOneAndUpdate({ 
            "providerInformations.osirisId": osirisRequest.providerInformations.osirisId 
        },
        { $set: requestWithoutId }, options)).value as OsirisRequestEntity;
    }
    
    public async findAll(limit:number = MONGO_BATCH_SIZE) {
        return this.collection.find({}).limit(limit).batchSize(MONGO_BATCH_SIZE).toArray() as unknown as OsirisRequestEntity[];
    }

    public async findByMongoId(id: string): Promise<OsirisRequestEntity | null> {
        return this.collection.findOne({"_id": new ObjectId(id)});
    }

    public findByOsirisId(osirisId: string) {
        return this.collection.findOne({ "providerInformations.osirisId": osirisId }) as unknown as (OsirisRequestEntity | null);
    }

    public findBySiret(siret: Siret) {
        return this.collection.find({
            "legalInformations.siret": siret
        }).toArray();
    }

    public findByRna(rna: Rna) {
        return this.collection.find({
            "legalInformations.rna": rna
        }).toArray();
    }

    public async findBySiren(siren: Siren) {
        return this.collection.find({
            "legalInformations.siret":  new RegExp(`^${siren}\\d{5}`)
        }).toArray();
    }

    public cursorFindRequests(query = {}){
        return this.collection.find(query);
    }
}

const osirisRequestRepository: OsirisRequestRepository = new OsirisRequestRepository();
export default osirisRequestRepository;