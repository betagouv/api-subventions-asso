import Store from "../../../core/Store";

import { numberToEuro, valueOrHyphen } from "../../../helpers/dataHelper";
import { withTwoDigitYear } from "../../../helpers/dateHelper";
import VersementsAdapter from "@resources/versements/versements.adapter";

const MONTANT_VERSE_LABEL = "Montant versé";
const CENTRE_FINANCIER_LABEL = "Centre financier";
const DATE_VERSEMENT_LABEL = "Date du versement";
const BOP_LABEL = "BOP";

export default class VersementTableController {
    constructor(sortMethod) {
        this.sortMethod = sortMethod;
        this.elements = [];
        this.sortColumn = [];

        this.elementsDataViews = new Store([]);
        this.columnDataViews = new Store([]);
        this.noVersements = new Store(false);

        this.buildColumnDataViews();
    }

    // extract values from versement table
    static extractRows(elements) {
        return elements.map(element =>
            element.versements ? Object.values(VersementsAdapter.toVersement(element.versements)) : null
        );
    }

    // Order is important to respect VersementsAdapter.toVersement() format
    // TODO: enhance this and make a mapper header - versement property ?
    static extractHeaders() {
        return [MONTANT_VERSE_LABEL, CENTRE_FINANCIER_LABEL, DATE_VERSEMENT_LABEL, BOP_LABEL];
    }

    _countVersements() {
        return this.elements.filter(e => e.versements?.length).length;
    }

    sort(column) {
        this.sortColumn = column;
        this.columnDataViews.update(columnDataViews => this.updateColumnDataViews(columnDataViews));
    }

    updateElements(elements) {
        this.elements = elements;

        const elementsDataViews = this.elements.map(element => {
            if (element.versements.length === 0) return null;

            return {
                ...VersementsAdapter.toVersement(element.versements),
                versements: element.versements,
                versementsModal: element.versements.map(this.buildVersementsModal)
            };
        });

        this.elementsDataViews.set(elementsDataViews);
        this.noVersements.set(!this._countVersements());
    }

    buildVersementsModal(versement) {
        return {
            amount: numberToEuro(versement.amount),
            domaineFonctionnel: valueOrHyphen(versement.domaineFonctionnel),
            activitee: valueOrHyphen(versement.activitee),
            centreFinancier: valueOrHyphen(versement.centreFinancier),
            date: withTwoDigitYear(new Date(versement.dateOperation)).slice(0, 8)
        };
    }

    buildColumnDataViews() {
        const columnsName = {
            "versements.montant": MONTANT_VERSE_LABEL,
            "versements.date": DATE_VERSEMENT_LABEL,
            "versements.bop": BOP_LABEL
        };

        this.columnDataViews.set(
            Object.entries(columnsName).map(([name, label]) => ({
                label,
                name,
                action: () => this.sortMethod(name),
                active: this.sortColumn === name
            }))
        );
    }

    updateColumnDataViews(columnDataViews) {
        columnDataViews.forEach(dataView => (dataView.active = this.sortColumn === dataView.name));
        return columnDataViews;
    }
}
