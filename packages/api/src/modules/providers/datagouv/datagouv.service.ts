import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { Siren } from "@api-subventions-asso/dto";
import Provider from "../@types/IProvider";
import EntrepriseSirenEntity from "./entities/EntrepriseSirenEntity";
import entrepriseSirenRepository from "./repositories/entreprise_siren.repository";
import HistoryImportEntity from "./entities/HistoryImportEntity";
import historyImportRepository from "./repositories/historyImport.repository";

export class DataGouvService implements Provider {
    provider = {
        name: "Base Sirene - DataGouv",
        type: ProviderEnum.raw,
        description:
            "Fichier StockUniteLegale récupéré au préalable sur data.gouv.fr : stock des entreprises (ensemble des entreprises actives et cessées dans leur état courant au répertoire)."
    };

    async insertManyEntrepriseSiren(entities: EntrepriseSirenEntity[]) {
        return entrepriseSirenRepository.insertMany(entities);
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
