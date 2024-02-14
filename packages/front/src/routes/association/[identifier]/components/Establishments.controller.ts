import type AssociationEntity from "$lib/resources/associations/entities/AssociationEntity";
import Store from "$lib/core/Store";
import { currentAssociation, currentAssoSimplifiedEtabs } from "$lib/store/association.store";
import type { SimplifiedEstablishment } from "$lib/resources/establishments/types/establishment.types";

export class EstablishmentsController {
    asso: Store<AssociationEntity>;
    estabs: Store<SimplifiedEstablishment[]>;
    filteredEstabs: Store<SimplifiedEstablishment[]>;

    constructor() {
        this.asso = currentAssociation as Store<AssociationEntity>;
        this.estabs = currentAssoSimplifiedEtabs;
        this.filteredEstabs = new Store(currentAssoSimplifiedEtabs.value);
    }

    onFilter(filter) {
        this.filteredEstabs.set(this.estabs.value.filter(estab => estab.adresse?.code_postal?.startsWith(filter)));
    }

    resetFilter() {
        this.filteredEstabs.set(this.estabs.value);
    }
}
