import Store from "$lib/core/Store";
import type AssociationEntity from "$lib/resources/associations/entities/AssociationEntity";
import type { SimplifiedEstablishment } from "$lib/resources/establishments/types/establishment.types";
import { currentAssociation, currentAssoSimplifiedEtabs } from "$lib/store/association.store";

export class EstablishmentsController {
    associationStore: Store<AssociationEntity>;
    establishmentsStore: Store<SimplifiedEstablishment[]>;
    filteredEstablishments: Store<SimplifiedEstablishment[]>;
    visibleEstablishments: Store<SimplifiedEstablishment[]> = new Store([]);
    totalPages: Store<number> = new Store(1);
    currentPage: Store<number> = new Store(1);

    static MAX_ESTABLISHMENTS_BY_PAGE = 9;

    constructor() {
        this.associationStore = currentAssociation as Store<AssociationEntity>;
        this.establishmentsStore = currentAssoSimplifiedEtabs;
        this.filteredEstablishments = new Store(currentAssoSimplifiedEtabs.value);
        this.establishmentsStore.subscribe(() => this.onEstablishementsUpdated());
        this.currentPage.subscribe(() => {
            this.renderPage();
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
        console.log(visibleEstablishments);
        this.visibleEstablishments.set(visibleEstablishments);
    }

    changePage() {
        this.renderPage();
    }
}
