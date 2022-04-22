import { Siren } from "../../../@types/Siren";
import Provider from '../@types/Provider';
import EntrepriseSirenEntity from "./entities/EntrepriseSirenEntity";
import entrepriseSirenRepository from "./repositories/entreprise_siren.repository";

export class DataGouvService implements Provider {
    providerName = "API DATA GOUV";

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