import Store from "$lib/core/Store";
import type { SimplifiedEstablishment } from "$lib/resources/establishments/types/establishment.types";

export class EstablishmentsController {
    visibleEstablishments: Store<SimplifiedEstablishment[]> = new Store([]);
    totalPage: Store<number> = new Store(1);
    currentPage: Store<number> = new Store(1);

    static MAX_ESTABLISHMENTS_BY_PAGE = 9;

    constructor(private establishmentsStore: Store<SimplifiedEstablishment[]>) {
        this.establishmentsStore.subscribe(() => this.onEstablishementsUpdated());

        this.currentPage.subscribe(() => {
            this.renderPage();
        });
    }

    onEstablishementsUpdated() {
        this.totalPage.set(
            Math.ceil(this.establishmentsStore.value.length / EstablishmentsController.MAX_ESTABLISHMENTS_BY_PAGE),
        );
        this.currentPage.set(1);

        this.renderPage();
    }

    renderPage() {
        const page = this.currentPage.value;

        const visibleEstablishments = this.establishmentsStore.value.slice(
            EstablishmentsController.MAX_ESTABLISHMENTS_BY_PAGE * (page - 1),
            EstablishmentsController.MAX_ESTABLISHMENTS_BY_PAGE * page,
        );
        this.visibleEstablishments.set(visibleEstablishments);
    }

    changePage() {
        this.renderPage();
    }
}
