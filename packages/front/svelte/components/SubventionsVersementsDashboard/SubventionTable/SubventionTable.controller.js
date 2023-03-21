import { ApplicationStatus } from "@api-subventions-asso/dto";
import Store from "../../../core/Store";

import { numberToEuro, valueOrHyphen } from "@helpers/dataHelper";
import { capitalizeFirstLetter } from "@helpers/textHelper";
import { trim } from "@helpers/stringHelper";

const SERVICE_INSTRUCTEUR_LABEL = "Service instructeur";
const DISPOSITIF_LABEL = "Dispositif";
const INTITULE_ACTION_LABEL = "Intitulé de l'action";
const MONTANT_DEMANDE_LABEL = "Montant demandé";
const MONTANT_ACCORDER_LABEL = "Montant accordé";

const MAX_CHAR_SIZE = 53;

export default class SubventionTableController {
    constructor(sortMethod) {
        this.sortMethod = sortMethod;

        this.elements = [];
        this.sortColumn = null;

        this.elementsDataViews = new Store([]);
        this.columnDataViews = new Store([]);

        this.buildColumnDataViews();
    }

    // extract Table data to build CSV
    static extractRows(elements) {
        return elements.map(element =>
            element.subvention ? Object.values(this._extractTableDataFromElement(element, false)) : null
        );
    }

    static extractHeaders() {
        return [
            SERVICE_INSTRUCTEUR_LABEL,
            DISPOSITIF_LABEL,
            INTITULE_ACTION_LABEL,
            MONTANT_DEMANDE_LABEL,
            MONTANT_ACCORDER_LABEL
        ];
    }

    static _extractTableDataFromElement(element, trimValue = true) {
        const sizedTrim = value => (value ? trim(value, MAX_CHAR_SIZE) : value);

        let dispositif = element.subvention.dispositif;
        if (trimValue && dispositif) dispositif = sizedTrim(dispositif);

        let serviceInstructeur = element.subvention.service_instructeur;
        if (trimValue && serviceInstructeur) serviceInstructeur = sizedTrim(serviceInstructeur);

        return {
            serviceInstructeur: valueOrHyphen(serviceInstructeur),
            dispositif: valueOrHyphen(dispositif),
            projectName: valueOrHyphen(this.getProjectName(element.subvention)),
            montantsDemande: valueOrHyphen(numberToEuro(element.subvention.montants?.demande)),
            montantsAccorde: numberToEuro(element.subvention.montants?.accorde),
            status: element.subvention.statut_label,
            showAmount:
                element.subvention.statut_label === ApplicationStatus.GRANTED && element.subvention.montants?.accorde
        };
    }

    static getProjectName(subvention) {
        if (!subvention.actions_proposee || !subvention.actions_proposee.length) return;

        let names = subvention.actions_proposee
            .sort((actionA, actionB) => actionA.rang - actionB.rang)
            .map(action => `${capitalizeFirstLetter(action.intitule)}.`.replace("..", "."));

        names = [...new Set(names)].join("-");

        names = trim(names, MAX_CHAR_SIZE);

        return names;
    }

    sort(column) {
        this.sortColumn = column;
        this.columnDataViews.update(columnDataViews => this.updateColumnDataViews(columnDataViews));
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

        const elementsDataViews = this.elements.map(element => {
            if (!element.subvention) return null;

            const tableData = SubventionTableController._extractTableDataFromElement(element);

            return {
                ...tableData,
                subvention: element.subvention,
                projectNamePosition: tableData.projectName === "-" ? "center" : "start",
                enableButtonMoreInfo: !!(element.subvention.actions_proposee?.length || 0)
            };
        });

        this.elementsDataViews.set(elementsDataViews);
    }
}
