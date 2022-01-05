import db from "../../../shared/MongoConnection";
import { MONGO_BATCH_SIZE } from "../../../configurations/mongo.conf";
import { FindOneAndUpdateOptions } from "mongodb";
import OsirisFolderEntity from "../entities/OsirisFoldersEntity";
import OsirisActionEntity from "../entities/OsirisActionEntity";

export class OsirisRepository {
    private readonly folderCollection = db.collection<OsirisFolderEntity>("osiris-folder");
    private readonly actionCollection = db.collection<OsirisActionEntity>("osiris-action");

    // Folder Part
    public async addFolder(osirisFolder: OsirisFolderEntity) {
        await this.folderCollection.insertOne(osirisFolder);
        return this.findFolderByOsirisId(osirisFolder.folder.osirisId) as OsirisFolderEntity;
    }

    public async updateFolder(osirisFolder: OsirisFolderEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        return (await this.folderCollection.findOneAndUpdate({ 
            folder: { osirisId: osirisFolder.folder.osirisId } 
        },
        { $set: osirisFolder }, options)).value as OsirisFolderEntity;
    }
    
    public async findAllFolders(limit:number = MONGO_BATCH_SIZE) {
        return this.folderCollection.find({}).limit(limit).batchSize(MONGO_BATCH_SIZE).toArray() as unknown as OsirisFolderEntity[];
    }

    public findFolderByOsirisId(osirisId: string) {
        return this.folderCollection.findOne({ "folder.osirisId": osirisId }) as unknown as (OsirisFolderEntity | null);
    }

    public findFolderBySiret(siret: string) {
        return this.folderCollection.findOne({
            "association.siret": siret
        });
    }

    public findFolderByRna(rna: string) {
        return this.folderCollection.findOne({
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