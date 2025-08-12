import dauphinPort from "../../../src/dataProviders/db/providers/dauphin/dauphin.port";
import gisproPort from "../../../src/dataProviders/db/providers/gispro.port";
import DauphinSubventionDto from "../../../src/modules/providers/dauphin-gispro/dto/DauphinSubventionDto";
import GisproEntity from "../../../src/modules/providers/dauphin-gispro/@types/GisproEntity";
import applicationFlatPort from "../../../src/dataProviders/db/applicationFlat/applicationFlat.port";
import DauphinCli from "../../../src/interfaces/cli/Dauphin.cli";

describe("Dauphin cli", () => {
    // there are other methods but that are not meant to be used a lot anymore since
    // dauphin data is switched to osiris provider

    describe("initApplicationFlat", () => {
        const cli = new DauphinCli();
        const ENTITY1 = {
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
        } as Partial<DauphinSubventionDto>;

        const ENTITY2 = {
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
        } as Partial<DauphinSubventionDto>;
        const GISPRO1 = {
            ej: "ej",
            codeActionDossier: "12345678",
            codeProjet: "projet",
            siret: "01234567890123",
            directionGestionnaire: "gestionnaire",
            exercise: 2022,
        } as GisproEntity;
        const GISPRO2 = {
            ej: "ej",
            codeActionDossier: "87654321",
            codeProjet: "projet",
            siret: "01234567890123",
            directionGestionnaire: "gestionnaire",
            exercise: 2022,
        } as GisproEntity;

        it("saves adapted simple dauphin data", async () => {
            await dauphinPort.upsert({ dauphin: ENTITY1 as DauphinSubventionDto });
            await gisproPort.insertMany([GISPRO1]);
            await cli.initApplicationFlat();
            const actual = await applicationFlatPort.findAll();
            expect(actual).toMatchSnapshot();
        });

        it("groups actions of same application", async () => {
            await dauphinPort.upsert({ dauphin: ENTITY1 as DauphinSubventionDto });
            await dauphinPort.upsert({ dauphin: ENTITY2 as DauphinSubventionDto });
            await gisproPort.insertMany([GISPRO1, GISPRO2]);
            await cli.initApplicationFlat();
            const actual = await applicationFlatPort.findAll();
            expect(actual).toMatchSnapshot();
        });

        it("filters out other allocators than expected", async () => {
            const biggerPlanFinancement = [
                {
                    current: true,
                    recette: {
                        postes: [
                            {
                                reference: "74", // good
                                sousPostes: [
                                    {
                                        reference: "74etat",
                                        lignes: [
                                            {
                                                // good typeFinanceur
                                                dispositifEligible: true,
                                                montant: { ht: 1200 },
                                                financement: {
                                                    financeur: { typeFinanceur: "FINANCEURPRIVILEGIE", titre: "ville" },
                                                    montantVote: { ht: 1000 },
                                                },
                                            },
                                            {
                                                // other good typeFinanceur
                                                dispositifEligible: true,
                                                montant: { ht: 1200 },
                                                financement: {
                                                    financeur: {
                                                        typeFinanceur: "FINANCEURPRIVILEGIE",
                                                        titre: "région",
                                                    },
                                                    montantVote: { ht: 1000 },
                                                },
                                            },
                                            {
                                                // bad typeFinanceur
                                                dispositifEligible: true,
                                                montant: { ht: 1200 },
                                                financement: {
                                                    financeur: { typeFinanceur: "PETITFINANCEUR", titre: "ville" },
                                                    montantVote: { ht: 1000 },
                                                },
                                            },
                                        ],
                                    }, // good
                                    {
                                        reference: "74other", // bad
                                        lignes: [
                                            {
                                                dispositifEligible: true,
                                                montant: { ht: 1200 },
                                                financement: {
                                                    financeur: { typeFinanceur: "FINANCEURPRIVILEGIE", titre: "ville" },
                                                    montantVote: { ht: 1000 },
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                reference: "75", // bad
                                sousPostes: [
                                    {
                                        reference: "75other",
                                        lignes: [
                                            {
                                                dispositifEligible: true,
                                                montant: { ht: 1200 },
                                                financement: {
                                                    financeur: { typeFinanceur: "FINANCEURPRIVILEGIE", titre: "ville" },
                                                    montantVote: { ht: 1000 },
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                },
            ];
            await dauphinPort.upsert({
                dauphin: { ...ENTITY1, planFinancement: biggerPlanFinancement } as DauphinSubventionDto,
            });
            await gisproPort.insertMany([GISPRO1]);
            await cli.initApplicationFlat();
            const actual = await applicationFlatPort.findAll();
            expect(actual).toMatchSnapshot();
        });

        it("keeps action-level dauphin data if nothing is found from gispro", async () => {
            await dauphinPort.upsert({ dauphin: ENTITY1 as DauphinSubventionDto });
            await dauphinPort.upsert({ dauphin: ENTITY2 as DauphinSubventionDto });
            await cli.initApplicationFlat();
            const actual = await applicationFlatPort.findAll();
            expect(actual).toMatchSnapshot();
        });

        it("keeps action-level dauphin data if several records are found from gispro", async () => {
            await dauphinPort.upsert({ dauphin: ENTITY1 as DauphinSubventionDto });
            await dauphinPort.upsert({ dauphin: ENTITY2 as DauphinSubventionDto });
            await gisproPort.insertMany([GISPRO1, { ...GISPRO1, ej: "autreEJ" }]);

            await cli.initApplicationFlat();
            const actual = await applicationFlatPort.findAll();
            expect(actual).toMatchSnapshot();
        });
    });
});
