import chorusService, { ChorusService } from "./chorus.service";
import chorusLineRepository from "./repositories/chorus.line.repository";
jest.mock("./repositories/chorus.line.repository");
const mockedChorusLineRepository = jest.mocked(chorusLineRepository);
import ChorusAdapter from "./adapters/ChorusAdapter";
jest.mock("./adapters/ChorusAdapter");
import uniteLegalEntreprisesSerivce from "../uniteLegalEntreprises/uniteLegal.entreprises.service";
jest.mock("../uniteLegalEntreprises/uniteLegal.entreprises.service");
const mockedUniteLegalEntreprisesSerivce = jest.mocked(uniteLegalEntreprisesSerivce);
import * as StringHelper from "../../../shared/helpers/StringHelper";
jest.mock("../../../shared/helpers/StringHelper");
const mockedStringHelper = jest.mocked(StringHelper);
jest.mock("../../rna-siren/rnaSiren.service");
import rnaSirenService from "../../rna-siren/rnaSiren.service";
jest.mock("../../_open-data/rna-siren/rnaSiren.service");
const mockedRnaSirenService = jest.mocked(rnaSirenService);
import ChorusLineEntity from "./entities/ChorusLineEntity";
import { ObjectId } from "mongodb";
import { ENTITIES } from "./__fixutres__/ChorusFixtures";

const WRONG_CODE_BRANCHE_ENTITY = new ChorusLineEntity(
    "FAKE_ID",
    { ...ENTITIES[0].indexedInformations, codeBranche: "WRONG CODE" },
    {},
);
const WRONG_SIRET_ENTITY = new ChorusLineEntity("FAKE_ID", { ...ENTITIES[0].indexedInformations, siret: "SIRET" }, {});
const WRONG_EJ_ENTITY = new ChorusLineEntity("FAKE_ID", { ...ENTITIES[0].indexedInformations, ej: "00000" }, {});
const WRONG_AMOUNT_ENTITY = new ChorusLineEntity(
    "FAKE_ID",
    // @ts-expect-error: amount not defined
    { ...ENTITIES[0].indexedInformations, amount: undefined },
    {},
);
const WRONG_DATE_ENTITY = new ChorusLineEntity(
    "FAKE_ID",
    // @ts-expect-error: string instead of date
    { ...ENTITIES[0].indexedInformations, dateOperation: "01/01/1960" },
    {},
);

describe("chorusService", () => {
    describe("buildUniqueId", () => {
        it("call getMD5", () => {
            const info = ENTITIES[0].indexedInformations;
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
            const entity = ENTITIES[0];
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
                ...ENTITIES[0],
                _id: OBJECT_ID,
            });
            await chorusService.addChorusLine(ENTITIES[0]);
            expect(mockedChorusLineRepository.update).toHaveBeenCalledWith(ENTITIES[0]);
        });

        it("return update object after update succeed", async () => {
            // @ts-expect-error: mock resolve value
            mockedChorusLineRepository.update.mockResolvedValueOnce(ENTITIES[0]);
            // @ts-expect-error: mock resolve value
            mockedChorusLineRepository.findOneByUniqueId.mockResolvedValueOnce(ENTITIES[0]);
            const expected = {
                state: "updated",
                result: ENTITIES[0],
            };
            const actual = await chorusService.addChorusLine(ENTITIES[0]);
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
            await chorusService.addChorusLine(ENTITIES[0]);
            expect(chorusLineRepository.create).toHaveBeenCalledWith(ENTITIES[0]);
        });

        it("should return create object after creation succeed", async () => {
            const expected = {
                state: "created",
                result: ENTITIES[0],
            };
            const actual = await chorusService.addChorusLine(ENTITIES[0]);
            expect(actual).toEqual(expected);
        });
    });

    describe("getVersementsBySiret", () => {
        beforeAll(() => {
            mockedChorusLineRepository.findBySiret.mockResolvedValue([ENTITIES[0], ENTITIES[0]]);
        });

        afterEach(() => mockedChorusLineRepository.findBySiret.mockClear());

        afterAll(() => mockedChorusLineRepository.findBySiret.mockReset());

        const SIRET = ENTITIES[0].indexedInformations.siret;
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
            mockedChorusLineRepository.findBySiren.mockResolvedValue([ENTITIES[0], ENTITIES[0]]);
        });

        afterEach(() => mockedChorusLineRepository.findOneBySiren.mockClear());

        afterAll(() => mockedChorusLineRepository.findBySiren.mockReset());

        const SIREN = ENTITIES[0].indexedInformations.siret.substring(0, 9);
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
            mockedChorusLineRepository.findByEJ.mockResolvedValue([ENTITIES[0], ENTITIES[0]]);
        });

        afterEach(() => mockedChorusLineRepository.findByEJ.mockClear());

        afterAll(() => mockedChorusLineRepository.findByEJ.mockReset());

        const EJ = ENTITIES[0].indexedInformations.ej;
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
        const SIREN = ENTITIES[0].indexedInformations.siret.substring(0, 9);

        beforeEach(() => {
            mockedUniteLegalEntreprisesSerivce.isEntreprise.mockResolvedValue(false);
            mockedRnaSirenService.find.mockResolvedValue(null);
            // @ts-expect-error: mock resolve value
            mockedChorusLineRepository.findOneBySiren.mockResolvedValue(ENTITIES[0]);
        });

        afterAll(() => {
            mockedUniteLegalEntreprisesSerivce.isEntreprise.mockReset();
            mockedRnaSirenService.find.mockReset();
            mockedChorusLineRepository.findOneBySiren.mockReset();
        });

        it("should return false if siren belongs to company", async () => {
            mockedUniteLegalEntreprisesSerivce.isEntreprise.mockResolvedValueOnce(true);
            const expected = false;
            const actual = await chorusService.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should return true if a RNA is found", async () => {
            mockedRnaSirenService.find.mockResolvedValueOnce([{ rna: "W7000065", siren: SIREN }]);
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

    describe("getMostRecentOperationDate", () => {
        it("should call repository.findMostRecentOperationDate", async () => {
            await chorusService.getMostRecentOperationDate();
            expect(mockedChorusLineRepository.findMostRecentOperationDate).toHaveBeenCalledTimes(1);
        });
    });
});
