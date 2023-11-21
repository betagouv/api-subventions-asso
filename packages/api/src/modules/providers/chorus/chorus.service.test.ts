import chorusService, { ChorusService } from "./chorus.service";
import chorusLineRepository from "./repositories/chorus.line.repository";
jest.mock("./repositories/chorus.line.repository");
const mockedChorusLineRepository = jest.mocked(chorusLineRepository);
import ChorusAdapter from "./adapters/ChorusAdapter";
jest.mock("./adapters/ChorusAdapter");
import dataGouvService from "../datagouv/datagouv.service";
jest.mock("../datagouv/datagouv.service");
const mockedDataGouvService = jest.mocked(dataGouvService);
import * as StringHelper from "../../../shared/helpers/StringHelper";
jest.mock("../../../shared/helpers/StringHelper");
const mockedStringHelper = jest.mocked(StringHelper);
import { DEFAULT_CHORUS_LINE_DOCUMENT } from "./__fixutres__/ChorusLineEntities";
import rnaSirenService from "../../rna-siren/rnaSiren.service";
jest.mock("../../rna-siren/entities");
const mockedRnaSirenService = jest.mocked(rnaSirenService);
import ChorusLineEntity from "./entities/ChorusLineEntity";
import { ObjectId } from "mongodb";

const WRONG_CODE_BRANCHE_ENTITY = new ChorusLineEntity(
    "FAKE_ID",
    { ...DEFAULT_CHORUS_LINE_DOCUMENT.indexedInformations, codeBranche: "WRONG CODE" },
    {},
);
const WRONG_SIRET_ENTITY = new ChorusLineEntity(
    "FAKE_ID",
    { ...DEFAULT_CHORUS_LINE_DOCUMENT.indexedInformations, siret: "SIRET" },
    {},
);
const WRONG_EJ_ENTITY = new ChorusLineEntity(
    "FAKE_ID",
    { ...DEFAULT_CHORUS_LINE_DOCUMENT.indexedInformations, ej: "00000" },
    {},
);
const WRONG_AMOUNT_ENTITY = new ChorusLineEntity(
    "FAKE_ID",
    // @ts-expect-error: amount not defined
    { ...DEFAULT_CHORUS_LINE_DOCUMENT.indexedInformations, amount: undefined },
    {},
);
const WRONG_DATE_ENTITY = new ChorusLineEntity(
    "FAKE_ID",
    // @ts-expect-error: string instead of date
    { ...DEFAULT_CHORUS_LINE_DOCUMENT.indexedInformations, dateOperation: "01/01/1960" },
    {},
);

describe("chorusService", () => {
    describe("buildUniqueId", () => {
        it("call getMD5", () => {
            const info = DEFAULT_CHORUS_LINE_DOCUMENT.indexedInformations;
            ChorusService.buildUniqueId(info);
            expect(mockedStringHelper.getMD5).toHaveBeenCalledWith(
                `${info.ej}-${info.siret}-${info.dateOperation.toISOString()}-${info.amount}-${
                    info.numeroDemandePayment
                }-${info.codeCentreFinancier}-${info.codeDomaineFonctionnel}`,
            );
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
            const entity = DEFAULT_CHORUS_LINE_DOCUMENT;
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
            mockedChorusLineRepository.findOneByUniqueId.mockResolvedValueOnce({
                _id: OBJECT_ID,
                ...DEFAULT_CHORUS_LINE_DOCUMENT,
            });
            await chorusService.addChorusLine(DEFAULT_CHORUS_LINE_DOCUMENT);
            expect(mockedChorusLineRepository.update).toHaveBeenCalledWith(DEFAULT_CHORUS_LINE_DOCUMENT);
        });

        it("return update object after update succeed", async () => {
            // @ts-expect-error: mock resolve value
            mockedChorusLineRepository.update.mockResolvedValueOnce(DEFAULT_CHORUS_LINE_DOCUMENT);
            // @ts-expect-error: mock resolve value
            mockedChorusLineRepository.findOneByUniqueId.mockResolvedValueOnce(DEFAULT_CHORUS_LINE_DOCUMENT);
            const expected = {
                state: "updated",
                result: DEFAULT_CHORUS_LINE_DOCUMENT,
            };
            const actual = await chorusService.addChorusLine(DEFAULT_CHORUS_LINE_DOCUMENT);
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
            await chorusService.addChorusLine(DEFAULT_CHORUS_LINE_DOCUMENT);
            expect(chorusLineRepository.create).toHaveBeenCalledWith(DEFAULT_CHORUS_LINE_DOCUMENT);
        });

        it("should return create object after creation succeed", async () => {
            const expected = {
                state: "created",
                result: DEFAULT_CHORUS_LINE_DOCUMENT,
            };
            const actual = await chorusService.addChorusLine(DEFAULT_CHORUS_LINE_DOCUMENT);
            expect(actual).toEqual(expected);
        });
    });

    describe("getVersementsBySiret", () => {
        beforeAll(() => {
            mockedChorusLineRepository.findBySiret.mockResolvedValue([
                DEFAULT_CHORUS_LINE_DOCUMENT,
                DEFAULT_CHORUS_LINE_DOCUMENT,
            ]);
        });

        afterEach(() => mockedChorusLineRepository.findBySiret.mockClear());

        afterAll(() => mockedChorusLineRepository.findBySiret.mockReset());

        const SIRET = DEFAULT_CHORUS_LINE_DOCUMENT.indexedInformations.siret;
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
            mockedChorusLineRepository.findBySiren.mockResolvedValue([
                DEFAULT_CHORUS_LINE_DOCUMENT,
                DEFAULT_CHORUS_LINE_DOCUMENT,
            ]);
        });

        afterEach(() => mockedChorusLineRepository.findOneBySiren.mockClear());

        afterAll(() => mockedChorusLineRepository.findBySiren.mockReset());

        const SIREN = DEFAULT_CHORUS_LINE_DOCUMENT.indexedInformations.siret.substring(0, 9);
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
            mockedChorusLineRepository.findByEJ.mockResolvedValue([
                DEFAULT_CHORUS_LINE_DOCUMENT,
                DEFAULT_CHORUS_LINE_DOCUMENT,
            ]);
        });

        afterEach(() => mockedChorusLineRepository.findByEJ.mockClear());

        afterAll(() => mockedChorusLineRepository.findByEJ.mockReset());

        const EJ = DEFAULT_CHORUS_LINE_DOCUMENT.indexedInformations.ej;
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
        const SIREN = DEFAULT_CHORUS_LINE_DOCUMENT.indexedInformations.siret.substring(0, 9);

        beforeEach(() => {
            mockedDataGouvService.sirenIsEntreprise.mockResolvedValue(false);
            mockedRnaSirenService.find.mockResolvedValue(null);
            // @ts-expect-error: mock resolve value
            mockedChorusLineRepository.findOneBySiren.mockResolvedValue(DEFAULT_CHORUS_LINE_DOCUMENT);
        });

        afterAll(() => {
            mockedDataGouvService.sirenIsEntreprise.mockReset();
            mockedRnaSirenService.find.mockReset();
            mockedChorusLineRepository.findOneBySiren.mockReset();
        });

        it("should return false if siren belongs to company", async () => {
            mockedDataGouvService.sirenIsEntreprise.mockResolvedValueOnce(true);
            const expected = false;
            const actual = await chorusService.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should return true if a RNA is found", async () => {
            mockedRnaSirenService.find.mockResolvedValueOnce([{rna: "W7000065", siren: SIREN}]);
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
