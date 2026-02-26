import { SiretDto } from "dto";

export interface SimplifiedJoinedDauphinGispro {
    _id: {
        siretDemandeur: string | undefined;
        exerciceBudgetaire: number;
        codeDossierOrAction: string;
    };

    siretDemandeur: SiretDto | undefined;
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
