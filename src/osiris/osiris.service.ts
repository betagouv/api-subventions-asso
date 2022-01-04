import OsirisFolderEntity from "./entities/OsirisFoldersEntity";

export class OsirisService {
    public addFolder(folder: OsirisFolderEntity) {
        // Save folder in DB
        console.log(folder);

        return folder;
    }
}

const osirisService: OsirisService = new OsirisService();

export default osirisService;