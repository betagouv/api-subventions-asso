import OsirisActionEntity from "./entities/OsirisActionEntity";
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

    public async addAction(action: OsirisActionEntity): Promise<{state: string, result: OsirisActionEntity}> {
        const existingAction = await osirisRepository.findActionByOsirisId(action.folder.osirisId);
        if (existingAction) {
            return {
                state: "updated",
                result: await osirisRepository.updateAction(action),
            };
        }

        return {
            state: "created",
            result: await osirisRepository.addAction(action),
        };
    }

    public findAllFolders() {
        return osirisRepository.findAllFolders();
    }

    public findFolderBySiret(siret: string) {
        return osirisRepository.findFolderBySiret(siret);
    }

    public findFolderByRna(rna: string) {
        return osirisRepository.findFolderByRna(rna);
    }

    public findAllAction() {
        return osirisRepository.findAllActions();
    }

    public findActionsBySiret(siret: string) {
        return osirisRepository.findActionsBySiret(siret);
    }

    public findActionsByRna(rna: string) {
        return osirisRepository.findActionsByRna(rna);
    }
}

const osirisService: OsirisService = new OsirisService();

export default osirisService;