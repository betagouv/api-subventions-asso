import chorusService from "./chorus.service";
import chorusAdapter from "../../../adapters/db/providers/chorus/chorus.adapter";
import { CHORUS_FSE_ENTITIES, CHORUS_ENTITIES } from "./__fixtures__/ChorusFixtures";
import CacheData from "../../../shared/Cache";
import PROGRAMS from "../../../../tests/dataProviders/db/__fixtures__/stateBudgetProgram";
import Siret from "../../../identifierObjects/Siret";
import associationHelper from "../../associations/associations.helper";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import chorusFseAdapter from "../../../adapters/db/providers/chorus/chorus.fse.adapter";
import { ChorusFseMapper } from "./mappers/chorus.fse.mapper";
import { CHORUS_PAYMENT_FLAT_ENTITY } from "../../paymentFlat/__fixtures__/payment-flat.fixture";
import paymentFlatService from "../../paymentFlat/paymentFlat.service";

jest.mock("../../../dataProviders/db/providers/chorus/chorus.adapter");
jest.mock("./mappers/chorus.mapper");
jest.mock("../../../shared/helpers/StringHelper");
jest.mock("../../paymentFlat/paymentFlat.service");
jest.mock("./mappers/chorus.fse.mapper");
jest.mock("../../associations/associations.helper");
jest.mock("../../paymentFlat/paymentFlat.chorus.service");

const mockedChorusPort = jest.mocked(chorusAdapter);

describe("chorusService", () => {
    beforeEach(() => {
        // @ts-expect-error: reassign private cache
        chorusService.sirenBelongAssoCache = new CacheData<boolean>(1000 * 60 * 60);
    });

    describe("upsertMany", () => {
        it("should call port with entities", async () => {
            await chorusService.upsertMany(CHORUS_ENTITIES);
        });
    });

    describe("cursorFind", () => {
        it("should call chorusPort.cursorFind", () => {
            chorusService.cursorFind();
            expect(mockedChorusPort.cursorFind).toHaveBeenCalledWith({});
        });

        it("should call chorusPort.cursorFindOnExercise", () => {
            const exerciceBudgetaire = 2021;
            chorusService.cursorFind(exerciceBudgetaire);
            expect(mockedChorusPort.cursorFindOnExercise).toHaveBeenCalledWith(exerciceBudgetaire);
        });
    });

    describe("getProgramCode", () => {
        it("should return code", () => {
            const expected = PROGRAMS[0].code_programme;
            const actual = chorusService.getProgramCode(CHORUS_ENTITIES[0]);
            expect(actual).toEqual(expected);
        });
    });

    describe("sirenBelongAsso", () => {
        const SOME_PROMISE = Promise.resolve(true);

        beforeAll(() => {
            jest.mocked(associationHelper.isIdentifierFromAsso).mockReturnValue(SOME_PROMISE);
        });
        const SIREN = new Siret(CHORUS_ENTITIES[0].siret).toSiren();

        it("calls associationService test with valueObject association identifier", async () => {
            chorusService.sirenBelongAsso(SIREN);
            expect(associationHelper.isIdentifierFromAsso).toHaveBeenCalledWith(AssociationIdentifier.fromSiren(SIREN));
        });

        it("add result to cache", async () => {
            await chorusService.sirenBelongAsso(SIREN);
            // @ts-expect-error: private cache
            expect(chorusService.sirenBelongAssoCache.get(SIREN.value)).toEqual(true);
        });

        it("returns result from associationServce's test", async () => {
            const expected = SOME_PROMISE;
            const actual = chorusService.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe("isAcceptedEntity", () => {
        const SIREN = new Siret(CHORUS_ENTITIES[0].siret).toSiren();
        let mockSirenBelongAsso: jest.SpyInstance;

        beforeEach(() => {
            mockSirenBelongAsso = jest.spyOn(chorusService, "sirenBelongAsso");
            mockSirenBelongAsso.mockResolvedValue(true);
        });

        afterAll(() => {
            mockSirenBelongAsso.mockRestore();
        });

        const ACCEPTED_ENTITY = CHORUS_ENTITIES[0];

        it("should return true if siret is #", async () => {
            const ENTITY = {
                ...ACCEPTED_ENTITY,
                siret: "#",
            };

            const expected = true;
            const actual = await chorusService.isAcceptedEntity(ENTITY);
            expect(actual).toEqual(expected);
        });

        it("should return true if siren belongs to an association", async () => {
            const ENTITY = {
                ...ACCEPTED_ENTITY,
                codeBranche: "Z04",
            };

            const expected = true;
            const actual = await chorusService.isAcceptedEntity(ENTITY);
            expect(actual).toEqual(expected);
        });

        it("should return false if siren does not belongs to an association", async () => {
            const ENTITY = {
                ...ACCEPTED_ENTITY,
                codeBranche: "Z99",
            };

            mockSirenBelongAsso.mockResolvedValueOnce(false);
            const expected = false;
            const actual = await chorusService.isAcceptedEntity(ENTITY);
            expect(actual).toEqual(expected);
        });

        it("should return value from sirenBelongAssoCache", async () => {
            const ENTITY = {
                ...ACCEPTED_ENTITY,
                codeBranche: "Z99",
            };

            const expected = true;
            // @ts-expect-error: set private cache
            chorusService.sirenBelongAssoCache.add(SIREN.value, expected);
            const actual = await chorusService.isAcceptedEntity(ENTITY);
            expect(actual).toEqual(expected);
            expect(mockSirenBelongAsso).toHaveBeenCalledTimes(0);
        });
    });

    describe("insertBatchChorus", () => {
        const EMPTY_ANSWER = { rejected: 0, created: 0 };

        const mockIsAcceptedEntity = jest.spyOn(chorusService, "isAcceptedEntity");
        const mockInsertMany = jest.spyOn(chorusService, "upsertMany");
        beforeEach(() => {
            mockIsAcceptedEntity.mockResolvedValue(true);
            mockInsertMany.mockResolvedValue();
        });

        it("should call upsertMany", async () => {
            await chorusService.insertBatchChorus(CHORUS_ENTITIES);
        });

        it("should return response with only created", async () => {
            const expected = { ...EMPTY_ANSWER, created: CHORUS_ENTITIES.length };
            const actual = await chorusService.insertBatchChorus(CHORUS_ENTITIES);
            expect(actual).toEqual(expected);
        });

        it("should return response with created and rejected", async () => {
            mockIsAcceptedEntity.mockResolvedValueOnce(false);
            const expected = { ...EMPTY_ANSWER, created: CHORUS_ENTITIES.length - 1, rejected: 1 };
            const actual = await chorusService.insertBatchChorus(CHORUS_ENTITIES);
            expect(actual).toEqual(expected);
        });
    });

    describe("isEntityAccepted", () => {
        const ENTITY = CHORUS_FSE_ENTITIES[0];
        const IS_ASSO = true;
        let mockSirenBelongAsso;
        beforeEach(() => {
            mockSirenBelongAsso = jest.spyOn(chorusService, "sirenBelongAsso").mockResolvedValue(IS_ASSO);
        });

        afterAll(() => mockSirenBelongAsso.mockRestore());

        it("check value in cache", async () => {
            const actual = await chorusService.isEntityAccepted(ENTITY);
            expect(actual).toEqual(IS_ASSO);
        });

        it("check if siren belong to asso", async () => {
            await chorusService.isEntityAccepted(ENTITY);
            expect(mockSirenBelongAsso).toHaveBeenCalledWith((ENTITY.identifier as Siret).toSiren());
        });

        it("returns result", async () => {
            const actual = await chorusService.isEntityAccepted(ENTITY);
            expect(actual).toEqual(IS_ASSO);
        });
    });

    describe("persistEuropeanEntities", () => {
        // test with more than one
        const ENTITIES = [...CHORUS_FSE_ENTITIES, ...CHORUS_FSE_ENTITIES];
        let mockSyncFlat: jest.SpyInstance;
        let mockIsEntityAccepted: jest.SpyInstance;

        beforeEach(() => {
            mockSyncFlat = jest.spyOn(chorusService, "syncFlat").mockResolvedValue();
            mockIsEntityAccepted = jest.spyOn(chorusService, "isEntityAccepted").mockResolvedValue(true);
            jest.spyOn(chorusFseAdapter, "upsertMany").mockResolvedValue();
        });

        afterAll(() => [mockIsEntityAccepted, mockSyncFlat].map(mock => mock.mockRestore()));

        it("filters entities", async () => {
            await chorusService.persistEuropeanEntities(ENTITIES);
            expect(mockIsEntityAccepted).toHaveBeenCalledTimes(ENTITIES.length);
        });

        it("pass entities to port", async () => {
            await chorusService.persistEuropeanEntities(ENTITIES);
            expect(chorusFseAdapter.upsertMany).toHaveBeenCalledWith(ENTITIES);
        });
    });

    describe("savePaymentsFromStream", () => {
        it("send stream to payment flat service to handle persistance", () => {
            const STREAM = {} as ReadableStream;
            chorusService.savePaymentsFromStream(STREAM);
            expect(paymentFlatService.saveFromStream).toHaveBeenCalledWith(STREAM);
        });
    });

    describe("syncFlat", () => {
        const STREAM = {} as ReadableStream;
        let mockSavePaymentsFromStream: jest.SpyInstance;
        let mockFrom: jest.SpyInstance;
        beforeEach(() => {
            jest.mocked(ChorusFseMapper.toPaymentFlat).mockReturnValue(CHORUS_PAYMENT_FLAT_ENTITY);
            mockSavePaymentsFromStream = jest.spyOn(chorusService, "savePaymentsFromStream").mockResolvedValue();
            mockFrom = jest.spyOn(ReadableStream, "from").mockReturnValue(STREAM);
        });

        afterAll(() => {
            mockSavePaymentsFromStream.mockRestore();
            mockFrom.mockRestore();
        });

        it("creates stream from entities", () => {
            chorusService.syncFlat(CHORUS_FSE_ENTITIES);
            expect(mockFrom).toHaveBeenCalledWith(CHORUS_FSE_ENTITIES.map(_entity => CHORUS_PAYMENT_FLAT_ENTITY));
        });

        it("maps entities to payment-flats", () => {
            chorusService.syncFlat(CHORUS_FSE_ENTITIES);
            CHORUS_FSE_ENTITIES.forEach((entity, index) => {
                expect(ChorusFseMapper.toPaymentFlat).toHaveBeenNthCalledWith(index + 1, entity);
            });
        });

        it("send stream to persist flat entities", () => {
            chorusService.syncFlat(CHORUS_FSE_ENTITIES);
            expect(mockSavePaymentsFromStream).toHaveBeenCalledWith(STREAM);
        });

        it("returns promise", () => {
            const actual = chorusService.syncFlat(CHORUS_FSE_ENTITIES);
            expect(actual).toBeInstanceOf(Promise);
        });
    });

    describe("initFlat", () => {
        let mockSavePaymentsFromStream;
        const STREAM = { foo: "bar" };
        // @ts-expect-error: mock readable stream
        const READABLE_STREAM = { pipeThrough: () => STREAM } as ReadableStream;

        beforeEach(() => {
            jest.spyOn(ReadableStream, "from").mockReturnValue(READABLE_STREAM);
            mockSavePaymentsFromStream = jest.spyOn(chorusService, "savePaymentsFromStream").mockResolvedValue();
        });

        afterAll(() => {
            mockSavePaymentsFromStream.mockRestore();
        });

        it("save flat from stream", async () => {
            await chorusService.initFlat();
            expect(mockSavePaymentsFromStream).toHaveBeenCalledWith(STREAM);
        });
    });
});
