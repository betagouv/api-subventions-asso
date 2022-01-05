import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisFileEntity from "./entities/OsirisFileEntity";
import osirisRepository from "./repository/osiris.repository";

export class OsirisService {
    public async addFile(folder: OsirisFileEntity): Promise<{state: string, result: OsirisFileEntity}> {
        const existingFile = await osirisRepository.findFileByOsirisId(folder.folder.osirisId);
        if (existingFile) {
            return {
                state: "updated",
                result: await osirisRepository.updateFile(folder),
            };
        }

        return {
            state: "created",
            result: await osirisRepository.addFile(folder),
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

    public findAllFiles() {
        return osirisRepository.findAllFiles();
    }

    public findFileBySiret(siret: string) {
        return osirisRepository.findFileBySiret(siret);
    }

    public findFileByRna(rna: string) {
        return osirisRepository.findFileByRna(rna);
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