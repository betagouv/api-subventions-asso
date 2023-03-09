import Store from "../../../core/Store";

import { numberToEuro, valueOrHyphen } from "../../../helpers/dataHelper";
import { withTwoDigitYear } from "../../../helpers/dateHelper";
import { getLastVersementsDate } from "../helper";

const MONTANT_VERSE_LABEL = "Montant versé";
const CENTRE_FINANCIER_LABEL = "Centre financier";
const DATE_VERSEMENT_LABEL = "Date du versement";

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

    // extract Table data to build CSV
    static extractRows(elements) {
        return elements.map(element => (element.versements ? this._extractTableDataFromElement(element, true) : null));
    }

    static extractHeaders() {
        return [MONTANT_VERSE_LABEL, CENTRE_FINANCIER_LABEL, DATE_VERSEMENT_LABEL];
    }

    // extract main versement data that are displayed in the Table
    static _extractTableDataFromElement(element, onlyValues = false) {
        const data = {
            totalAmount: numberToEuro(VersementTableController.countTotalVersement(element.versements)),
            centreFinancier: valueOrHyphen(element.versements[0]?.centreFinancier),
            lastVersementDate: valueOrHyphen(withTwoDigitYear(getLastVersementsDate(element.versements)))
        };

        if (onlyValues) return Object.values(data);
        return data;
    }

    static countTotalVersement(versements) {
        return versements.reduce((acc, versement) => acc + versement.amount, 0);
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
                ...VersementTableController._extractTableDataFromElement(element),
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
            "versements.centreFinancier": CENTRE_FINANCIER_LABEL,
            "versements.date": DATE_VERSEMENT_LABEL
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
