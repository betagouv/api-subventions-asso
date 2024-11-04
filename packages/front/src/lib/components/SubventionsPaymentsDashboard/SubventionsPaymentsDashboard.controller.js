import Store from "../../core/Store";
import { mapSubventionsAndPayments, sortByPath } from "./helper";
import paymentsService from "$lib/resources/payments/payments.service";
import subventionsService from "$lib/resources/subventions/subventions.service";
import { isSiret } from "$lib/helpers/identifierHelper";
import trackerService from "$lib/services/tracker.service";
import { PUBLIC_PROVIDER_BLOG_URL } from "$env/static/public";
import documentHelper from "$lib/helpers/document.helper";
import establishmentService from "$lib/resources/establishments/establishment.service";
import associationService from "$lib/resources/associations/association.service";

export default class SubventionsPaymentsDashboardController {
    constructor(identifier) {
        this.identifier = identifier;

        this.loaderStateStore = new Store({
            status: "loading",
            percent: 0,
        });

        this._fullElements = [];
        this._payments = [];

        this.exercices = [];
        this.exercicesOptions = new Store([]);

        this.selectedExercice = new Store(null);
        this.selectedYear = new Store(0);

        this.elements = new Store([]);
        this.sortDirection = new Store("asc");
        this.sortColumn = new Store(null);

        this.isExtractLoading = new Store(false);
    }

    get providerBlogUrl() {
        return PUBLIC_PROVIDER_BLOG_URL;
    }

    get notFoundMessage() {
        const defaultContent = "Nous sommes désolés, nous n'avons trouvé aucune donnée pour cet établissement";
        if (this.exercicesOptions.value.length) return `${defaultContent} sur l'année ${this.selectedYear.value}`;
        else return defaultContent;
    }

    isEtab() {
        return isSiret(this.identifier);
    }

    async load() {
        const getSubventionsStore = this._getSubventionsStoreFactory();
        const getPayments = this._getPaymentsFactory();

        const subventionsStore = getSubventionsStore(this.identifier);
        this._payments = await getPayments(this.identifier);

        subventionsStore.subscribe(state => this._onSubventionsStoreUpdate(state));
    }

    sort(column) {
        if (this.sortColumn.value !== column) {
            this.sortColumn.set(column);
            this.sortDirection.set("asc");
            this.elements.update(elements => sortByPath(elements, this._buildSortPath(column)));
        } else {
            this.sortDirection.update(currentDirection => (currentDirection == "asc" ? "desc" : "asc"));
            this.elements.update(elements => elements.reverse());
        }

        trackerService.buttonClickEvent(
            "association-etablissement.dashbord.sort-column",
            `${column} direction: ${this.sortDirection.value}`,
        );
    }

    updateSelectedExercice(selectedExercice, disableTracker) {
        if (!disableTracker)
            trackerService.buttonClickEvent(
                "association-etablissement.dashbord.selected-exercice",
                `old: ${this.selectedExercice.value}  -  new: ${selectedExercice}`,
            );
        this.selectedExercice.set(selectedExercice);
        this.selectedYear.set(this.exercices[selectedExercice]);
        this._filterElementsBySelectedExercice();
    }

    clickProviderLink() {
        trackerService.trackEvent("association-etablissement.dashboard.display-provider-modal");
    }

    async download() {
        if (this.isExtractLoading.value) return;
        trackerService.buttonClickEvent("association-etablissement.dashbord.download-csv", this.identifier); // tracking
        this.isExtractLoading.set(true);
        const resourceService = isSiret(this.identifier) ? establishmentService : associationService;
        await resourceService.getGrantExtract(this.identifier).then(({ blob, filename }) => {
            documentHelper.download(blob, filename);
        });
        this.isExtractLoading.set(false);
    }

    _filterElementsBySelectedExercice() {
        const filteredElement = this._fullElements.filter(element => element.year === this.selectedYear.value);
        this.elements.set(filteredElement);
    }

    _onSubventionsStoreUpdate(state) {
        this.loaderStateStore.set(this._buildLoadState(state));
        this._fullElements = mapSubventionsAndPayments({
            subventions: state.subventions,
            payments: this._payments || [],
        });

        const computedExercices = [...new Set(this._fullElements.map(element => element.year))].sort((a, b) => a - b);

        // only update selected exercice if we have at least one fetched from SSE at this point
        if (!computedExercices.length) return;
        this._updateExercices(computedExercices);
    }

    _updateExercices(exercices) {
        this.exercices = exercices;
        this.exercicesOptions.set(this._buildExercices());

        this.updateSelectedExercice(this.selectedExercice.value || this.exercices.length - 1, true);
    }

    _buildExercices() {
        return this.exercices.map((year, i) => ({ value: i, label: `Exercice ${year} (année civile)` }));
    }

    _buildLoadState(state) {
        return {
            status: state.status === "close" ? "end" : "loading",
            percent: (state.__meta__.providerAnswers / state.__meta__.providerCalls) * 100,
        };
    }

    _buildSortPath(column) {
        const [object, firstAttribute, ...rest] = column.split(".");
        const specificPathIndex = {
            centreFinancier: "[0].centreFinancier",
            date: "lastDate",
            montant: "amount",
            "project-name": "actions_proposee[0].intitule",
        };

        return [object, specificPathIndex[firstAttribute] || [firstAttribute, ...rest]]
            .flat()
            .filter(part => part) // remove undefined
            .join(".");
    }

    _getSubventionsStoreFactory() {
        return this.isEtab()
            ? subventionsService.getEtablissementsSubventionsStore.bind(subventionsService)
            : subventionsService.getAssociationsSubventionsStore.bind(subventionsService);
    }

    _getPaymentsFactory() {
        return this.isEtab() ? paymentsService.getEtablissementPayments : paymentsService.getAssociationPayments;
    }
}
