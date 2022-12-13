import Store from "../../../core/Store";

import { numberToEuro, valueOrHyphen } from "../../../helpers/dataHelper";
import { capitalizeFirstLetter } from "../../../helpers/textHelper";
import { trim } from "../../../helpers/stringHelper";

export default class SubventionTableController {
    MAX_CHAR_SIZE = 53;

    constructor(sortMethod) {
        this.sortMethod = sortMethod;

        this.elements = [];
        this.sortColumn = null;

        this.elementsDataViews = new Store([]);
        this.columnDataViews = new Store([]);

        this.buildColumnDataViews();
    }

    sort(column) {
        this.sortColumn = column;
        this.columnDataViews.update(columnDataViews => this.updateColumnDataViews(columnDataViews));
    }

    getProjectName(subvention) {
        if (!subvention.actions_proposee || !subvention.actions_proposee.length) return;

        let names = subvention.actions_proposee
            .sort((actionA, actionB) => actionA.rang - actionB.rang)
            .map(action => `${capitalizeFirstLetter(action.intitule)}.`.replace("..", "."));

        names = [...new Set(names)].join("-");

        names = trim(names, this.MAX_CHAR_SIZE);

        return names;
    }

    buildColumnDataViews() {
        const columnsName = {
            "subvention.service_instructeur": "Service instructeur",
            "subvention.dispositif": "Dispositif",
            "subvention.project-name": "Intitulé de l'action",
            "more.info": "Plus d'infos",
            "subvention.montants.demande": "Montant demandé",
            "subvention.montants.accorde": "Montant accordé"
        };

        this.columnDataViews.set(
            Object.entries(columnsName).map(([name, label]) => ({
                label,
                name,
                haveAction: name !== "more.info",
                action: () => this.sortMethod(name),
                active: this.sortColumn === name
            }))
        );
    }

    updateColumnDataViews(columnDataViews) {
        columnDataViews.forEach(dataView => (dataView.active = this.sortColumn === dataView.name));
        return columnDataViews;
    }

    updateElements(elements) {
        this.elements = elements;

        const sizedTrim = value => trim(value, this.MAX_CHAR_SIZE);
        const elementsDataViews = this.elements.map(element => {
            if (!element.subvention) return null;

            const projectName = valueOrHyphen(this.getProjectName(element.subvention));

            return {
                subvention: element.subvention,
                serviceInstructeur: sizedTrim(element.subvention.service_instructeur),
                dispositif: valueOrHyphen(sizedTrim(element.subvention.dispositif)),
                projectName: projectName,
                projectNamePosition: projectName === "-" ? "center" : "start",
                enableButtonMoreInfo: !!(element.subvention.actions_proposee?.length || 0),
                montantsDemande: valueOrHyphen(numberToEuro(element.subvention.montants?.demande)),
                montantsAccordeOrStatus: element.subvention.montants?.accorde
                    ? numberToEuro(element.subvention.montants?.accorde)
                    : element.subvention.status
            };
        });

        this.elementsDataViews.set(elementsDataViews);
    }
}
