import ChorusLineEntity from "../../../../src/modules/providers/chorus/entities/ChorusLineEntity";
import chorusService from "../../../../src/modules/providers/chorus/chorus.service";
import ProviderValueAdapter from "../../../../src/shared/adapters/ProviderValueAdapter";
import { WithId } from "mongodb";
import rnaSirenService from "../../../../src/modules/open-data/rna-siren/rnaSiren.service";

describe("chorus.service", () => {
    describe("validateEntity", () => {
        it("rejects because codeBranche is not accepted", () => {
            const entity = new ChorusLineEntity(
                "FAKE_ID",
                {
                    siret: "10000000000000",
                    ej: "00000",
                    amount: 1000,
                    dateOperation: new Date(),
                    branche: "BRANCHE",
                    codeBranche: "WRONG CODE",
                    centreFinancier: "CENTRE_FINANCIER",
                    codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                    domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                    codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                    compte: "COMPTE",
                    typeOperation: "ZSUB"
                },
                {}
            );
            expect(chorusService.validateEntity(entity)).toEqual({
                success: false,
                message: `The branche ${entity.indexedInformations.codeBranche} is not accepted in data`,
                data: entity
            });
        });

        it("rejects because amount is not a number", () => {
            const entity = new ChorusLineEntity(
                "FAKE_ID",
                {
                    siret: "10000000000000",
                    ej: "00000",
                    amount: undefined as unknown as number,
                    dateOperation: new Date(),
                    branche: "BRANCHE",
                    codeBranche: "Z004",
                    centreFinancier: "CENTRE_FINANCIER",
                    codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                    domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                    codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                    compte: "COMPTE",
                    typeOperation: "ZSUB"
                },
                {}
            );
            expect(chorusService.validateEntity(entity)).toEqual({
                success: false,
                message: `Amount is not a number`,
                data: entity
            });
        });

        it("rejects dateOperation is not a Date", () => {
            const entity = new ChorusLineEntity(
                "FAKE_ID",
                {
                    siret: "10000000000000",
                    ej: "00000",
                    amount: 1000,
                    dateOperation: "01/01/1960" as unknown as Date,
                    branche: "BRANCHE",
                    codeBranche: "Z004",
                    centreFinancier: "CENTRE_FINANCIER",
                    codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                    domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                    codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                    compte: "COMPTE",
                    typeOperation: "ZSUB"
                },
                {}
            );
            expect(chorusService.validateEntity(entity)).toEqual({
                success: false,
                message: `Operation date is not a valid date`,
                data: entity
            });
        });

        it("rejects because siret is not valid", () => {
            const entity = new ChorusLineEntity(
                "FAKE_ID",
                {
                    siret: "SIRET",
                    ej: "00000",
                    amount: 1000,
                    dateOperation: new Date(),
                    branche: "BRANCHE",
                    codeBranche: "Z004",
                    centreFinancier: "CENTRE_FINANCIER",
                    codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                    domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                    codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                    compte: "COMPTE",
                    typeOperation: "ZSUB"
                },
                {}
            );
            expect(chorusService.validateEntity(entity)).toEqual({
                success: false,
                message: `INVALID SIRET FOR ${entity.indexedInformations.siret}`,
                data: entity
            });
        });

        it("rejects because ej is not valid", () => {
            const entity = new ChorusLineEntity(
                "FAKE_ID",
                {
                    siret: "10000000000000",
                    ej: "00000",
                    amount: 1000,
                    dateOperation: new Date(),
                    branche: "BRANCHE",
                    codeBranche: "Z004",
                    centreFinancier: "CENTRE_FINANCIER",
                    codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                    domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                    codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                    compte: "COMPTE",
                    typeOperation: "ZSUB"
                },
                {}
            );
            expect(chorusService.validateEntity(entity)).toEqual({
                success: false,
                message: `INVALID EJ FOR ${entity.indexedInformations.ej}`,
                data: entity
            });
        });

        it("accepts", () => {
            const entity = new ChorusLineEntity(
                "FAKE_ID",
                {
                    siret: "10000000000000",
                    ej: "1000000000",
                    amount: 1000,
                    dateOperation: new Date(),
                    branche: "BRANCHE",
                    codeBranche: "Z004",
                    centreFinancier: "CENTRE_FINANCIER",
                    codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                    domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                    codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                    compte: "COMPTE",
                    typeOperation: "ZSUB"
                },
                {}
            );
            expect(chorusService.validateEntity(entity)).toEqual({ success: true });
        });
    });

    describe("addChorusLine", () => {
        it("rejects because entity is not valid", async () => {
            const entity = new ChorusLineEntity(
                "FAKE_ID",
                {
                    siret: "SIRET",
                    ej: "00000",
                    amount: 1000,
                    dateOperation: new Date(),
                    branche: "BRANCHE",
                    codeBranche: "Z004",
                    centreFinancier: "CENTRE_FINANCIER",
                    codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                    domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                    codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                    compte: "COMPTE",
                    typeOperation: "ZSUB"
                },
                {}
            );

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({
                state: "rejected",
                result: expect.objectContaining({
                    success: false,
                    message: "INVALID SIRET FOR SIRET"
                })
            });
        });

        it("creates entity", async () => {
            const mock = jest
                .spyOn(chorusService, "sirenBelongAsso")
                .mockImplementationOnce(() => Promise.resolve(true));
            const entity = new ChorusLineEntity(
                "FAKE_ID",
                {
                    siret: "10000000000000",
                    ej: "1000000000",
                    amount: 1000,
                    dateOperation: new Date(),
                    branche: "BRANCHE",
                    codeBranche: "Z004",
                    centreFinancier: "CENTRE_FINANCIER",
                    codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                    domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                    codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                    compte: "COMPTE",
                    typeOperation: "ZSUB"
                },
                {}
            );

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({
                state: "created",
                result: entity
            });

            mock.mockRestore();
        });

        it("should not create entity because code branche is not accepted", async () => {
            const mock = jest
                .spyOn(chorusService, "sirenBelongAsso")
                .mockImplementationOnce(() => Promise.resolve(false));
            const entity = new ChorusLineEntity(
                "FAKE_ID",
                {
                    siret: "10000000000000",
                    ej: "1000000000",
                    amount: 1000,
                    dateOperation: new Date(),
                    branche: "BRANCHE",
                    codeBranche: "Z044",
                    centreFinancier: "CENTRE_FINANCIER",
                    codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                    domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                    codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                    compte: "COMPTE",
                    typeOperation: "ZSUB"
                },
                {}
            );

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({
                state: "rejected",
                result: {
                    message: "The Siret does not correspond to an association",
                    data: entity
                }
            });

            mock.mockRestore();
        });

        it("should update entity", async () => {
            const mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true));

            const entity = new ChorusLineEntity(
                "FAKE_ID",
                {
                    siret: "10000000000000",
                    ej: "1000000000",
                    amount: 1000,
                    dateOperation: new Date(),
                    branche: "BRANCHE",
                    codeBranche: "Z004",
                    centreFinancier: "CENTRE_FINANCIER",
                    codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                    domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                    codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                    compte: "COMPTE",
                    typeOperation: "ZSUB"
                },
                {}
            );

            await chorusService.addChorusLine(entity);

            entity.data = { test: "update" };

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({
                state: "updated",
                result: entity
            });
            mock.mockRestore();
        });

        it("does not update because same ej but not same id", async () => {
            const mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true));
            const entity = new ChorusLineEntity(
                "FAKE_ID",
                {
                    siret: "10000000000000",
                    ej: "1000000000",
                    amount: 1000,
                    dateOperation: new Date(),
                    branche: "BRANCHE",
                    codeBranche: "Z004",
                    centreFinancier: "CENTRE_FINANCIER",
                    codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                    domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                    codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                    compte: "COMPTE",
                    typeOperation: "ZSUB"
                },
                {}
            );

            await chorusService.addChorusLine(entity);

            entity.uniqueId = "FAKE_ID_2";

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _id, ...entityWithoutId } = entity;

            await expect(chorusService.addChorusLine(entityWithoutId)).resolves.toEqual({
                state: "created",
                result: entityWithoutId
            });
            mock.mockRestore();
        });
    });

    describe("getVersementsBySiret", () => {
        const now = new Date();
        let entity: WithId<ChorusLineEntity>;
        const toPV = (value: unknown, provider = "Chorus") =>
            ProviderValueAdapter.toProviderValue(value, provider, now);

        let mock: jest.SpyInstance<Promise<boolean>, [siret: string]>;

        beforeEach(async () => {
            mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true));
            entity = (
                await chorusService.addChorusLine(
                    new ChorusLineEntity(
                        "FAKE_ID",
                        {
                            siret: "10000000000000",
                            ej: "1000000000",
                            amount: 1000,
                            dateOperation: now,
                            branche: "BRANCHE",
                            codeBranche: "Z004",
                            centreFinancier: "CENTRE_FINANCIER",
                            codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                            domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                            codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                            compte: "COMPTE",
                            typeOperation: "ZSUB"
                        },
                        {}
                    )
                )
            ).result as WithId<ChorusLineEntity>;
        });

        afterEach(() => {
            mock.mockRestore();
        });

        it("finds entity", async () => {
            await expect(chorusService.getVersementsBySiret("10000000000000")).resolves.toEqual([
                {
                    id: entity._id.toString(),
                    siret: toPV("10000000000000"),
                    ej: toPV("1000000000"),
                    versementKey: toPV("1000000000"),
                    amount: toPV(1000),
                    dateOperation: toPV(now),
                    branche: toPV("BRANCHE"),
                    codeBranche: toPV("Z004"),
                    centreFinancier: toPV("CENTRE_FINANCIER"),
                    domaineFonctionnel: toPV("DOMAINE_FONCTIONNEL"),
                    compte: toPV("COMPTE"),
                    type: toPV("ZSUB")
                }
            ]);
        });
        it("finds no entity", async () => {
            await expect(chorusService.getVersementsBySiret("10000000000004")).resolves.toHaveLength(0);
        });
    });

    describe("getVersementsBySiren", () => {
        const now = new Date();
        let entity: WithId<ChorusLineEntity>;
        const toPV = (value: unknown, provider = "Chorus") =>
            ProviderValueAdapter.toProviderValue(value, provider, now);
        let mock: jest.SpyInstance<Promise<boolean>, [siret: string]>;

        beforeEach(async () => {
            mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true));
            entity = (
                await chorusService.addChorusLine(
                    new ChorusLineEntity(
                        "FAKE_ID",
                        {
                            siret: "10000000000000",
                            ej: "1000000000",
                            amount: 1000,
                            dateOperation: now,
                            branche: "BRANCHE",
                            codeBranche: "Z004",
                            centreFinancier: "CENTRE_FINANCIER",
                            codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                            domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                            codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                            compte: "COMPTE",
                            typeOperation: "ZSUB"
                        },
                        {}
                    )
                )
            ).result as WithId<ChorusLineEntity>;
        });

        afterEach(() => {
            mock.mockRestore();
        });

        it("finds entity", async () => {
            await expect(chorusService.getVersementsBySiren("100000000")).resolves.toEqual([
                {
                    id: entity._id.toString(),
                    siret: toPV("10000000000000"),
                    ej: toPV("1000000000"),
                    versementKey: toPV("1000000000"),
                    amount: toPV(1000),
                    dateOperation: toPV(now),
                    branche: toPV("BRANCHE"),
                    codeBranche: toPV("Z004"),
                    centreFinancier: toPV("CENTRE_FINANCIER"),
                    domaineFonctionnel: toPV("DOMAINE_FONCTIONNEL"),
                    compte: toPV("COMPTE"),
                    type: toPV("ZSUB")
                }
            ]);
        });
        it("finds no entity", async () => {
            await expect(chorusService.getVersementsBySiren("100000009")).resolves.toHaveLength(0);
        });
    });

    describe("getVersementsBySiren", () => {
        const now = new Date();
        let entity: WithId<ChorusLineEntity>;
        const toPV = (value: unknown, provider = "Chorus") =>
            ProviderValueAdapter.toProviderValue(value, provider, now);
        let mock: jest.SpyInstance<Promise<boolean>, [siret: string]>;

        beforeEach(async () => {
            mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true));
            entity = (
                await chorusService.addChorusLine(
                    new ChorusLineEntity(
                        "FAKE_ID",
                        {
                            siret: "10000000000000",
                            ej: "1000000000",
                            amount: 1000,
                            dateOperation: now,
                            branche: "BRANCHE",
                            codeBranche: "Z004",
                            centreFinancier: "CENTRE_FINANCIER",
                            codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                            domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                            codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                            compte: "COMPTE",
                            typeOperation: "ZSUB"
                        },
                        {}
                    )
                )
            ).result as WithId<ChorusLineEntity>;
        });

        afterEach(() => {
            mock.mockRestore();
        });

        it("finds entity", async () => {
            await expect(chorusService.getVersementsByKey("1000000000")).resolves.toEqual([
                {
                    id: entity._id.toString(),
                    siret: toPV("10000000000000"),
                    ej: toPV("1000000000"),
                    versementKey: toPV("1000000000"),
                    amount: toPV(1000),
                    dateOperation: toPV(now),
                    branche: toPV("BRANCHE"),
                    codeBranche: toPV("Z004"),
                    centreFinancier: toPV("CENTRE_FINANCIER"),
                    domaineFonctionnel: toPV("DOMAINE_FONCTIONNEL"),
                    compte: toPV("COMPTE"),
                    type: toPV("ZSUB")
                }
            ]);
        });
        it("finds no entity", async () => {
            await expect(chorusService.getVersementsByKey("2000000000")).resolves.toHaveLength(0);
        });
    });

    describe("getVersementsBySiren", () => {
        const now = new Date();

        beforeEach(async () => {
            jest.clearAllMocks();
            jest.spyOn(chorusService, "sirenBelongAsso").mockImplementationOnce(() => Promise.resolve(true));

            await chorusService.addChorusLine(
                new ChorusLineEntity(
                    "FAKE_ID",
                    {
                        siret: "10000000000000",
                        ej: "1000000000",
                        amount: 1000,
                        dateOperation: now,
                        branche: "BRANCHE",
                        codeBranche: "Z004",
                        centreFinancier: "CENTRE_FINANCIER",
                        codeCentreFinancier: "CENTRE_FINANCIER_CODE",
                        domaineFonctionnel: "DOMAINE_FONCTIONNEL",
                        codeDomaineFonctionnel: "DOMAINE_FONCTIONNEL_CODE",
                        compte: "COMPTE",
                        typeOperation: "ZSUB"
                    },
                    {}
                )
            );
        });

        it("returns true because siret is already in chorus line", async () => {
            await expect(chorusService.sirenBelongAsso("10000000")).resolves.toBe(true);
        });

        it("returns true because siret match with rna", async () => {
            jest.spyOn(rnaSirenService, "getRna").mockImplementationOnce(() => Promise.resolve("W0000000"));

            await expect(chorusService.sirenBelongAsso("10000000")).resolves.toBe(true);
        });

        it("returns false ", async () => {
            jest.spyOn(rnaSirenService, "getRna").mockImplementationOnce(() => Promise.resolve(null));

            await expect(chorusService.sirenBelongAsso("200000000")).resolves.toBe(false);
        });
    });
});
