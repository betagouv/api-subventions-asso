import { onDestroy } from "svelte";
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
    isLoading = true;

    static MAX_ESTABLISHMENTS_BY_PAGE = 9;

    constructor() {
        this.associationStore = currentAssociation as Store<AssociationEntity>;
        // used to expose it to the component and avoid importing store twice
        this.establishmentsStore = currentAssoSimplifiedEtabs;
        this.subscribeStores();
    }

    get nbEstabInActivity() {
        return this.establishmentsStore.value.filter(estab => estab.ouvert).length;
    }

    get title() {
        const nbEstablishments = this.establishmentsStore.value.length;
        let specificityEtab = "établissement";
        let specificityOpen = "ouvert";
        if (nbEstablishments > 1) {
            specificityEtab = "établissements";
            specificityOpen = "ouverts";
        }
        return `Cette association possède ${nbEstablishments} ${specificityEtab} dont ${this.nbEstabInActivity} ${specificityOpen}`;
    }

    subscribeStores() {
        const unsubscribes = [
            this.establishmentsStore.subscribe(estabs => {
                this.filteredEstablishments.set(estabs);
                this.onEstablishementsUpdated();
            }),
            this.currentPage.subscribe(() => {
                // we don't want to listen to the initialization of currentPage
                // first render must be called from establishmentsStore's update
                if (this.isLoading) {
                    this.isLoading = false;
                } else {
                    this.renderPage();
                }
            }),
        ];

        onDestroy(() => {
            unsubscribes.map(unsubscribe => unsubscribe());
        });
    }

    onFilter(filter) {
        this.filteredEstablishments.set(this.filterEstablishments(filter));
        this.setTotalPages();
        this.renderPage();
    }

    private filterEstablishments(filter) {
        return this.establishmentsStore.value.filter(
            estab => estab.adresse?.code_postal?.startsWith(filter) || estab.nic.includes(filter),
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
