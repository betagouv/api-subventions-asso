import db from "../../../shared/MongoConnection";
import { MONGO_BATCH_SIZE } from "../../../configurations/mongo.conf";
import { FindOneAndUpdateOptions } from "mongodb";
import OsirisFileEntity from "../entities/OsirisFileEntity";
import OsirisActionEntity from "../entities/OsirisActionEntity";

export class OsirisRepository {
    private readonly fileCollection = db.collection<OsirisFileEntity>("osiris-files");
    private readonly actionCollection = db.collection<OsirisActionEntity>("osiris-actions");

    // File Part
    public async addFile(osirisFile: OsirisFileEntity) {
        await this.fileCollection.insertOne(osirisFile);
        return this.findFileByOsirisId(osirisFile.file.osirisId) as OsirisFileEntity;
    }

    public async updateFile(osirisFile: OsirisFileEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        return (await this.fileCollection.findOneAndUpdate({ 
            file: { osirisId: osirisFile.file.osirisId } 
        },
        { $set: osirisFile }, options)).value as OsirisFileEntity;
    }
    
    public async findAllFiles(limit:number = MONGO_BATCH_SIZE) {
        return this.fileCollection.find({}).limit(limit).batchSize(MONGO_BATCH_SIZE).toArray() as unknown as OsirisFileEntity[];
    }

    public findFileByOsirisId(osirisId: string) {
        return this.fileCollection.findOne({ "file.osirisId": osirisId }) as unknown as (OsirisFileEntity | null);
    }

    public findFilesBySiret(siret: string) {
        return this.fileCollection.find({
            "association.siret": siret
        }).toArray();
    }

    public findFilesByRna(rna: string) {
        return this.fileCollection.find({
            "association.rna": rna
        }).toArray();
    }

    // Action Part
    public async addAction(osirisAction: OsirisActionEntity) {
        await this.actionCollection.insertOne(osirisAction);
        return this.findActionByOsirisId(osirisAction.file.osirisId) as OsirisActionEntity;
    }

    public async updateAction(osirisAction: OsirisActionEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        return (await this.actionCollection.findOneAndUpdate({ 
            file: { osirisId: osirisAction.file.osirisId } 
        },
        { $set: osirisAction }, options)).value as OsirisActionEntity;
    }
    
    public async findAllActions(limit:number = MONGO_BATCH_SIZE) {
        return this.actionCollection.find({}).limit(limit).batchSize(MONGO_BATCH_SIZE).toArray() as unknown as OsirisActionEntity[];
    }

    public findActionByOsirisId(osirisId: string) {
        return this.actionCollection.findOne({ "file.osirisId": osirisId }) as unknown as (OsirisActionEntity | null);
    }

    public findActionsBySiret(siret: string) {
        return this.actionCollection.find({
            "beneficiaryAssociation.siret": siret
        }).toArray();
    }

    public findActionsByRna(rna: string) {
        return this.actionCollection.find({
            "beneficiaryAssociation.rna": rna
        }).toArray();
    }
}

const osirisRepository: OsirisRepository = new OsirisRepository();

export default osirisRepository;