import dauphinAdapter from "../../../src/adapters/db/providers/dauphin/dauphin.adapter";
import gisproAdapter from "../../../src/adapters/db/providers/gispro.adapter";
import DauphinSubventionDto from "../../../src/modules/providers/dauphin-gispro/dto/DauphinSubventionDto";
import applicationFlatAdapter from "../../../src/adapters/db/application-flat/application-flat.adapter";
import DauphinCli from "../../../src/interfaces/cli/Dauphin.cli";
import { DAUPHIN_ENTITIES, GISPRO_ENTITIES } from "./__fixtures__/dauphinGispro.fixture";

describe("Dauphin cli", () => {
    // there are other methods but that are not meant to be used a lot anymore since
    // dauphin data is switched to osiris provider
    let cli;

    beforeEach(() => {
        cli = new DauphinCli();
    });

    describe("initApplicationFlat", () => {
        const [ENTITY1, ENTITY2] = DAUPHIN_ENTITIES;
        const [GISPRO1, GISPRO2] = GISPRO_ENTITIES;

        it("saves adapted simple dauphin data", async () => {
            await dauphinAdapter.upsert({ dauphin: ENTITY1 as DauphinSubventionDto });
            await gisproAdapter.insertMany([GISPRO1]);
            await cli.initApplicationFlat();
            const actual = (await applicationFlatAdapter.findAll()).map(flat => ({
                ...flat,
                updateDate: expect.any(Date),
            }));
            expect(actual).toMatchSnapshot();
        });

        it("keeps action-level dauphin data if several records are found from gispro", async () => {
            // for unknown reason mongodb driver sets the same _id for this two documents and fires a DuplicateError
            await gisproAdapter.insertMany([
                // @ts-expect-error: ok
                { ...GISPRO1, _id: "foo" },
                // @ts-expect-error: ok
                { ...GISPRO1, _id: "bar", ej: "autreEJ" },
            ]);
            await dauphinAdapter.upsert({ dauphin: ENTITY1 as DauphinSubventionDto });
            await dauphinAdapter.upsert({ dauphin: ENTITY2 as DauphinSubventionDto });

            await cli.initApplicationFlat();
            const actual = (await applicationFlatAdapter.findAll()).map(flat => ({
                ...flat,
                updateDate: expect.any(Date),
            }));
            expect(actual).toMatchSnapshot();
        });

        it("groups actions of same application", async () => {
            await dauphinAdapter.upsert({ dauphin: ENTITY1 as DauphinSubventionDto });
            await dauphinAdapter.upsert({ dauphin: ENTITY2 as DauphinSubventionDto });
            await gisproAdapter.insertMany([GISPRO1, GISPRO2]);
            await cli.initApplicationFlat();
            const actual = (await applicationFlatAdapter.findAll()).map(flat => ({
                ...flat,
                updateDate: expect.any(Date),
            }));
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
            await dauphinAdapter.upsert({
                dauphin: { ...ENTITY1, planFinancement: biggerPlanFinancement } as DauphinSubventionDto,
            });
            await gisproAdapter.insertMany([GISPRO1]);
            await cli.initApplicationFlat();
            const actual = (await applicationFlatAdapter.findAll()).map(flat => ({
                ...flat,
                updateDate: expect.any(Date),
            }));
            expect(actual).toMatchSnapshot();
        });

        it("keeps action-level dauphin data if nothing is found from gispro", async () => {
            await dauphinAdapter.upsert({ dauphin: ENTITY1 as DauphinSubventionDto });
            await dauphinAdapter.upsert({ dauphin: ENTITY2 as DauphinSubventionDto });
            await cli.initApplicationFlat();
            const actual = (await applicationFlatAdapter.findAll()).map(flat => ({
                ...flat,
                updateDate: expect.any(Date),
            }));
            expect(actual).toMatchSnapshot();
        });
    });
});
