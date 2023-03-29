import Store from "../../../core/Store";

import { modal, data } from "../../../store/modal.store";
import SubventionInfoModal from "@components/SubventionsVersementsDashboard/Modals/SubventionInfoModal.svelte";
import SubventionsAdapter from "@resources/subventions/subventions.adapter";

const SERVICE_INSTRUCTEUR_LABEL = "Service instructeur";
const DISPOSITIF_LABEL = "Dispositif";
const INTITULE_ACTION_LABEL = "Intitulé de l'action";
const MONTANT_DEMANDE_LABEL = "Montant demandé";
const MONTANT_ACCORDER_LABEL = "Montant accordé";

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
            element.subvention ? Object.values(SubventionsAdapter.toSubvention(element.subvention, false)) : null
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

    sort(column) {
        this.sortColumn = column;
        this.columnDataViews.update(columnDataViews => this.updateColumnDataViews(columnDataViews));
    }

    buildColumnDataViews() {
        const columnsName = {
            "subvention.service_instructeur": "Service instructeur",
            "subvention.dispositif": "Dispositif",
            "subvention.project-name": "Intitulé de l'action",
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

            const tableData = SubventionsAdapter.toSubvention(element.subvention);

            return {
                ...tableData,
                subvention: element.subvention,
                projectNamePosition: tableData.projectName === "-" ? "center" : "start",
                hasMoreInfo: !!(element.subvention.actions_proposee?.length || 0)
            };
        });

        this.elementsDataViews.set(elementsDataViews);
    }

    onRowClick(elementData) {
        if (!elementData?.hasMoreInfo) return;
        data.update(() => ({ subvention: elementData.subvention }));
        modal.update(() => SubventionInfoModal);
    }
}
