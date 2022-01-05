import OsirisFolderEntity from "./entities/OsirisFoldersEntity";
import osirisRepository from "./repository/osiris.repository";

export class OsirisService {
    public async addFolder(folder: OsirisFolderEntity): Promise<{state: string, result: OsirisFolderEntity}> {
        const existingFolder = await osirisRepository.findFolderByOsirisId(folder.folder.osirisId);
        if (existingFolder) {
            return {
                state: "updated",
                result: await osirisRepository.updateFolder(folder),
            };
        }

        return {
            state: "created",
            result: await osirisRepository.addFolder(folder),
        };
    }

    public findAll() {
        return osirisRepository.findAll();
    }

    public findBySiret(siret: string) {
        return osirisRepository.findFolderBySiret(siret);
    }

    public findByRna(rna: string) {
        return osirisRepository.findFolderByRna(rna);
    }
}

const osirisService: OsirisService = new OsirisService();

export default osirisService;