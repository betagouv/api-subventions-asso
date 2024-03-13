import { onDestroy } from "svelte";
import type { Unsubscriber } from "svelte/store";
import Store from "$lib/core/Store";
import type AssociationEntity from "$lib/resources/associations/entities/AssociationEntity";
import type { SimplifiedEstablishment } from "$lib/resources/establishments/types/establishment.types";
import { currentAssociation, currentAssoSimplifiedEtabs } from "$lib/store/association.store";

export class EstablishmentsController {
    associationStore: Store<AssociationEntity>;
    establishmentsStore: Store<SimplifiedEstablishment[]>;
    filteredEstablishments = new Store<SimplifiedEstablishment[]>([]);
    visibleEstablishments = new Store<SimplifiedEstablishment[]>([]);
    totalPages = new Store(1);
    currentPage = new Store(1);
    init = true;
    unsubscribes: Unsubscriber[] = [];

    static MAX_ESTABLISHMENTS_BY_PAGE = 9;

    constructor() {
        this.associationStore = currentAssociation as Store<AssociationEntity>;
        // used to expose it to the component and avoid importing store twice
        this.establishmentsStore = currentAssoSimplifiedEtabs;
        this.subscribeStores();
    }

    get title() {
        const nbEstablishments = this.establishmentsStore.value.length;
        let specificity = "établissement rattaché";
        if (nbEstablishments > 1) specificity = "établissements rattachés";
        return `${nbEstablishments} ${specificity} à cette association`;
    }

    subscribeStores() {
        this.unsubscribes = [
            this.establishmentsStore.subscribe(estabs => {
                this.filteredEstablishments.set(estabs);
                this.onEstablishementsUpdated();
            }),
            this.currentPage.subscribe(() => {
                // we don't want to listen to the initialization of currentPage
                // first render must be called from establishmentsStore's update
                if (this.init) {
                    this.init = false;
                } else {
                    this.renderPage();
                }
            }),
        ];

        onDestroy(() => {
            this.unsubscribes.map(unsubscribe => unsubscribe());
        });
    }

    onFilter(filter) {
        this.filteredEstablishments.set(this.filterEstablishments(filter));
        this.setTotalPages();
        this.renderPage();
    }

    private filterEstablishments(filter) {
        return this.establishmentsStore.value.filter(
            estab => estab.adresse?.code_postal?.startsWith(filter) || estab.siret.includes(filter),
        );
    }

    resetFilter() {
        this.filteredEstablishments.set(this.establishmentsStore.value);
        this.setTotalPages();
        this.renderPage();
    }

    onEstablishementsUpdated() {
        this.setTotalPages();
        this.renderPage();
    }

    setTotalPages() {
        this.totalPages.set(
            Math.ceil(this.filteredEstablishments.value.length / EstablishmentsController.MAX_ESTABLISHMENTS_BY_PAGE),
        );
    }

    renderPage() {
        const page = this.currentPage.value;

        const visibleEstablishments = this.filteredEstablishments.value.slice(
            EstablishmentsController.MAX_ESTABLISHMENTS_BY_PAGE * (page - 1),
            EstablishmentsController.MAX_ESTABLISHMENTS_BY_PAGE * page,
        );
        this.visibleEstablishments.set(visibleEstablishments);
    }

    changePage() {
        this.renderPage();
    }
}
