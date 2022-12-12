import { isSiret } from "../../helpers/validatorHelper";

import subventionsService from "../../resources/subventions/subventions.service";
import versementsService from "../../resources/versements/versements.service";

import { mapSubventionsAndVersements, sortByPath } from "./helper";
import Store from "../../core/Store";

export default class SubventionsVersementsDashboardController {
    constructor(identifier) {
        this.identifier = identifier;

        this.loaderStateStore = new Store({
            status: "loading",
            percent: 0
        });

        this._fullElements = [];
        this._versements = [];

        this.exercices = [];
        this.exercicesOptions = new Store([]);

        this.selectedExercice = new Store(null);
        this.selectedYear = new Store(0);

        this.elements = new Store([]);
        this.sortDirection = new Store("asc");
        this.sortColumn = new Store(null);
    }

    async load() {
        const getSubventionsStore = this._getSubventionsStoreFactory();
        const getVersements = this._getVersementsFactory();

        const subventionsStore = getSubventionsStore(this.identifier);
        this._versements = await getVersements(this.identifier);

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
    }

    updateSelectedExercice(selectedExercice) {
        this.selectedExercice.set(selectedExercice);
        this.selectedYear.set(this.exercices[selectedExercice]);
        this._filterElementsBySelectedExercice();
    }

    _filterElementsBySelectedExercice() {
        const filteredElement = this._fullElements.filter(element => element.year === this.selectedYear.value);
        this.elements.set(filteredElement);
    }

    _onSubventionsStoreUpdate(state) {
        this.loaderStateStore.set(this._buildLoadState(state));
        this._fullElements = mapSubventionsAndVersements({
            subventions: state.subventions,
            versements: this._versements
        });

        const computedExercices = [...new Set(this._fullElements.map(element => element.year))].sort((a, b) => a - b);

        this._updateExercices(computedExercices);
    }

    _updateExercices(exercices) {
        this.exercices = exercices;
        this.exercicesOptions.set(this._buildExercices());

        if (this.selectedExercice.value) return;

        this.updateSelectedExercice(this.exercices.length - 1);
    }

    _buildExercices() {
        return this.exercices.map((year, i) => ({ value: i, label: `Exercice ${year} (année civile)` }));
    }

    _buildLoadState(state) {
        return {
            status: state.status === "close" ? "end" : "loading",
            percent: (state.__meta__.providerAnswers / state.__meta__.providerCalls) * 100
        };
    }

    _buildSortPath(column) {
        const [object, firstAttribute, ...rest] = column.split(".");
        const specificPathIndex = {
            centreFinancier: "[0].centreFinancier",
            date: "lastDate",
            montant: "amount",
            "project-name": "actions_proposee[0].intitule"
        };

        return [object, specificPathIndex[firstAttribute] || [firstAttribute, ...rest]]
            .flat()
            .filter(part => part) // remove undefined
            .join(".");
    }

    _getSubventionsStoreFactory() {
        return isSiret(this.identifier)
            ? subventionsService.getEtablissementsSubventionsStore
            : subventionsService.getAssociationsSubventionsStore;
    }

    _getVersementsFactory() {
        return isSiret(this.identifier)
            ? versementsService.getEtablissementVersements
            : versementsService.getAssociationVersements;
    }
}
