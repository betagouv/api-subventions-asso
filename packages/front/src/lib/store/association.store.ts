import type { Siret } from "dto";
import Store from "$lib/core/Store";
import type { SimplifiedEstablishment } from "$lib/resources/establishments/types/establishment.types";
import type { Association } from "$lib/resources/associations/types/association.types";

export const currentAssociation = new Store<Association | undefined>(undefined);
export const currentAssoSimplifiedEtabs = new Store<SimplifiedEstablishment[]>([]);

export const mapSiretPostCodeStore = new Store(new Map<Siret, string | undefined>()); // store necessary ?
currentAssoSimplifiedEtabs.subscribe(establishments => {
    const map = mapSiretPostCodeStore.value;
    establishments.forEach(establishment =>
        map.set(establishment.siret?.toString(), establishment.adresse?.code_postal),
    );
    mapSiretPostCodeStore.set(map);
});
