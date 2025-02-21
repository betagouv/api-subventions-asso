import type { AmountsVsProgramRegionDto } from "dto";
export type PartialAmountsVsProgramRegionDto = Partial<AmountsVsProgramRegionDto> & {
    montant: number;
    exerciceBudgetaire: number;
};

const VARS = {
    REGION_ATTACHEMENT_COMPTABLE: "regionAttachementComptable",
    PROGRAMME: "programme",
    EXERCICE: "exerciceBudgetaire",
    MONTANT: "montant",
};


export const groupAndSum = (
    data: AmountsVsProgramRegionDto[],
    selectedColumns: string[],
): PartialAmountsVsProgramRegionDto[] => {
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

export const filterYears = (
        groupedData: PartialAmountsVsProgramRegionDto[],
        yearMin: number,
    ): PartialAmountsVsProgramRegionDto[] => {
        const currentYear = new Date().getFullYear();
        return groupedData.filter(row => row.exerciceBudgetaire >= yearMin && row.exerciceBudgetaire !== currentYear);
    }
