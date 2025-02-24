import type { AmountsVsProgramRegionDto } from "dto";
import { filterYears, groupAndSum } from "../../dataViz.helper";
import { VARS_AMOUNTS_VS_PROGRAM_REGION as VARS } from "../../@types/AmountsVsYear.types";
import type {
    PartialAmountsVsProgramRegionDto,
    PartialAmountsVsProgramRegionFormatted,
} from "../../@types/AmountsVsYear.types";
import Store, { derived, ReadStore } from "$lib/core/Store";

export class TableAmountsVsProgramRegionController {
    public headersMapping: Record<string, string> = {
        exerciceBudgetaire: "Exercice",
        programme: "Programme",
        regionAttachementComptable: "Attachement comptable",
        montant: "Montant (EUR)",
    };

    public checkboxOptions: { label: string; value: string }[] = [
        {
            label: this.headersMapping[VARS.REGION_ATTACHEMENT_COMPTABLE],
            value: VARS.REGION_ATTACHEMENT_COMPTABLE,
        },
        {
            label: this.headersMapping[VARS.PROGRAMME],
            value: VARS.PROGRAMME,
        },
    ];

    public selectedColumns: Store<string[]>;

    public elements: AmountsVsProgramRegionDto[];
    public groupedData: ReadStore<PartialAmountsVsProgramRegionFormatted[]>;
    public headers: ReadStore<string[]>;

    constructor(elements: AmountsVsProgramRegionDto[]) {
        this.elements = elements;
        this.selectedColumns = new Store([VARS.PROGRAMME, VARS.REGION_ATTACHEMENT_COMPTABLE]);
        this.headers = derived(this.selectedColumns, selectedColumns => this.getHeaders(selectedColumns));
        this.groupedData = derived(this.selectedColumns, selectedColumns =>
            this.getTableData(this.elements, selectedColumns),
        );
    }

    private _formatData(data: PartialAmountsVsProgramRegionDto[]): PartialAmountsVsProgramRegionFormatted[] {
        return data.map(element => {
            const montant = new Intl.NumberFormat("fr-FR", {
                style: "decimal",
                maximumFractionDigits: 0,
            }).format(element.montant);
            return {
                ...element,
                montant: montant as string,
                exerciceBudgetaire: element.exerciceBudgetaire,
            };
        }) as PartialAmountsVsProgramRegionFormatted[];
    }

    private _sortData(a, b, selectedColumns) {
        // Sort by regionAttachementComptable then by programme then by exerciceBudgetaire

        if (selectedColumns.includes(VARS.REGION_ATTACHEMENT_COMPTABLE)) {
            if (a[VARS.REGION_ATTACHEMENT_COMPTABLE] < b[VARS.REGION_ATTACHEMENT_COMPTABLE]) return -1;
            if (a[VARS.REGION_ATTACHEMENT_COMPTABLE] > b[VARS.REGION_ATTACHEMENT_COMPTABLE]) return 1;
        }

        if (selectedColumns.includes(VARS.PROGRAMME)) {
            if (a[VARS.PROGRAMME] < b[VARS.PROGRAMME]) return -1;
            if (a[VARS.PROGRAMME] > b[VARS.PROGRAMME]) return 1;
        }

        return a.exerciceBudgetaire - b.exerciceBudgetaire;
    }

    public getTableData(
        data: AmountsVsProgramRegionDto[],
        selectedColumns: string[],
    ): PartialAmountsVsProgramRegionFormatted[] {
        const filteredAndGroupedData = filterYears(groupAndSum(data, selectedColumns), 2021);
        return this._formatData(filteredAndGroupedData).sort((a, b) => this._sortData(a, b, selectedColumns));
    }

    public getHeaders(selectedColumns: string[]): string[] {
        return [
            this.headersMapping[VARS.EXERCICE],
            ...selectedColumns.map(col => this.headersMapping[col]),
            this.headersMapping[VARS.MONTANT],
        ];
    }
}
