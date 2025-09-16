import { SiretDto } from "dto";
import type { ProviderDataEntity } from "../../../../@types/ProviderData";

export interface SimplifiedJoinedDauphinGispro extends ProviderDataEntity {
    siretDemandeur: SiretDto;
    exerciceBudgetaire: number;

    montantDemande: number;
    montantAccorde?: number;

    referenceAdministrative: string[];
    intituleProjet: string[];
    thematique: string[];
    financeurs: string[];
    description: string[];
    instructorService: string[];

    periode: ("PONCTUELLE" | "PLURIANNUELLE")[];
    virtualStatusLabel: string[];
    ej: string[];

    dateDemande: Date[];
    codeDossier: string;
}
