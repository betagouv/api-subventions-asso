import type { AmountsVsProgramRegionDto } from "dto";
export type PartialAmountsVsProgramRegionDto = Partial<AmountsVsProgramRegionDto> & {
    montant: number;
    exerciceBudgetaire: number;
};

export type PartialAmountsVsProgramRegionFormatted = PartialAmountsVsProgramRegionDto & { montant: string };

export enum AMOUNTS_VS_PROGRAM_REGION_ENUM {
    REGION_ATTACHEMENT_COMPTABLE = "regionAttachementComptable",
    PROGRAMME = "programme",
    EXERCICE = "exerciceBudgetaire",
    MONTANT = "montant",
    MISSION = "mission",
}
