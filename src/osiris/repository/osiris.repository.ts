import db from "../../shared/MongoConnection";
import OsirisFolderEntity from "../entities/OsirisFoldersEntity";
import { MONGO_BATCH_SIZE } from "../../configurations/mongo.conf";
import { FindOneAndUpdateOptions } from "mongodb";

export class OsirisRepository {
    private readonly folderCollection = db.collection<OsirisFolderEntity>("osiris-folder");

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
}

const osirisRepository: OsirisRepository = new OsirisRepository();

export default osirisRepository;