import type { AmountsVsProgramRegionDto } from "dto";
import { elements } from "chart.js";
import Store, { derived, ReadStore } from "$lib/core/Store";

type PartialAmountsVsProgramRegionDto = Partial<AmountsVsProgramRegionDto> & {
    montant: number;
    exerciceBudgetaire: number;
};

type PartialAmountsVsProgramRegionFormatted = Partial<AmountsVsProgramRegionDto> & {
    montant: string;
    exerciceBudgetaire: number;
};

const VARS = {
    REGION_ATTACHEMENT_COMPTABLE: "regionAttachementComptable",
    PROGRAMME: "programme",
    EXERCICE: "exerciceBudgetaire",
    MONTANT: "montant",
};

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

    private _groupAndSum(
        data: AmountsVsProgramRegionDto[],
        selectedColumns: string[],
    ): PartialAmountsVsProgramRegionDto[] {
        const cols = [...selectedColumns, VARS.EXERCICE];
        const temp = data.reduce((acc, row) => {
            const key = cols.map(column => row[column]).join("-");
            if (!acc[key]) {
                acc[key] = cols.reduce((obj, field) => {
                    obj[field] = row[field];
                    return obj;
                }, {});
                acc[key][VARS.MONTANT] = row[VARS.MONTANT];
            } else acc[key][VARS.MONTANT] += row[VARS.MONTANT];
            return acc;
        }, {});
        return Object.values(temp);
    }

    private _filterYears(
        groupedData: PartialAmountsVsProgramRegionDto[],
        yearMin: number,
    ): PartialAmountsVsProgramRegionDto[] {
        const currentYear = new Date().getFullYear();
        return groupedData.filter(row => row.exerciceBudgetaire >= yearMin && row.exerciceBudgetaire !== currentYear);
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
        const filteredAndGroupedData = this._filterYears(this._groupAndSum(data, selectedColumns), 2021);
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
