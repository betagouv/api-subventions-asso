import { ProviderEnum } from '../../../@enums/ProviderEnum';
import { Siren } from "../../../@types/Siren";
import Provider from '../@types/IProvider';
import EntrepriseSirenEntity from "./entities/EntrepriseSirenEntity";
import entrepriseSirenRepository from "./repositories/entreprise_siren.repository";

export class DataGouvService implements Provider {
    provider = {
        name: "API SIRENE données ouvertes + API Répertoire des Associations (RNA)",
        type: ProviderEnum.api,
        description: "L'API SIRENE données ouvertes est une API qui a été créée par la Dinum et s'appuie sur les données publiées en open data par l'INSEE sur les entreprises sur data.gouv. L'API RNA est une API portée par la Dinum exposant les données publiées en open data par le RNA sur data.gouv."
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