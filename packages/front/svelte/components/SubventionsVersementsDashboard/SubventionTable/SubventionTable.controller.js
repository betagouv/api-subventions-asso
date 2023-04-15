import Store from "../../../core/Store";

import { modal, data } from "../../../store/modal.store";
import SubventionInfoModal from "@components/SubventionsVersementsDashboard/Modals/SubventionInfoModal.svelte";
import SubventionsAdapter from "@resources/subventions/subventions.adapter";

const SIRET = "Siret";
const SERVICE_INSTRUCTEUR_LABEL = "Service instructeur";
const DISPOSITIF_LABEL = "Dispositif";
const INTITULE_ACTION_LABEL = "Intitulé de l'action";
const MONTANT_DEMANDE_LABEL = "Montant demandé";
const MONTANT_ACCORDE_LABEL = "Montant accordé";
const STATUS_LABEL = "Statut de la demande";

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
            element.subvention ? Object.values(SubventionsAdapter.toSubvention(element)) : null,
        );
    }

    static extractHeaders() {
        return [
            SIRET,
            SERVICE_INSTRUCTEUR_LABEL,
            DISPOSITIF_LABEL,
            INTITULE_ACTION_LABEL,
            MONTANT_DEMANDE_LABEL,
            MONTANT_ACCORDE_LABEL,
            STATUS_LABEL,
        ];
    }

    sort(column) {
        this.sortColumn = column;
        this.columnDataViews.update(columnDataViews => this.updateColumnDataViews(columnDataViews));
    }

    buildColumnDataViews() {
        const columnsName = {
            siret: "Établissement",
            "subvention.service_instructeur": "Service instructeur",
            "subvention.dispositif": "Dispositif",
            "subvention.project-name": "Intitulé de l'action",
            "subvention.montants.demande": "Montant demandé",
            "subvention.statut_label": "Statut de la demande",
        };

        const columnsSize = ["15%", "15%", "15%", "18%", "14%", "28%"];

        this.columnDataViews.set(
            Object.entries(columnsName).map(([name, label], index) => ({
                label,
                name,
                size: columnsSize[index],
                haveAction: name !== "more.info",
                action: () => this.sortMethod(name),
                active: this.sortColumn === name,
            })),
        );
        console.log(this.columnDataViews.value);
    }

    updateColumnDataViews(columnDataViews) {
        columnDataViews.forEach(dataView => (dataView.active = this.sortColumn === dataView.name));
        return columnDataViews;
    }

    updateElements(elements) {
        this.elements = elements;

        const elementsDataViews = this.elements.map(element => {
            if (!element.subvention) return null;

            const tableData = SubventionsAdapter.toSubvention(element);

            return {
                ...tableData,
                subvention: element.subvention,
                projectNamePosition: tableData.projectName === "-" ? "center" : "start",
            };
        });

        this.elementsDataViews.set(elementsDataViews);
    }

    onRowClick(elementData) {
        if (!elementData) return;
        data.update(() => ({
            subvention: elementData.subvention,
            montantDemande: elementData.montantsDemande,
            montantAccorde: elementData.montantsAccorde,
        }));
        modal.update(() => SubventionInfoModal);
    }
}
