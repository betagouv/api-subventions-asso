import { Siren } from "../../../@types/Siren";
import EntrepriseSirenEntity from "./entities/EntrepriseSirenEntity";
import entrepriseSirenRepository from "./repositories/entreprise_siren.repository";

export class DataGouvService {
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