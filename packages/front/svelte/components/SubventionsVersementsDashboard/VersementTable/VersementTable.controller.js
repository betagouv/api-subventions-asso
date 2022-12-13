import Store from "../../../core/Store";

import { numberToEuro, valueOrHyphen } from "../../../helpers/dataHelper";
import { withTwoDigitYear } from "../../../helpers/dateHelper";
import { getLastVersementsDate } from "../helper";

export class VersementTableController {
    constructor(sortMethod) {
        this.sortMethod = sortMethod;

        this.elements = [];
        this.sortColumn = [];

        this.elementsDataViews = new Store([]);
        this.columnDataViews = new Store([]);
        this.noVersements = new Store(false);

        this.buildColumnDataViews();
    }

    _countTotal(versements) {
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
            if (!element.versements) return null;

            return {
                versements: element.versements,
                versementsModal: element.versements.map(this.buildVersementsModal),
                totalAmount: numberToEuro(this._countTotal(element.versements)),
                centreFinancier: valueOrHyphen(element.versements[0]?.centreFinancier),
                lastVersementDate: valueOrHyphen(withTwoDigitYear(getLastVersementsDate(element.versements)))
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
            "versements.montant": "Montant versé",
            "versements.centreFinancier": "Centre financier",
            "versements.date": "Date du versement"
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
