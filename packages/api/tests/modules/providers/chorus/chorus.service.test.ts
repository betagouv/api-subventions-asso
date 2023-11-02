import ChorusLineEntity from "../../../../src/modules/providers/chorus/entities/ChorusLineEntity";
import chorusService from "../../../../src/modules/providers/chorus/chorus.service";
import ProviderValueAdapter from "../../../../src/shared/adapters/ProviderValueAdapter";
import rnaSirenService from "../../../../src/modules/_open-data/rna-siren/rnaSiren.service";

import { DEFAULT_CHORUS_LINE_ENTITY } from "../../../../src/modules/providers/chorus/__fixutres__/ChorusLineEntities";

const GOOD_ENTITY = new ChorusLineEntity("FAKE_ID", { ...DEFAULT_CHORUS_LINE_ENTITY.indexedInformations }, {});

const WRONG_CODE_BRANCHE_ENTITY = new ChorusLineEntity(
    "FAKE_ID",
    { ...DEFAULT_CHORUS_LINE_ENTITY.indexedInformations, codeBranche: "WRONG CODE" },
    {},
);
const WRONG_SIRET_ENTITY = new ChorusLineEntity(
    "FAKE_ID",
    { ...DEFAULT_CHORUS_LINE_ENTITY.indexedInformations, siret: "SIRET" },
    {},
);
const WRONG_EJ_ENTITY = new ChorusLineEntity(
    "FAKE_ID",
    { ...DEFAULT_CHORUS_LINE_ENTITY.indexedInformations, ej: "00000" },
    {},
);
const WRONG_AMOUNT_ENTITY = new ChorusLineEntity(
    "FAKE_ID",
    // @ts-expect-error: amount not defined
    { ...DEFAULT_CHORUS_LINE_ENTITY.indexedInformations, amount: undefined },
    {},
);
const WRONG_DATE_ENTITY = new ChorusLineEntity(
    "FAKE_ID",
    // @ts-expect-error: string instead of date
    { ...DEFAULT_CHORUS_LINE_ENTITY.indexedInformations, dateOperation: "01/01/1960" },
    {},
);

describe("chorus.service", () => {
    const DATE = new Date(2022, 1, 5);
    describe("validateEntity", () => {
        it("rejects because codeBranche is not accepted", () => {
            const entity = { ...WRONG_CODE_BRANCHE_ENTITY };

            expect(() => chorusService.validateEntity(entity)).toThrow(
                `The branch ${entity.indexedInformations.codeBranche} is not accepted in data`,
            );
        });

        it("rejects because amount is not a number", () => {
            const entity = { ...WRONG_AMOUNT_ENTITY };
            expect(() => chorusService.validateEntity(entity)).toThrow(`Amount is not a number`);
        });

        it("rejects dateOperation is not a Date", () => {
            const entity = { ...WRONG_DATE_ENTITY };
            expect(() => chorusService.validateEntity(entity)).toThrow(`Operation date is not a valid date`);
        });

        it("rejects because siret is not valid", () => {
            const entity = { ...WRONG_SIRET_ENTITY };
            expect(() => chorusService.validateEntity(entity)).toThrow(
                `INVALID SIRET FOR ${entity.indexedInformations.siret}`,
            );
        });

        it("rejects because ej is not valid", () => {
            const entity = { ...WRONG_EJ_ENTITY };
            expect(() => chorusService.validateEntity(entity)).toThrow(
                `INVALID EJ FOR ${entity.indexedInformations.ej}`,
            );
        });

        it("accepts", () => {
            const entity = GOOD_ENTITY;
            expect(chorusService.validateEntity(entity)).toEqual(true);
        });
    });

    describe("addChorusLine", () => {
        it("rejects because entity is not valid", async () => {
            const entity = new ChorusLineEntity(
                "FAKE_ID",
                { ...DEFAULT_CHORUS_LINE_ENTITY.indexedInformations, siret: "SIRET" },
                {},
            );

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({
                state: "rejected",
                result: expect.objectContaining({
                    message: "INVALID SIRET FOR SIRET",
                }),
            });
        });

        it("creates entity", async () => {
            const mock = jest
                .spyOn(chorusService, "sirenBelongAsso")
                .mockImplementationOnce(() => Promise.resolve(true));
            const entity = new ChorusLineEntity("FAKE_ID", DEFAULT_CHORUS_LINE_ENTITY.indexedInformations, {});

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({
                state: "created",
                result: entity,
            });

            mock.mockRestore();
        });

        it("should not create entity because code branche is not accepted", async () => {
            const mock = jest
                .spyOn(chorusService, "sirenBelongAsso")
                .mockImplementationOnce(() => Promise.resolve(false));
            const entity = WRONG_CODE_BRANCHE_ENTITY;

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({
                state: "rejected",
                result: {
                    message: "The branch WRONG CODE is not accepted in data",
                    data: entity,
                },
            });

            mock.mockRestore();
        });

        it("should update entity", async () => {
            const mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true));

            const entity = GOOD_ENTITY;

            await chorusService.addChorusLine(entity);

            entity.data = { test: "update" };

            await expect(chorusService.addChorusLine(entity)).resolves.toEqual({
                state: "updated",
                result: entity,
            });
            mock.mockRestore();
        });

        it("does not update because same ej but not same id", async () => {
            const mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true));
            const entity = GOOD_ENTITY;

            await chorusService.addChorusLine(entity);

            entity.uniqueId = "FAKE_ID_2";

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _id, ...entityWithoutId } = entity;

            await expect(chorusService.addChorusLine(entityWithoutId)).resolves.toEqual({
                state: "created",
                result: entityWithoutId,
            });
            mock.mockRestore();
        });
    });

    describe("getVersementsBySiret", () => {
        let mock: jest.SpyInstance<Promise<boolean>, [siret: string]>;

        beforeEach(async () => {
            mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true));
            await chorusService.addChorusLine(GOOD_ENTITY);
        });

        afterEach(() => {
            mock.mockRestore();
        });

        it("finds entity", async () => {
            const actual = await chorusService.getVersementsBySiret(GOOD_ENTITY.indexedInformations.siret);
            expect(actual).toMatchSnapshot([{ id: expect.any(String) }]);
        });
        it("finds no entity", async () => {
            const actual = await chorusService.getVersementsBySiret("NOT_PERSISTED_SIRET");
            expect(actual).toHaveLength(0);
        });
    });

    describe("getVersementsBySiren", () => {
        let mock: jest.SpyInstance<Promise<boolean>, [siret: string]>;

        beforeEach(async () => {
            mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true));
            await chorusService.addChorusLine(GOOD_ENTITY);
        });

        afterEach(() => {
            mock.mockRestore();
        });

        it("finds entity", async () => {
            const actual = await chorusService.getVersementsBySiren(
                GOOD_ENTITY.indexedInformations.siret.substring(0, 9),
            );
            expect(actual).toMatchSnapshot([{ id: expect.any(String) }]);
        });

        it("finds no entity", async () => {
            const actual = await chorusService.getVersementsBySiren("NOT_PERSISTED_SIREN");
            expect(actual).toHaveLength(0);
        });
    });

    describe("getVersementsByKey", () => {
        const toPV = (value: unknown, provider = "Chorus") =>
            ProviderValueAdapter.toProviderValue(value, provider, DATE);
        let mock: jest.SpyInstance<Promise<boolean>, [siret: string]>;

        beforeEach(async () => {
            mock = jest.spyOn(chorusService, "sirenBelongAsso").mockImplementation(() => Promise.resolve(true));
            await chorusService.addChorusLine(GOOD_ENTITY);
        });

        afterEach(() => {
            mock.mockRestore();
        });

        it("finds entity", async () => {
            const actual = await chorusService.getVersementsByKey(DEFAULT_CHORUS_LINE_ENTITY.indexedInformations.ej);
            expect(actual).toMatchSnapshot([{ id: expect.any(String) }]);
        });
        it("finds no entity", async () => {
            const actual = await chorusService.getVersementsByKey("2000000000");
            expect(actual).toHaveLength(0);
        });
    });

    describe("sirenBelongAsso", () => {
        beforeEach(async () => {
            await chorusService.addChorusLine(GOOD_ENTITY);
        });

        it("returns true because siren is already in chorus line", async () => {
            const actual = await chorusService.sirenBelongAsso(GOOD_ENTITY.indexedInformations.siret.substring(0, 9));
            expect(actual).toBe(true);
        });

        it("returns true because siret match with rna", async () => {
            jest.spyOn(rnaSirenService, "getRna").mockImplementationOnce(() => Promise.resolve("W0000000"));
            const actual = await chorusService.sirenBelongAsso(GOOD_ENTITY.indexedInformations.siret.substring(0, 9));
            expect(actual).toBe(true);
        });

        it("returns false ", async () => {
            chorusService.sirenBelongAsso;
            jest.spyOn(rnaSirenService, "getRna").mockResolvedValueOnce(null);
            const actual = await chorusService.sirenBelongAsso("NOT_PERSISTED_SIREN");
            expect(actual).toBe(false);
        });
    });
});
