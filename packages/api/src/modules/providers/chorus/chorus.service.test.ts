import chorusService from "./chorus.service";
import chorusLineRepository from "../../../dataProviders/db/providers/chorus/chorus.line.port";
jest.mock("../../../dataProviders/db/providers/chorus/chorus.line.port");
const mockedChorusLineRepository = jest.mocked(chorusLineRepository);
import ChorusAdapter from "./adapters/ChorusAdapter";
jest.mock("./adapters/ChorusAdapter");
import uniteLegalEntreprisesSerivce from "../uniteLegalEntreprises/uniteLegal.entreprises.service";
jest.mock("../uniteLegalEntreprises/uniteLegal.entreprises.service");
const mockedUniteLegalEntreprisesSerivce = jest.mocked(uniteLegalEntreprisesSerivce);
import * as StringHelper from "../../../shared/helpers/StringHelper";
jest.mock("../../../shared/helpers/StringHelper");
const mockedStringHelper = jest.mocked(StringHelper);
import * as SirenHelper from "../../../shared/helpers/SirenHelper";
jest.mock("../../../shared/helpers/SirenHelper");
const mockedSirenHelper = jest.mocked(SirenHelper);
import rnaSirenService from "../../rna-siren/rnaSiren.service";
jest.mock("../../rna-siren/rnaSiren.service");
const mockedRnaSirenService = jest.mocked(rnaSirenService);
import { ENTITIES, PAYMENTS } from "./__fixtures__/ChorusFixtures";
import CacheData from "../../../shared/Cache";
import { BulkWriteResult, WithId } from "mongodb";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import dataBretagneService from "../dataBretagne/dataBretagne.service";
import PROGRAMS from "../../../../tests/dataProviders/db/__fixtures__/stateBudgetProgram";
import Siren from "../../../valueObjects/Siren";
import Siret from "../../../valueObjects/Siret";
import Rna from "../../../valueObjects/Rna";
import AssociationIdentifier from "../../../valueObjects/AssociationIdentifier";
import { isObjectBindingPattern } from "typescript";

describe("chorusService", () => {
    beforeAll(() => {
        // 101 and 102 used as chorus program in tests
        dataBretagneService.programsByCode = {
            [PROGRAMS[0].code_programme]: PROGRAMS[0],
            [PROGRAMS[2].code_programme]: PROGRAMS[2],
        };
    });

    describe("upsertMany", () => {
        it("should call repository with entities", async () => {
            await chorusService.upsertMany(ENTITIES);
        });
    });

    describe("rawToPayment", () => {
        it("should call ChorusAdapter", () => {
            // @ts-expect-error: parameter type
            const rawGrant = { data: ENTITIES[0] } as RawGrant;
            chorusService.rawToPayment(rawGrant);
            expect(ChorusAdapter.rawToPayment).toHaveBeenCalledWith(rawGrant, PROGRAMS[0]);
        });

        it("should return ChorusPayment", () => {
            // @ts-expect-error: parameter type
            const rawGrant = { data: ENTITIES[0] } as RawGrant;
            jest.mocked(ChorusAdapter.rawToPayment).mockReturnValueOnce(PAYMENTS[0]);
            const expected = PAYMENTS[0];
            const actual = chorusService.rawToPayment(rawGrant);
            expect(actual).toEqual(expected);
        });
    });

    describe("Get payments", () => {
        let toVersementArrayMock: jest.SpyInstance;
        beforeAll(() => {
            // @ts-expect-error: toPaymentArray is private
            toVersementArrayMock = jest.spyOn(chorusService, "toPaymentArray");

            toVersementArrayMock.mockImplementation(data => data);
        });

        afterAll(() => {
            toVersementArrayMock.mockRestore();
        });

        describe("chorusCursorFindDataWithoutHash", () => {
            it("should call chorusLineRepository.findData with undefined", () => {
                chorusService.cursorFindDataWithoutHash();
                expect(mockedChorusLineRepository.cursorFindDataWithoutHash).toHaveBeenCalledWith(undefined);
            });

            it("should call chorusLineRepository.findData with exerciceBudgetaire", () => {
                const exerciceBudgetaire = 2021;
                chorusService.cursorFindDataWithoutHash(exerciceBudgetaire);
                expect(mockedChorusLineRepository.cursorFindDataWithoutHash).toHaveBeenCalledWith(exerciceBudgetaire);
            });
        });
    });

    describe("getProgramCode", () => {
        const expected = 101;
        const actual = chorusService.getProgramCode(ENTITIES[0]);
        expect(actual).toEqual(expected);
    });

    describe("toPaymentArray", () => {
        let mockGetProgramCode: jest.SpyInstance;

        beforeAll(() => {
            mockGetProgramCode = jest
                .spyOn(chorusService, "getProgramCode")
                .mockReturnValue(PROGRAMS[0].code_programme);
        });

        afterAll(() => {
            mockGetProgramCode.mockRestore();
        });

        it("should call toPayment for each entity", () => {
            // @ts-expect-error: test private method
            chorusService.toPaymentArray(ENTITIES);
            ENTITIES.forEach((entity, index) => {
                expect(ChorusAdapter.toPayment).toHaveBeenNthCalledWith(index + 1, entity, PROGRAMS[0]);
            });
        });
    });

    describe("sirenBelongAsso", () => {
        const SIREN = new Siret(ENTITIES[0].indexedInformations.siret).toSiren();

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
            mockedChorusLineRepository.findOneBySiren.mockResolvedValueOnce(null);
            const expected = false;
            const actual = await chorusService.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should return true if a RNA is found", async () => {
            mockedRnaSirenService.find.mockResolvedValueOnce([{ rna: new Rna("W700006589"), siren: SIREN }]);
            const expected = true;
            const actual = await chorusService.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should call chorusLineRepository.findOneBySiren()", async () => {
            await chorusService.sirenBelongAsso(SIREN);
        });

        it("should return true if document is found", async () => {
            const expected = true;
            const actual = await chorusService.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe("raw grant", () => {
        const DATA = [{ indexedInformations: { ej: "EJ" } }];

        describe("getRawGrants", () => {
            const SIREN = new Siren("123456789");
            const IDENTIFIER = AssociationIdentifier.fromSiren(SIREN);
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
                await chorusService.getRawGrants(IDENTIFIER);
            });

            it("returns raw grant data", async () => {
                const actual = await chorusService.getRawGrants(IDENTIFIER);
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

    describe("isAcceptedEntity", () => {
        const SIREN = new Siret(ENTITIES[0].indexedInformations.siret).toSiren();
        let mockSirenBelongAsso: jest.SpyInstance;

        beforeEach(() => {
            // @ts-expect-error: reassign private cache
            chorusService.sirenBelongAssoCache = new CacheData<boolean>(1000 * 60 * 60);
            mockSirenBelongAsso = jest.spyOn(chorusService, "sirenBelongAsso");
            mockSirenBelongAsso.mockResolvedValue(true);
        });

        afterAll(() => {
            mockSirenBelongAsso.mockRestore();
        });

        const ACCEPTED_ENTITY = ENTITIES[0];
        it("should return true if code is ASSO_BRANCHE", async () => {
            const expected = true;
            const actual = await chorusService.isAcceptedEntity(ACCEPTED_ENTITY);
            expect(actual).toEqual(expected);
        });

        it("should return true if siret is #", async () => {
            const ENTITY = {
                ...ACCEPTED_ENTITY,
                indexedInformations: { ...ACCEPTED_ENTITY.indexedInformations, siret: "#" },
            };

            const expected = true;
            const actual = await chorusService.isAcceptedEntity(ENTITY);
            expect(actual).toEqual(expected);
        });

        it("should return true if siren belongs to an association", async () => {
            const ENTITY = {
                ...ACCEPTED_ENTITY,
                indexedInformations: { ...ACCEPTED_ENTITY.indexedInformations, codeBranche: "Z04" },
            };
            const expected = true;
            const actual = await chorusService.isAcceptedEntity(ENTITY);
            expect(actual).toEqual(expected);
        });

        it("should return false if siren does not belongs to an association", async () => {
            const ENTITY = {
                ...ACCEPTED_ENTITY,
                indexedInformations: { ...ACCEPTED_ENTITY.indexedInformations, codeBranche: "Z99" },
            };
            mockSirenBelongAsso.mockResolvedValueOnce(false);
            const expected = false;
            const actual = await chorusService.isAcceptedEntity(ENTITY);
            expect(actual).toEqual(expected);
        });

        it("should return value from sirenBelongAssoCache", async () => {
            const ENTITY = {
                ...ACCEPTED_ENTITY,
                indexedInformations: { ...ACCEPTED_ENTITY.indexedInformations, codeBranche: "Z99" },
            };
            const expected = true;
            // @ts-expect-error: set private cache
            chorusService.sirenBelongAssoCache.add(SIREN.value, expected);
            const actual = await chorusService.isAcceptedEntity(ENTITY);
            expect(actual).toEqual(expected);
            expect(mockSirenBelongAsso).toHaveBeenCalledTimes(0);
        });
    });

    describe("insertBatchChorusLine", () => {
        const EMPTY_ANSWER = { rejected: 0, created: 0 };

        let mockIsAcceptedEntity: jest.SpyInstance;
        let mockInsertMany: jest.SpyInstance;
        beforeEach(() => {
            mockIsAcceptedEntity = jest.spyOn(chorusService, "isAcceptedEntity").mockResolvedValue(true);
            mockInsertMany = jest
                .spyOn(chorusService, "upsertMany")
                .mockResolvedValue(true as unknown as BulkWriteResult);
        });

        it("should call upsertMany", async () => {
            await chorusService.insertBatchChorusLine(ENTITIES);
        });

        it("should return response with only created", async () => {
            const expected = { ...EMPTY_ANSWER, created: ENTITIES.length };
            const actual = await chorusService.insertBatchChorusLine(ENTITIES);
            expect(actual).toEqual(expected);
        });

        it("should return response with created and rejected", async () => {
            mockIsAcceptedEntity.mockReturnValueOnce(false);
            const expected = { ...EMPTY_ANSWER, created: ENTITIES.length - 1, rejected: 1 };
            const actual = await chorusService.insertBatchChorusLine(ENTITIES);
            expect(actual).toEqual(expected);
        });
    });
});
