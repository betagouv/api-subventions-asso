import chorusService from "./chorus.service";
import chorusLinePort from "../../../dataProviders/db/providers/chorus/chorus.line.port";
jest.mock("../../../dataProviders/db/providers/chorus/chorus.line.port");
const mockedChorusLinePort = jest.mocked(chorusLinePort);
jest.mock("./adapters/ChorusAdapter");
import uniteLegalEntreprisesSerivce from "../uniteLegalEntreprises/uniteLegal.entreprises.service";
jest.mock("../uniteLegalEntreprises/uniteLegal.entreprises.service");
const mockedUniteLegalEntreprisesSerivce = jest.mocked(uniteLegalEntreprisesSerivce);
jest.mock("../../../shared/helpers/StringHelper");
jest.mock("../../../shared/helpers/SirenHelper");
import rnaSirenService from "../../rna-siren/rnaSiren.service";
jest.mock("../../rna-siren/rnaSiren.service");
const mockedRnaSirenService = jest.mocked(rnaSirenService);
import { ENTITIES } from "./__fixtures__/ChorusFixtures";
import CacheData from "../../../shared/Cache";
import { BulkWriteResult } from "mongodb";
import dataBretagneService from "../dataBretagne/dataBretagne.service";
import PROGRAMS from "../../../../tests/dataProviders/db/__fixtures__/stateBudgetProgram";
import Siret from "../../../valueObjects/Siret";
import Rna from "../../../valueObjects/Rna";

describe("chorusService", () => {
    beforeAll(() => {
        // 101 and 102 used as chorus program in tests
        dataBretagneService.programsByCode = {
            [PROGRAMS[0].code_programme]: PROGRAMS[0],
            [PROGRAMS[2].code_programme]: PROGRAMS[2],
        };
    });

    describe("upsertMany", () => {
        it("should call port with entities", async () => {
            await chorusService.upsertMany(ENTITIES);
        });
    });

    describe("cursorFind", () => {
        it("should call chorusLinePort.cursorFind", () => {
            chorusService.cursorFind();
            expect(mockedChorusLinePort.cursorFind).toHaveBeenCalledWith({});
        });

        it("should call chorusLinePort.cursorFindOnExercise", () => {
            const exerciceBudgetaire = 2021;
            chorusService.cursorFind(exerciceBudgetaire);
            expect(mockedChorusLinePort.cursorFindOnExercise).toHaveBeenCalledWith(exerciceBudgetaire);
        });
    });

    describe("getProgramCode", () => {
        it("should return code", () => {
            const expected = PROGRAMS[0].code_programme;
            const actual = chorusService.getProgramCode(ENTITIES[0]);
            expect(actual).toEqual(expected);
        });
    });

    describe("sirenBelongAsso", () => {
        const SIREN = new Siret(ENTITIES[0].indexedInformations.siret).toSiren();

        beforeEach(() => {
            mockedUniteLegalEntreprisesSerivce.isEntreprise.mockResolvedValue(false);
            mockedRnaSirenService.find.mockResolvedValue(null);
            // @ts-expect-error: mock resolve value
            mockedChorusLinePort.findOneBySiren.mockResolvedValue(ENTITIES[0]);
        });

        afterAll(() => {
            mockedUniteLegalEntreprisesSerivce.isEntreprise.mockReset();
            mockedRnaSirenService.find.mockReset();
            mockedChorusLinePort.findOneBySiren.mockReset();
        });

        it("should return false if siren belongs to company", async () => {
            mockedUniteLegalEntreprisesSerivce.isEntreprise.mockResolvedValueOnce(true);
            mockedChorusLinePort.findOneBySiren.mockResolvedValueOnce(null);
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

        it("should call chorusLinePort.findOneBySiren()", async () => {
            await chorusService.sirenBelongAsso(SIREN);
        });

        it("should return true if document is found", async () => {
            const expected = true;
            const actual = await chorusService.sirenBelongAsso(SIREN);
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

        const mockIsAcceptedEntity = jest.spyOn(chorusService, "isAcceptedEntity");
        const mockInsertMany = jest.spyOn(chorusService, "upsertMany");
        beforeEach(() => {
            mockIsAcceptedEntity.mockResolvedValue(true);
            mockInsertMany.mockResolvedValue(true as unknown as BulkWriteResult);
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
            mockIsAcceptedEntity.mockResolvedValueOnce(false);
            const expected = { ...EMPTY_ANSWER, created: ENTITIES.length - 1, rejected: 1 };
            const actual = await chorusService.insertBatchChorusLine(ENTITIES);
            expect(actual).toEqual(expected);
        });
    });
});
