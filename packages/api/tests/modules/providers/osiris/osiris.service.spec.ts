import IOsirisActionsInformations from "../../../../src/modules/providers/osiris/@types/IOsirisActionsInformations";
import IOsirisRequestInformations from "../../../../src/modules/providers/osiris/@types/IOsirisRequestInformations";
import OsirisActionEntity from "../../../../src/modules/providers/osiris/entities/OsirisActionEntity";
import OsirisRequestEntity from "../../../../src/modules/providers/osiris/entities/OsirisRequestEntity";
import osirisService, { OsirisService } from "../../../../src/modules/providers/osiris/osiris.service";
import ProviderValueAdapter from "../../../../src/shared/adapters/ProviderValueAdapter";
import AssociationIdentifier from "../../../../src/identifierObjects/AssociationIdentifier";
import Rna from "../../../../src/identifierObjects/Rna";
import Siren from "../../../../src/identifierObjects/Siren";
import { ObjectId } from "mongodb";

// TODO ensure this is proper integ test. It is historical test when we did not make a difference

describe("OsirisService", () => {
    it("should return an instance of osirisService", () => {
        expect(osirisService).toBeInstanceOf(OsirisService);
    });

    const SIREN = new Siren("123456789");
    const SIRET = SIREN.toSiret("00000");
    const RNA = new Rna("W123456789");

    const ASSOCIATION_IDENTIFER = AssociationIdentifier.fromSirenAndRna(SIREN, RNA);

    describe("requests part", () => {
        describe("addRequest", () => {
            it("should return the added osiris request", async () => {
                const entity = new OsirisRequestEntity(
                    { siret: SIRET.value, rna: RNA.value, name: "NAME" },
                    {
                        osirisId: "OSIRISID",
                        compteAssoId: "COMPTEASSOID",
                        ej: "",
                        amountAwarded: 0,
                        dateCommission: new Date(),
                        exercise: 2022,
                    } as IOsirisRequestInformations,
                    {},
                    undefined,
                    [],
                );
                expect((await osirisService.addRequest(entity)).result).toMatchObject(entity);
            });

            it("should return the updated osiris request", async () => {
                const entity = new OsirisRequestEntity(
                    { siret: SIRET.value, rna: RNA.value, name: "NAME" },
                    {
                        osirisId: "OSIRISID",
                        compteAssoId: "COMPTEASSOID",
                        ej: "",
                        amountAwarded: 0,
                        dateCommission: new Date(),
                        exercise: 2022,
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

            it("should add new if same id different exercise", async () => {
                const entity = new OsirisRequestEntity(
                    { siret: SIRET.value, rna: RNA.value, name: "NAME" },
                    {
                        osirisId: "OSIRISID",
                        compteAssoId: "COMPTEASSOID",
                        ej: "",
                        amountAwarded: 0,
                        dateCommission: new Date(),
                        exercise: 2022,
                    } as IOsirisRequestInformations,
                    {},
                    undefined,
                    [],
                );
                const entity2 = new OsirisRequestEntity(
                    { siret: SIRET.value, rna: RNA.value, name: "NAME" },
                    {
                        osirisId: "OSIRISID",
                        compteAssoId: "COMPTEASSOID",
                        ej: "",
                        amountAwarded: 0,
                        dateCommission: new Date(),
                        exercise: 2023,
                    } as IOsirisRequestInformations,
                    {},
                    undefined,
                    [],
                );
                await osirisService.addRequest(entity);
                const result = await osirisService.addRequest(entity2);
                expect(result.state).not.toBe("updated");
            });
        });

        describe("findBySiret", () => {
            const entity = new OsirisRequestEntity(
                { siret: SIRET.value, rna: RNA.value, name: "NAME" },
                {
                    osirisId: "FAKE_ID_2",
                    ej: "",
                    amountAwarded: 0,
                    dateCommission: new Date(),
                    exercise: 2022,
                } as IOsirisRequestInformations,
                {},
                undefined,
                [],
            );

            beforeEach(async () => {
                await osirisService.addRequest(entity);
            });

            it("should return request", async () => {
                const expected = { ...entity, _id: expect.any(ObjectId) };
                const actual = (await osirisService.findBySiret(SIRET))[0];
                expect(actual).toMatchObject(expected);
            });

            it("should return action without evaluation", async () => {
                await osirisService.addAction(
                    new OsirisActionEntity(
                        {
                            osirisActionId: "FAKE_ID_2-001",
                            exercise: 2022,
                        } as unknown as IOsirisActionsInformations,
                        {},
                    ),
                );
                const osirisActions = (await osirisService.findBySiret(SIRET))[0].actions as OsirisActionEntity[];
                const actual = osirisActions[0];
                const expected = {
                    indexedInformations: {
                        osirisActionId: "FAKE_ID_2-001",
                    },
                    data: {},
                };
                expect(actual).toMatchObject(expected);
            });
        });

        describe("findByRna", () => {
            const entity = new OsirisRequestEntity(
                { siret: SIRET.value, rna: RNA.value, name: "NAME" },
                {
                    osirisId: "FAKE_ID_2",
                    compteAssoId: "COMPTEASSOID",
                    ej: "",
                    amountAwarded: 0,
                    dateCommission: new Date(),
                    exercise: 2022,
                } as IOsirisRequestInformations,
                {},
                undefined,
                [],
            );

            beforeEach(async () => {
                await osirisService.addRequest(entity);
            });

            it("should return request", async () => {
                const expected = { ...entity, _id: expect.any(ObjectId) };
                const actual = (await osirisService.findByRna(RNA))[0];
                expect(actual).toMatchObject(expected);
            });
        });
    });

    describe("actions part", () => {
        describe("add", () => {
            it("should return the added osiris action", async () => {
                const entity = new OsirisActionEntity(
                    {
                        osirisActionId: "OSIRISID-001",
                        exercise: 2022,
                    } as IOsirisActionsInformations,
                    {},
                    undefined,
                );
                const expected = (await osirisService.addAction(entity)).result;
                expect(entity).toMatchObject(expected);
            });

            it("should return the updated osiris action", async () => {
                const entity = new OsirisActionEntity(
                    {
                        osirisActionId: "OSIRISID-001",
                        exercise: 2022,
                    } as IOsirisActionsInformations,
                    {},
                    undefined,
                );
                await osirisService.addAction(entity);
                const expected = await osirisService.addAction(entity);
                expect(entity).toMatchObject({ ...expected.result, _id: undefined });
                expect(expected.state).toBe("updated");
            });

            it("should add new if same id different exercise", async () => {
                const entity1 = new OsirisActionEntity(
                    {
                        osirisActionId: "OSIRISID-001",
                        exercise: 2022,
                    } as IOsirisActionsInformations,
                    {},
                    undefined,
                );
                const entity2 = new OsirisActionEntity(
                    {
                        osirisActionId: "OSIRISID-001",
                        exercise: 2023,
                    } as IOsirisActionsInformations,
                    {},
                    undefined,
                );
                await osirisService.addAction(entity1);
                const expected = await osirisService.addAction(entity2);
                expect(expected.state).not.toBe("updated");
            });
        });
    });

    describe("Etablisesement part", () => {
        const now = new Date(Date.UTC(2022, 0));
        const toPVs = (value: unknown, provider = "Osiris") =>
            ProviderValueAdapter.toProviderValues(value, provider, now);

        const entity = new OsirisRequestEntity(
            { siret: "12345678900000", rna: RNA.value, name: "NAME" },
            {
                osirisId: "FAKE_ID_2",
                compteAssoId: "COMPTEASSOID",
                ej: "",
                amountAwarded: 0,
                dateCommission: new Date(),
                exercise: 2022,
            } as IOsirisRequestInformations,
            {},
            undefined,
            [],
        );

        beforeEach(async () => {
            await osirisService.addRequest(entity);
        });

        describe("getEstablishments", () => {
            it("should return one demande", async () => {
                const expected = [
                    {
                        siret: toPVs(SIRET.value),
                        nic: toPVs("00000"),
                    },
                ];

                const actual = await osirisService.getEstablishments(ASSOCIATION_IDENTIFER);
                expect(actual).toMatchObject(expected);
            });
        });
    });

    describe("Association part", () => {
        const now = new Date(Date.UTC(2022, 0));
        const toPVs = (value: unknown, provider = "Osiris") =>
            ProviderValueAdapter.toProviderValues(value, provider, now);

        const entity = new OsirisRequestEntity(
            { siret: "12345678900000", rna: "W123456789", name: "NAME" },
            {
                osirisId: "FAKE_ID_2",
                compteAssoId: "COMPTEASSOID",
                ej: "",
                amountAwarded: 0,
                dateCommission: new Date(),
                exercise: 2022,
            } as IOsirisRequestInformations,
            {},
            undefined,
            [],
        );

        const SIREN = new Siren("123456789");
        const IDENTIFIER = AssociationIdentifier.fromSiren(SIREN);

        beforeEach(async () => {
            await osirisService.addRequest(entity);
        });

        describe("getAssociations", () => {
            it("should return one demande", async () => {
                const expected = [
                    {
                        siren: toPVs("123456789"),
                        rna: toPVs("W123456789"),
                        etablisements_siret: toPVs(["12345678900000"]),
                    },
                ];

                const actual = await osirisService.getAssociations(IDENTIFIER);
                expect(actual).toMatchObject(expected);
            });
        });
    });
});
