import subventionsPort from "./subventions.port";
import { mapSiretPostCodeStore } from "$lib/store/association.store";
import { derived } from "$lib/core/Store";

export class SubventionsService {
    getEtablissementsSubventionsStore(identifier) {
        const initialStore = subventionsPort.getEtablissementSubventionsStore(identifier);
        return this._addEstablishmentPostCode(initialStore);
    }

    getAssociationsSubventionsStore(identifier) {
        const initialStore = subventionsPort.getAssociationSubventionsStore(identifier);
        return this._addEstablishmentPostCode(initialStore);
    }

    _addEstablishmentPostCode(initialStore) {
        const store = derived(initialStore, data => {
            data.subventions.forEach(subvention => {
                subvention.establishment_postcode = mapSiretPostCodeStore.value
                    .get(subvention.siret?.toString())
                    ?.replace(/(\d{2})(\d{3})/, "$1 $2");
            });
            return data;
        });
        return store;
    }
}

const subventionsService = new SubventionsService();

export default subventionsService;
