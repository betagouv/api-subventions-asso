import { Siren } from "dto";
import { MongoServerError } from "mongodb";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import associationNameService from "../../association-name/associationName.service";
import ProviderCore from "../ProviderCore";
import EntrepriseSirenEntity from "./entities/EntrepriseSirenEntity";
import entrepriseSirenRepository from "./repositories/entreprise_siren.repository";
import HistoryImportEntity from "./entities/HistoryImportEntity";
import historyImportRepository from "./repositories/historyImport.repository";

export class DataGouvService extends ProviderCore {
    constructor() {
        super({
            name: "Base Sirene - DataGouv",
            type: ProviderEnum.raw,
            id: "data_gouv_base_sirene",
            description:
                "Fichier StockUniteLegale récupéré au préalable sur data.gouv.fr : stock des entreprises (ensemble des entreprises actives et cessées dans leur état courant au répertoire).",
        });
        associationNameService.setProviderScore(this.provider.name, 1);
    }

    async insertManyEntrepriseSiren(entities: EntrepriseSirenEntity[]) {
        if (!entities.length) return;
        try {
            const result = await entrepriseSirenRepository.insertMany(entities);
            return result;
        } catch (error: unknown) {
            if (error instanceof MongoServerError && error.code === "E11000") return; // One or many entities already exist in database but other entities have been saved

            throw error;
        }
    }

    async sirenIsEntreprise(siren: Siren) {
        return !!(await entrepriseSirenRepository.findOne(siren));
    }

    addNewImport(entity: HistoryImportEntity) {
        return historyImportRepository.add(entity);
    }

    async getLastDateImport() {
        const result = await historyImportRepository.findLastImport();

        if (!result) return null;

        return result.dateOfFile;
    }
}

const dataGouvService = new DataGouvService();

export default dataGouvService;
