import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisFileEntity from "./entities/OsirisFileEntity";
import osirisRepository from "./repository/osiris.repository";

export class OsirisService {
    public async addFile(file: OsirisFileEntity): Promise<{state: string, result: OsirisFileEntity}> {
        const existingFile = await osirisRepository.findFileByOsirisId(file.file.osirisId);
        if (existingFile) {
            return {
                state: "updated",
                result: await osirisRepository.updateFile(file),
            };
        }

        return {
            state: "created",
            result: await osirisRepository.addFile(file),
        };
    }

    public async addAction(action: OsirisActionEntity): Promise<{state: string, result: OsirisActionEntity}> {
        const existingAction = await osirisRepository.findActionByOsirisId(action.file.osirisId);
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

    public findFilesBySiret(siret: string) {
        return osirisRepository.findFilesBySiret(siret);
    }

    public findFilesByRna(rna: string) {
        return osirisRepository.findFilesByRna(rna);
    }

    public findAllActions() {
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