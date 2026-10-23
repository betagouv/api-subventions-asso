import DauphinSubventionDto from "../../../../src/modules/providers/dauphin-gispro/dto/DauphinSubventionDto";
import GisproEntity from "../../../../src/modules/providers/dauphin-gispro/@types/GisproEntity";

export const DAUPHIN_ENTITIES = [
    {
        exerciceBudgetaire: 2022,
        demandeur: { SIRET: { complet: "01234567890123", SIREN: "012345678" } },
        codeActionProjet: "12345678",
        reference: "12345678",
        intituleProjet: "projet1 - titre",
        periode: "PLURIANNUELLE",
        dateDemande: "2021-12-07",
        thematique: { title: "thematique - titre" },
        virtualStatusLabel: "Justifiée",
        description: { value: "description d'une première action" },
        planFinancement: [
            {
                current: true,
                recette: {
                    postes: [
                        {
                            reference: "74",
                            sousPostes: [
                                {
                                    reference: "74etat",
                                    lignes: [
                                        {
                                            dispositifEligible: true,
                                            montant: { ht: 4200 },
                                            financement: {
                                                financeur: { typeFinanceur: "FINANCEURPRIVILEGIE", titre: "ville" },
                                                montantVote: { ht: 4000 },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            },
        ],
        updateDate: new Date("2025-07-07"),
    },
    {
        exerciceBudgetaire: 2022,
        demandeur: { SIRET: { complet: "01234567890123", SIREN: "012345678" } },
        codeActionProjet: "87654321",
        reference: "87654321",
        intituleProjet: "projet2 - titre",
        periode: "PLURIANNUELLE",
        dateDemande: "2021-12-07",
        thematique: { title: "thematique - titre" },
        virtualStatusLabel: "Justifiée",
        description: { value: "description d'une première action" },
        planFinancement: [
            {
                current: true,
                recette: {
                    postes: [
                        {
                            reference: "74",
                            sousPostes: [
                                {
                                    reference: "74etat",
                                    lignes: [
                                        {
                                            dispositifEligible: true,
                                            montant: { ht: 4200 },
                                            financement: {
                                                financeur: { typeFinanceur: "FINANCEURPRIVILEGIE", titre: "ville" },
                                                montantVote: { ht: 4000 },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            },
        ],
        updateDate: new Date("2025-07-07"),
    },
] as Partial<DauphinSubventionDto>[];

export const GISPRO_ENTITIES = [
    {
        ej: "ej",
        codeActionDossier: "12345678",
        codeProjet: "projet",
        siret: "01234567890123",
        directionGestionnaire: "gestionnaire",
        exercise: 2022,
    },
    {
        ej: "ej",
        codeActionDossier: "87654321",
        codeProjet: "projet",
        siret: "01234567890123",
        directionGestionnaire: "gestionnaire",
        exercise: 2022,
    },
] as GisproEntity[];
