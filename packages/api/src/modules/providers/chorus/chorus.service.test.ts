import chorusService, { ChorusService } from "./chorus.service";
import chorusLineRepository from "./repositories/chorus.line.repository";
jest.mock("./repositories/chorus.line.repository");
const mockedChorusLineRepository = jest.mocked(chorusLineRepository);
import ChorusAdapter from "./adapters/ChorusAdapter";
jest.mock("./adapters/ChorusAdapter");
import dataGouvService from "../datagouv/datagouv.service";
jest.mock("../datagouv/datagouv.service");
const mockedDataGouvService = jest.mocked(dataGouvService);
import { DEFAULT_CHORUS_LINE_ENTITY, paymentsWithDifferentDP } from "./__fixutres__/ChorusLineEntities";
import rnaSirenService from "../../_open-data/rna-siren/rnaSiren.service";
jest.mock("../../_open-data/rna-siren/rnaSiren.service");
const mockedRnaSirenService = jest.mocked(rnaSirenService);
import ChorusLineEntity from "./entities/ChorusLineEntity";
import { ObjectId } from "mongodb";

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

describe("chorusService", () => {
    describe("buildUniqueId", () => {
        const PAYMENTS = [...paymentsWithDifferentDP];
        it("return a uniqueId hash", () => {
            const actual = ChorusService.buildUniqueId(PAYMENTS[0].indexedInformations);
            expect(actual).toMatchSnapshot();
        });
    });

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
        const OBJECT_ID = new ObjectId();
        let mockValidateEntity: jest.SpyInstance;
        let mockSirenBelongAsso: jest.SpyInstance;

        beforeAll(() => {
            mockValidateEntity = jest.spyOn(chorusService, "validateEntity");
            mockValidateEntity.mockImplementation(() => true);
            mockSirenBelongAsso = jest.spyOn(chorusService, "sirenBelongAsso");
            mockSirenBelongAsso.mockImplementation(async () => true);
        });

        beforeEach(() => {
            mockedChorusLineRepository.findOneByUniqueId.mockResolvedValue(null);
        });

        afterEach(() => {
            mockedChorusLineRepository.findOneByUniqueId.mockReset();
        });

        afterAll(() => {
            mockValidateEntity.mockRestore();
            mockSirenBelongAsso.mockRestore();
        });

        it("should return reject object when entity is not valid", async () => {
            const MESSAGE = "INVALID";
            mockValidateEntity.mockImplementationOnce(() => {
                throw new Error(MESSAGE);
            });
            const expected = { state: "rejected", result: { message: MESSAGE, data: WRONG_EJ_ENTITY } };
            const actual = await chorusService.addChorusLine(WRONG_EJ_ENTITY);
            expect(actual).toEqual(expected);
        });

        it("should call chorusLineRepository.update", async () => {
            mockedChorusLineRepository.findOneByUniqueId.mockResolvedValueOnce({ _id: OBJECT_ID, ...GOOD_ENTITY });
            await chorusService.addChorusLine(GOOD_ENTITY);
            expect(mockedChorusLineRepository.update).toHaveBeenCalledWith(GOOD_ENTITY);
        });

        it("return update object after update succeed", async () => {
            // @ts-expect-error: mock resolve value
            mockedChorusLineRepository.update.mockResolvedValueOnce(GOOD_ENTITY);
            // @ts-expect-error: mock resolve value
            mockedChorusLineRepository.findOneByUniqueId.mockResolvedValueOnce(GOOD_ENTITY);
            const expected = {
                state: "updated",
                result: GOOD_ENTITY,
            };
            const actual = await chorusService.addChorusLine(GOOD_ENTITY);
            expect(actual).toEqual(expected);
        });

        it("should return reject object when codeBranche is Z039 but siret does not belong to an association", async () => {
            mockSirenBelongAsso.mockResolvedValueOnce(false);
            const expected = {
                state: "rejected",
                result: { message: "The Siret does not correspond to an association", data: WRONG_CODE_BRANCHE_ENTITY },
            };
            const actual = await chorusService.addChorusLine(WRONG_CODE_BRANCHE_ENTITY);
            expect(actual).toEqual(expected);
        });

        it("should call chorusLineRepository.creates", async () => {
            await chorusService.addChorusLine(GOOD_ENTITY);
            expect(chorusLineRepository.create).toHaveBeenCalledWith(GOOD_ENTITY);
        });

        it("should return create object after creation succeed", async () => {
            const expected = {
                state: "created",
                result: GOOD_ENTITY,
            };
            const actual = await chorusService.addChorusLine(GOOD_ENTITY);
            expect(actual).toEqual(expected);
        });
    });

    describe("getVersementsBySiret", () => {
        beforeAll(() => {
            mockedChorusLineRepository.findBySiret.mockResolvedValue([GOOD_ENTITY, GOOD_ENTITY]);
        });

        afterEach(() => mockedChorusLineRepository.findBySiret.mockClear());

        afterAll(() => mockedChorusLineRepository.findBySiret.mockReset());

        const SIRET = GOOD_ENTITY.indexedInformations.siret;
        it("should call chorusLineRepository.findBySiret()", async () => {
            await chorusService.getVersementsBySiret(SIRET);
            expect(mockedChorusLineRepository.findBySiret).toHaveBeenCalledWith(SIRET);
        });
        it("should call ChorusAdapter.toVersement for each document", async () => {
            await chorusService.getVersementsBySiret(SIRET);
            expect(ChorusAdapter.toVersement).toHaveBeenCalledTimes(2);
        });
    });

    describe("getVersementsBySiren", () => {
        beforeAll(() => {
            mockedChorusLineRepository.findBySiren.mockResolvedValue([GOOD_ENTITY, GOOD_ENTITY]);
        });

        afterEach(() => mockedChorusLineRepository.findOneBySiren.mockClear());

        afterAll(() => mockedChorusLineRepository.findBySiren.mockReset());

        const SIREN = GOOD_ENTITY.indexedInformations.siret.substring(0, 9);
        it("should call chorusLineRepository.findBySiren()", async () => {
            await chorusService.getVersementsBySiren(SIREN);
            expect(mockedChorusLineRepository.findBySiren).toHaveBeenCalledWith(SIREN);
        });
        it("should call ChorusAdapter.toVersement for each document", async () => {
            await chorusService.getVersementsBySiren(SIREN);
            expect(ChorusAdapter.toVersement).toHaveBeenCalledTimes(2);
        });
    });

    describe("getVersementsByKey", () => {
        beforeAll(() => {
            mockedChorusLineRepository.findByEJ.mockResolvedValue([GOOD_ENTITY, GOOD_ENTITY]);
        });

        afterEach(() => mockedChorusLineRepository.findByEJ.mockClear());

        afterAll(() => mockedChorusLineRepository.findByEJ.mockReset());

        const EJ = GOOD_ENTITY.indexedInformations.ej;
        it("should call chorusLineRepository.findByEJ()", async () => {
            await chorusService.getVersementsByKey(EJ);
            expect(mockedChorusLineRepository.findByEJ).toHaveBeenCalledWith(EJ);
        });
        it("should call ChorusAdapter.toVersement for each document", async () => {
            await chorusService.getVersementsByKey(EJ);
            expect(ChorusAdapter.toVersement).toHaveBeenCalledTimes(2);
        });
    });

    describe("sirenBelongAsso", () => {
        const SIREN = GOOD_ENTITY.indexedInformations.siret.substring(0, 9);

        beforeEach(() => {
            mockedDataGouvService.sirenIsEntreprise.mockResolvedValue(false);
            mockedRnaSirenService.getRna.mockResolvedValue(null);
            // @ts-expect-error: mock resolve value
            mockedChorusLineRepository.findOneBySiren.mockResolvedValue(GOOD_ENTITY);
        });

        afterAll(() => {
            mockedDataGouvService.sirenIsEntreprise.mockReset();
            mockedRnaSirenService.getRna.mockReset();
            mockedChorusLineRepository.findOneBySiren.mockReset();
        });

        it("should return false if siren belongs to company", async () => {
            mockedDataGouvService.sirenIsEntreprise.mockResolvedValueOnce(true);
            const expected = false;
            const actual = await chorusService.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should return true if a RNA is found", async () => {
            mockedRnaSirenService.getRna.mockResolvedValueOnce("W7000065");
            const expected = true;
            const actual = await chorusService.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should call chorusLineRepository.findOneBySiren()", async () => {
            await chorusService.sirenBelongAsso(SIREN);
            expect(mockedChorusLineRepository.findOneBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("should return true if document is found", async () => {
            const expected = true;
            const actual = await chorusService.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should return true if document is not found", async () => {
            mockedChorusLineRepository.findOneBySiren.mockResolvedValueOnce(null);
            const expected = false;
            const actual = await chorusService.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe("raw grant", () => {
        const DATA = [{ indexedInformations: { ej: "EJ" } }];

        describe("getRawGrantsBySiret", () => {
            const SIRET = "12345678900000";
            let findBySiretMock;
            beforeAll(
                () =>
                    (findBySiretMock = jest
                        .spyOn(chorusLineRepository, "findBySiret")
                        // @ts-expect-error: mock
                        .mockImplementation(jest.fn(() => DATA))),
            );
            afterAll(() => findBySiretMock.mockRestore());

            it("should call findBySiret()", async () => {
                await chorusService.getRawGrantsBySiret(SIRET);
                expect(findBySiretMock).toHaveBeenCalledWith(SIRET);
            });

            it("returns raw grant data", async () => {
                const actual = await chorusService.getRawGrantsBySiret(SIRET);
                expect(actual).toMatchInlineSnapshot(`
                    Array [
                      Object {
                        "data": Object {
                          "indexedInformations": Object {
                            "ej": "EJ",
                          },
                        },
                        "joinKey": "EJ",
                        "provider": "chorus",
                        "type": "payment",
                      },
                    ]
                `);
            });
        });

        describe("getRawGrantsBySiren", () => {
            const SIREN = "123456789";
            let findBySirenMock;
            beforeAll(
                () =>
                    (findBySirenMock = jest
                        .spyOn(chorusLineRepository, "findBySiren")
                        // @ts-expect-error: mock
                        .mockImplementation(jest.fn(() => DATA))),
            );
            afterAll(() => findBySirenMock.mockRestore());

            it("should call findBySiren()", async () => {
                await chorusService.getRawGrantsBySiren(SIREN);
                expect(findBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("returns raw grant data", async () => {
                const actual = await chorusService.getRawGrantsBySiren(SIREN);
                expect(actual).toMatchInlineSnapshot(`
                    Array [
                      Object {
                        "data": Object {
                          "indexedInformations": Object {
                            "ej": "EJ",
                          },
                        },
                        "joinKey": "EJ",
                        "provider": "chorus",
                        "type": "payment",
                      },
                    ]
                `);
            });
        });
    });

    describe("rawToCommon", () => {
        const RAW = "RAW";
        const ADAPTED = {};

        beforeAll(() => {
            ChorusAdapter.toCommon
                // @ts-expect-error: mock
                .mockImplementation(input => input.toString());
        });

        afterAll(() => {
            // @ts-expect-error: mock
            ChorusAdapter.toCommon.mockReset();
        });

        it("calls adapter with data from raw grant", () => {
            // @ts-expect-error: mock
            chorusService.rawToCommon({ data: RAW });
            expect(ChorusAdapter.toCommon).toHaveBeenCalledWith(RAW);
        });
        it("returns result from adapter", () => {
            // @ts-expect-error: mock
            ChorusAdapter.toCommon.mockReturnValueOnce(ADAPTED);
            const expected = ADAPTED;
            // @ts-expect-error: mock
            const actual = chorusService.rawToCommon({ data: RAW });
            expect(actual).toEqual(expected);
        });
    });
});
