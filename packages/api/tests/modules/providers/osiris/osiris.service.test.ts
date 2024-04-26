import associationNameService from "../../../../src/modules/association-name/associationName.service";
import IOsirisActionsInformations from "../../../../src/modules/providers/osiris/@types/IOsirisActionsInformations";
import IOsirisEvaluationsInformations from "../../../../src/modules/providers/osiris/@types/IOsirisEvaluationsInformations";
import IOsirisRequestInformations from "../../../../src/modules/providers/osiris/@types/IOsirisRequestInformations";
import OsirisActionEntity from "../../../../src/modules/providers/osiris/entities/OsirisActionEntity";
import OsirisEvaluationEntity from "../../../../src/modules/providers/osiris/entities/OsirisEvaluationEntity";
import OsirisRequestEntity from "../../../../src/modules/providers/osiris/entities/OsirisRequestEntity";
import osirisService, { OsirisService } from "../../../../src/modules/providers/osiris/osiris.service";
import { osirisRequestRepository } from "../../../../src/modules/providers/osiris/repositories";
import ProviderValueAdapter from "../../../../src/shared/adapters/ProviderValueAdapter";

describe("OsirisService", () => {
    it("should return an instance of osirisService", () => {
        expect(osirisService).toBeInstanceOf(OsirisService);
    });

    describe("requests part", () => {
        describe("addRequest", () => {
            it("should return the added osiris request", async () => {
                const entity = new OsirisRequestEntity(
                    { siret: "SIRET", rna: "RNA", name: "NAME" },
                    {
                        osirisId: "OSIRISID",
                        compteAssoId: "COMPTEASSOID",
                        ej: "",
                        amountAwarded: 0,
                        dateCommission: new Date(),
                    } as IOsirisRequestInformations,
                    {},
                    undefined,
                    [],
                );
                expect((await osirisService.addRequest(entity)).result).toMatchObject(entity);
            });

            it("should return the updated osiris request", async () => {
                const entity = new OsirisRequestEntity(
                    { siret: "SIRET", rna: "RNA", name: "NAME" },
                    {
                        osirisId: "OSIRISID",
                        compteAssoId: "COMPTEASSOID",
                        ej: "",
                        amountAwarded: 0,
                        dateCommission: new Date(),
                    } as IOsirisRequestInformations,
                    {},
                    undefined,
                    [],
                );
                await osirisService.addRequest(entity);
                const result = await osirisService.addRequest(entity);
                expect(result.result).toMatchObject(entity);
                expect(result.state).toBe("updated");
            });
        });

        describe("findBySiret", () => {
            const entity = new OsirisRequestEntity(
                { siret: "FAKE_SIRET", rna: "RNA", name: "NAME" },
                {
                    osirisId: "FAKE_ID_2",
                    compteAssoId: "COMPTEASSOID",
                    ej: "",
                    amountAwarded: 0,
                    dateCommission: new Date(),
                } as IOsirisRequestInformations,
                {},
                undefined,
                [],
            );

            beforeEach(async () => {
                await osirisService.addRequest(entity);
            });

            it("should return request", async () => {
                expect(await osirisService.findBySiret("FAKE_SIRET")).toMatchObject([entity]);
            });

            it("should return action without evaluation", async () => {
                await osirisService.addAction(
                    new OsirisActionEntity(
                        {
                            osirisActionId: "FAKE_ACTION_ID",
                            compteAssoId: "COMPTEASSOID",
                        } as IOsirisActionsInformations,
                        {},
                        undefined,
                    ),
                );
                const osirisActions = (await osirisService.findBySiret("FAKE_SIRET"))[0]
                    .actions as OsirisActionEntity[];
                const actual = osirisActions[0];
                const expected = {
                    indexedInformations: {
                        osirisActionId: "FAKE_ACTION_ID",
                        compteAssoId: "COMPTEASSOID",
                    },
                    data: {},
                    evaluation: null,
                };
                expect(actual).toMatchObject(expected);
            });

            it("should return action with evaluation", async () => {
                await osirisService.addAction(
                    new OsirisActionEntity(
                        {
                            osirisActionId: "FAKE_ACTION_ID",
                            compteAssoId: "COMPTEASSOID",
                        } as IOsirisActionsInformations,
                        {},
                        undefined,
                    ),
                );
                await osirisService.addEvaluation(
                    new OsirisEvaluationEntity(
                        {
                            osirisActionId: "FAKE_ACTION_ID",
                            siret: "FAKE_SIRET",
                            evaluation_resultat: "",
                            cout_total_realise: 2000,
                        } as IOsirisEvaluationsInformations,
                        {},
                    ),
                );
                const osirisActions = (await osirisService.findBySiret("FAKE_SIRET"))[0]
                    .actions as OsirisActionEntity[];
                const actual = osirisActions[0];
                const expected = {
                    indexedInformations: {
                        osirisActionId: "FAKE_ACTION_ID",
                        compteAssoId: "COMPTEASSOID",
                    },
                    data: {},
                    evaluation: {
                        indexedInformations: {},
                        data: {},
                    },
                };
                expect(actual).toMatchObject(expected);
            });
        });

        describe("findByRna", () => {
            const entity = new OsirisRequestEntity(
                { siret: "FAKE_SIRET", rna: "FAKE_RNA", name: "NAME" },
                {
                    osirisId: "FAKE_ID_2",
                    compteAssoId: "COMPTEASSOID",
                    ej: "",
                    amountAwarded: 0,
                    dateCommission: new Date(),
                } as IOsirisRequestInformations,
                {},
                undefined,
                [],
            );

            beforeEach(async () => {
                await osirisService.addRequest(entity);
            });

            it("should return request", async () => {
                expect(await osirisService.findByRna("FAKE_RNA")).toMatchObject([entity]);
            });
        });
    });

    describe("actions part", () => {
        describe("add", () => {
            it("should return the added osiris action", async () => {
                const entity = new OsirisActionEntity(
                    {
                        osirisActionId: "OSIRISID",
                        compteAssoId: "COMPTEASSOID",
                    } as IOsirisActionsInformations,
                    {},
                    undefined,
                );
                const expected = await osirisService.addAction(entity);
                expect(entity).toMatchObject(expected.result);
            });

            it("should return the updated osiris action", async () => {
                const entity = new OsirisActionEntity(
                    {
                        osirisActionId: "OSIRISID",
                        compteAssoId: "COMPTEASSOID",
                    } as IOsirisActionsInformations,
                    {},
                    undefined,
                );
                await osirisService.addAction(entity);
                const expected = await osirisService.addAction(entity);
                expect(entity).toMatchObject({ ...expected.result, _id: undefined });
                expect(expected.state).toBe("updated");
            });
        });
    });

    describe("evaluation part", () => {
        describe("validEvaluation()", () => {
            it("should return a message if action ID is invalid", () => {
                const evaluation = new OsirisEvaluationEntity(
                    {
                        osirisActionId: "W&-",
                        siret: "WRONG_SIRET",
                        evaluation_resultat: "",
                        extractYear: 2022,
                    },
                    {},
                );
                const expected = {
                    message: `INVALID OSIRIS ACTION ID FOR ${evaluation.indexedInformations.osirisActionId}`,
                    data: evaluation.data,
                };
                const actual = osirisService.validEvaluation(evaluation);
                expect(actual).toMatchObject(expected);
            });

            it("should return a message if siret is invalid", () => {
                const evaluation = new OsirisEvaluationEntity(
                    {
                        osirisActionId: "FAKE_OSIRIS_ID",
                        siret: "WRONG_SIRET",
                        evaluation_resultat: "",
                        extractYear: 2022,
                    },
                    {},
                );
                const expected = {
                    message: `INVALID SIRET FOR ${evaluation.indexedInformations.siret}`,
                    data: evaluation.data,
                };
                const actual = osirisService.validEvaluation(evaluation);
                expect(actual).toMatchObject(expected);
            });

            it("should return a message if evaluation result is empty", () => {
                const evaluation = new OsirisEvaluationEntity(
                    {
                        osirisActionId: "FAKE_OSIRIS_ID",
                        siret: "01234567891112",
                        evaluation_resultat: "",
                        extractYear: 2022,
                    },
                    {},
                );
                const expected = {
                    message: `INVALID EVALUATION RESULTAT FOR ${evaluation.indexedInformations.evaluation_resultat}`,
                    data: evaluation.data,
                };
                const actual = osirisService.validEvaluation(evaluation);
                expect(actual).toMatchObject(expected);
            });

            it("should return true if valid", () => {
                const evaluation = new OsirisEvaluationEntity(
                    {
                        osirisActionId: "FAKE_OSIRIS_ID",
                        siret: "01234567891112",
                        evaluation_resultat: "FAKE_RESULT",
                        extractYear: 2022,
                    },
                    {},
                );
                const actual = osirisService.validEvaluation(evaluation);
                expect(actual).toBeTruthy();
            });
        });

        describe("addEvaluation", () => {
            it("should return the added osiris evaluation", async () => {
                const expected = new OsirisEvaluationEntity(
                    {
                        osirisActionId: "FAKE_OSIRISID",
                        siret: "01234567891112",
                        evaluation_resultat: "",
                        cout_total_realise: 2000,
                    } as IOsirisEvaluationsInformations,
                    {},
                );
                const actual = await osirisService.addEvaluation(expected);
                expect(actual.result).toMatchObject(expected);
                expect(actual.state).toBe("created");
            });

            it("should return the updated osiris action", async () => {
                const expected = new OsirisEvaluationEntity(
                    {
                        osirisActionId: "FAKE_OSIRISID",
                        siret: "01234567891112",
                        evaluation_resultat: "",
                        cout_total_realise: 2000,
                    } as IOsirisEvaluationsInformations,
                    {},
                );
                await osirisService.addEvaluation(expected);
                const actual = await osirisService.addEvaluation(expected);
                expect(actual.result).toMatchObject(expected);
                expect(actual.state).toBe("updated");
            });
        });
    });

    describe("Etablisesement part", () => {
        const now = new Date(Date.UTC(2022, 0));
        const toPVs = (value: unknown, provider = "Osiris") =>
            ProviderValueAdapter.toProviderValues(value, provider, now);

        const entity = new OsirisRequestEntity(
            { siret: "12345678900000", rna: "RNA", name: "NAME" },
            {
                osirisId: "FAKE_ID_2",
                compteAssoId: "COMPTEASSOID",
                ej: "",
                amountAwarded: 0,
                dateCommission: new Date(),
                extractYear: 2022,
            } as IOsirisRequestInformations,
            {},
            undefined,
            [],
        );

        beforeEach(async () => {
            await osirisService.addRequest(entity);
        });

        describe("getEtablissementsBySiret", () => {
            it("should return one demande", async () => {
                const expected = [
                    {
                        siret: toPVs("12345678900000"),
                        nic: toPVs("00000"),
                    },
                ];

                const actual = await osirisService.getEtablissementsBySiret("12345678900000");
                expect(actual).toMatchObject(expected);
            });
        });
        describe("getEtablissementsBySiren", () => {
            it("should return one demande", async () => {
                const expected = [
                    {
                        siret: toPVs("12345678900000"),
                        nic: toPVs("00000"),
                    },
                ];

                const actual = await osirisService.getEtablissementsBySiren("123456789");
                expect(actual).toMatchObject(expected);
            });
        });
    });

    describe("Association part", () => {
        const now = new Date(Date.UTC(2022, 0));
        const toPVs = (value: unknown, provider = "Osiris") =>
            ProviderValueAdapter.toProviderValues(value, provider, now);

        const entity = new OsirisRequestEntity(
            { siret: "12345678900000", rna: "W1234567", name: "NAME" },
            {
                osirisId: "FAKE_ID_2",
                compteAssoId: "COMPTEASSOID",
                ej: "",
                amountAwarded: 0,
                dateCommission: new Date(),
                extractYear: 2022,
            } as IOsirisRequestInformations,
            {},
            undefined,
            [],
        );

        beforeEach(async () => {
            await osirisService.addRequest(entity);
        });

        describe("getAssociationsBySiret", () => {
            it("should return one demande", async () => {
                const expected = [
                    {
                        siren: toPVs("123456789"),
                        rna: toPVs("W1234567"),
                        etablisements_siret: toPVs(["12345678900000"]),
                    },
                ];

                const actual = await osirisService.getAssociationsBySiret("12345678900000");
                expect(actual).toMatchObject(expected);
            });
        });
        describe("getAssociationsBySiren", () => {
            it("should return one demande", async () => {
                const expected = [
                    {
                        siren: toPVs("123456789"),
                        rna: toPVs("W1234567"),
                        etablisements_siret: toPVs(["12345678900000"]),
                    },
                ];

                const actual = await osirisService.getAssociationsBySiren("123456789");
                expect(actual).toMatchObject(expected);
            });
        });
    });
});
