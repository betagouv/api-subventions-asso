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
        return this.findFileByOsirisId(osirisFile.folder.osirisId) as OsirisFileEntity;
    }

    public async updateFile(osirisFile: OsirisFileEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        return (await this.fileCollection.findOneAndUpdate({ 
            folder: { osirisId: osirisFile.folder.osirisId } 
        },
        { $set: osirisFile }, options)).value as OsirisFileEntity;
    }
    
    public async findAllFiles(limit:number = MONGO_BATCH_SIZE) {
        return this.fileCollection.find({}).limit(limit).batchSize(MONGO_BATCH_SIZE).toArray() as unknown as OsirisFileEntity[];
    }

    public findFileByOsirisId(osirisId: string) {
        return this.fileCollection.findOne({ "folder.osirisId": osirisId }) as unknown as (OsirisFileEntity | null);
    }

    public findFileBySiret(siret: string) {
        return this.fileCollection.findOne({
            "association.siret": siret
        });
    }

    public findFileByRna(rna: string) {
        return this.fileCollection.findOne({
            "association.rna": rna
        });
    }

    // Action Part
    public async addAction(osirisAction: OsirisActionEntity) {
        await this.actionCollection.insertOne(osirisAction);
        return this.findActionByOsirisId(osirisAction.folder.osirisId) as OsirisActionEntity;
    }

    public async updateAction(osirisAction: OsirisActionEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        return (await this.actionCollection.findOneAndUpdate({ 
            folder: { osirisId: osirisAction.folder.osirisId } 
        },
        { $set: osirisAction }, options)).value as OsirisActionEntity;
    }
    
    public async findAllActions(limit:number = MONGO_BATCH_SIZE) {
        return this.actionCollection.find({}).limit(limit).batchSize(MONGO_BATCH_SIZE).toArray() as unknown as OsirisActionEntity[];
    }

    public findActionByOsirisId(osirisId: string) {
        return this.actionCollection.findOne({ "folder.osirisId": osirisId }) as unknown as (OsirisActionEntity | null);
    }

    public findActionsBySiret(siret: string) {
        return this.actionCollection.find({
            "beneficiaryAssociation:.siret": siret
        });
    }

    public findActionsByRna(rna: string) {
        return this.actionCollection.find({
            "beneficiaryAssociation:.rna": rna
        });
    }
}

const osirisRepository: OsirisRepository = new OsirisRepository();

export default osirisRepository;