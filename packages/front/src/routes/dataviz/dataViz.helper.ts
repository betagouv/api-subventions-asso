import type { AmountsVsProgramRegionDto } from "dto";
import { VARS_AMOUNTS_VS_PROGRAM_REGION as VARS } from "./@types/AmountsVsYear.types";
import type { PartialAmountsVsProgramRegionDto } from "./@types/AmountsVsYear.types";

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
};

export const filterYears = (
    groupedData: PartialAmountsVsProgramRegionDto[],
    yearMin: number,
): PartialAmountsVsProgramRegionDto[] => {
    const currentYear = new Date().getFullYear();
    return groupedData.filter(row => row.exerciceBudgetaire >= yearMin && row.exerciceBudgetaire !== currentYear);
};
