import type { AmountsVsProgramRegionDto } from "dto";
export type PartialAmountsVsProgramRegionDto = Partial<AmountsVsProgramRegionDto> & {
    montant: number;
    exerciceBudgetaire: number;
};

export type PartialAmountsVsProgramRegionFormatted = Partial<AmountsVsProgramRegionDto> & {
    montant: string;
    exerciceBudgetaire: number;
};

export enum VARS_AMOUNTS_VS_PROGRAM_REGION {
    REGION_ATTACHEMENT_COMPTABLE = "regionAttachementComptable",
    PROGRAMME = "programme",
    EXERCICE = "exerciceBudgetaire",
    MONTANT = "montant",
    MISSION = "mission",
}
