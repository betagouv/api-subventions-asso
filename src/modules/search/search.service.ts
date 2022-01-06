import OsirisActionEntity from "../osiris/entities/OsirisActionEntity";
import OsirisFileEntity from "../osiris/entities/OsirisFileEntity";
import osirisService from "../osiris/osiris.service";
import RnaProvider from "./providers/rna.provider";
import SiretProvider from "./providers/siret.provider";

export class SearchService {

    public async getBySiret(siret: string) {
        const files = await osirisService.findFilesBySiret(siret);
        const actions = await osirisService.findActionsBySiret(siret);

        const filesWithActions = files.reduce((acc, file) => {
            const filtredAction = actions.filter(action => action.file.lcaId === file.file.lcaId);
            acc.push({
                file,
                actions: filtredAction
            });
            return acc;
        }, [] as { file: OsirisFileEntity, actions: OsirisActionEntity[]}[]);

        const actionsWithoutFile = actions.reduce((acc, action) => {
            if (files.find(file => action.file.lcaId === file.file.lcaId)) return acc;

            acc.push(action);
            return acc;
        }, [] as OsirisActionEntity[]);

        return {
            osiris: {
                files: filesWithActions,
                actionsWithoutFile
            },
            rna: await RnaProvider.findBySiret(siret),
            siret: await SiretProvider.findBySiret(siret),
        }
    }

    public async getByRna(rna: string) {
        const files = await osirisService.findFilesByRna(rna);
        const actions = await osirisService.findActionsByRna(rna);

        const filesWithActions = files.reduce((acc, file) => {
            const filtredAction = actions.filter(action => action.file.lcaId === file.file.lcaId);
            acc.push({
                file,
                actions: filtredAction
            });
            return acc;
        }, [] as { file: OsirisFileEntity, actions: OsirisActionEntity[]}[]);

        const actionsWithoutFile = actions.reduce((acc, action) => {
            if (files.find(file => action.file.lcaId === file.file.lcaId)) return acc;

            acc.push(action);
            return acc;
        }, [] as OsirisActionEntity[]);

        const fileWithSiret = files.find(file => file.association.siret);
        const siret = fileWithSiret ? fileWithSiret.association.siret : null;

        return {
            osiris: {
                files: filesWithActions,
                actionsWithoutFile
            },
            rna: await RnaProvider.findByRna(rna),
            siret: siret ? await SiretProvider.findBySiret(siret) : null
        }
    }
}

const searchService = new SearchService();

export default searchService;