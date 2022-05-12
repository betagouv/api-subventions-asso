import { ProviderEnum } from '../../../@enums/ProviderEnum';
import { Siren } from "@api-subventions-asso/dto";
import Provider from '../@types/IProvider';
import EntrepriseSirenEntity from "./entities/EntrepriseSirenEntity";
import entrepriseSirenRepository from "./repositories/entreprise_siren.repository";

export class DataGouvService implements Provider {
    provider = {
        name: "Base Sirene des entreprises et de leurs établissements (data.gouv.fr)",
        type: ProviderEnum.raw,
        description: "Fichier StockUniteLegale récupéré au préalable sur data.gouv.fr : stock des entreprises (ensemble des entreprises actives et cessées dans leur état courant au répertoire)."
    }

    insertManyEntrepriseSiren(entities: EntrepriseSirenEntity[], dropedDb = false) {
        return entrepriseSirenRepository.insertMany(entities, dropedDb);
    }

    replaceEntrepriseSirenCollection() {
        return entrepriseSirenRepository.replaceCollection();
    }

    async sirenIsEntreprise(siren: Siren) {
        return !!( await entrepriseSirenRepository.findOne(siren));
    }
}

const dataGouvService = new DataGouvService();

export default dataGouvService;