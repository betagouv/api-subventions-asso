import type { AmountsVsProgramRegionDto } from "dto";
import Store from "$lib/core/Store";

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

    constructor() {
        this.selectedColumns = new Store([VARS.PROGRAMME, VARS.REGION_ATTACHEMENT_COMPTABLE]);
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

    public getTableData(
        data: AmountsVsProgramRegionDto[],
        selectedColumns: string[],
    ): PartialAmountsVsProgramRegionFormatted[] {
        const temp = this._groupAndSum(data, selectedColumns);
        return this._formatData(temp);
    }

    public getHeaders(selectedColumns: string[]): string[] {
        return [
            this.headersMapping[VARS.EXERCICE],
            ...selectedColumns.map(col => this.headersMapping[col]),
            this.headersMapping[VARS.MONTANT],
        ];
    }
}
