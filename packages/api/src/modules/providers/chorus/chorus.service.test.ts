import { ChorusService } from "./chorus.service";
import chorusAdapter from "../../../adapters/outputs/db/providers/chorus/chorus.adapter";
import { CHORUS_FSE_ENTITIES, CHORUS_ENTITIES } from "./__fixtures__/ChorusFixtures";
import CacheData from "../../../shared/Cache";
import Siret from "../../../identifier-objects/Siret";
import associationHelper from "../../associations/associations.helper";
import AssociationIdentifier from "../../../identifier-objects/AssociationIdentifier";
import chorusFseAdapter from "../../../adapters/outputs/db/providers/chorus/chorus-fse.adapter";
import { CHORUS_PAYMENT_FLAT_ENTITY } from "../../payment-flat/__fixtures__/payment-flat.fixture";
import paymentFlatService from "../../payment-flat/payment-flat.service";
import { PROGRAMS } from "../../../../tests/adapters/outputs/db/__fixtures__/state-budget-program.fixtures";
import { TransformFseToFlat } from "./use-cases/transform-fse-to-flat";

jest.mock("../../../adapters/outputs/db/providers/chorus/chorus.adapter");
jest.mock("./mappers/chorus.mapper");
jest.mock("../../../shared/helpers/StringHelper");
jest.mock("../../payment-flat/payment-flat.service");
jest.mock("../../associations/associations.helper");
jest.mock("../../payment-flat/payment-flat.chorus.service");

const mockedChorusPort = jest.mocked(chorusAdapter);

describe("ChorusService", () => {
    let service: ChorusService;
    const mockTransformFseToFlat = { execute: jest.fn() } as unknown as TransformFseToFlat;
    beforeEach(() => {
        service = new ChorusService(mockTransformFseToFlat);
        // @ts-expect-error: reassign private cache
        service.sirenBelongAssoCache = new CacheData<boolean>(1000 * 60 * 60);
    });

    describe("upsertMany", () => {
        it("should call port with entities", async () => {
            await service.upsertMany(CHORUS_ENTITIES);
        });
    });

    describe("cursorFind", () => {
        it("should call chorusPort.cursorFind", () => {
            service.cursorFind();
            expect(mockedChorusPort.cursorFind).toHaveBeenCalledWith({});
        });

        it("should call chorusPort.cursorFindOnExercise", () => {
            const exerciceBudgetaire = 2021;
            service.cursorFind(exerciceBudgetaire);
            expect(mockedChorusPort.cursorFindOnExercise).toHaveBeenCalledWith(exerciceBudgetaire);
        });
    });

    describe("getProgramCode", () => {
        it("should return code", () => {
            const expected = PROGRAMS[0].code_programme;
            const actual = service.getProgramCode(CHORUS_ENTITIES[0]);
            expect(actual).toEqual(expected);
        });
    });

    describe("sirenBelongAsso", () => {
        const SOME_PROMISE = Promise.resolve(true);

        beforeAll(() => {
            jest.mocked(associationHelper.isIdentifierFromAsso).mockReturnValue(SOME_PROMISE);
        });
        const SIREN = CHORUS_ENTITIES[0].siret!.toSiren();

        it("calls associationService test with valueObject association identifier", async () => {
            service.sirenBelongAsso(SIREN);
            expect(associationHelper.isIdentifierFromAsso).toHaveBeenCalledWith(AssociationIdentifier.fromSiren(SIREN));
        });

        it("add result to cache", async () => {
            await service.sirenBelongAsso(SIREN);
            // @ts-expect-error: private cache
            expect(service.sirenBelongAssoCache.get(SIREN.value)).toEqual(true);
        });

        it("returns result from associationServce's test", async () => {
            const expected = SOME_PROMISE;
            const actual = service.sirenBelongAsso(SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe("isEntityAccepted", () => {
        const ENTITY = CHORUS_FSE_ENTITIES[0];
        const IS_ASSO = true;
        let mockSirenBelongAsso;
        beforeEach(() => {
            mockSirenBelongAsso = jest.spyOn(service, "sirenBelongAsso").mockResolvedValue(IS_ASSO);
        });

        afterAll(() => mockSirenBelongAsso.mockRestore());

        it("check value in cache", async () => {
            const actual = await service.isEntityAccepted(ENTITY);
            expect(actual).toEqual(IS_ASSO);
        });

        it("check if siren belong to asso", async () => {
            await service.isEntityAccepted(ENTITY);
            expect(mockSirenBelongAsso).toHaveBeenCalledWith((ENTITY.identifier as Siret).toSiren());
        });

        it("returns result", async () => {
            const actual = await service.isEntityAccepted(ENTITY);
            expect(actual).toEqual(IS_ASSO);
        });
    });

    describe("persistEuropeanEntities", () => {
        // test with more than one
        const ENTITIES = [...CHORUS_FSE_ENTITIES, ...CHORUS_FSE_ENTITIES];
        let mockSyncFlat: jest.SpyInstance;
        let mockIsEntityAccepted: jest.SpyInstance;

        beforeEach(() => {
            mockSyncFlat = jest.spyOn(service, "syncFlat").mockResolvedValue();
            mockIsEntityAccepted = jest.spyOn(service, "isEntityAccepted").mockResolvedValue(true);
            jest.spyOn(chorusFseAdapter, "upsertMany").mockResolvedValue();
        });

        afterAll(() => [mockIsEntityAccepted, mockSyncFlat].map(mock => mock.mockRestore()));

        it("filters entities", async () => {
            await service.persistEuropeanEntities(ENTITIES);
            expect(mockIsEntityAccepted).toHaveBeenCalledTimes(ENTITIES.length);
        });

        it("pass entities to port", async () => {
            await service.persistEuropeanEntities(ENTITIES);
            expect(chorusFseAdapter.upsertMany).toHaveBeenCalledWith(ENTITIES);
        });
    });

    describe("savePaymentsFromStream", () => {
        it("send stream to payment flat service to handle persistance", () => {
            const STREAM = {} as ReadableStream;
            service.savePaymentsFromStream(STREAM);
            expect(paymentFlatService.saveFromStream).toHaveBeenCalledWith(STREAM);
        });
    });

    describe("syncFlat", () => {
        const STREAM = {} as ReadableStream;
        let mockSavePaymentsFromStream: jest.SpyInstance;
        let mockFrom: jest.SpyInstance;
        beforeEach(() => {
            jest.mocked(mockTransformFseToFlat.execute).mockReturnValue(CHORUS_PAYMENT_FLAT_ENTITY);
            mockSavePaymentsFromStream = jest.spyOn(service, "savePaymentsFromStream").mockResolvedValue();
            mockFrom = jest.spyOn(ReadableStream, "from").mockReturnValue(STREAM);
        });

        afterAll(() => {
            mockSavePaymentsFromStream.mockRestore();
            mockFrom.mockRestore();
        });

        it("creates stream from entities", () => {
            service.syncFlat(CHORUS_FSE_ENTITIES);
            expect(mockFrom).toHaveBeenCalledWith(CHORUS_FSE_ENTITIES.map(_entity => CHORUS_PAYMENT_FLAT_ENTITY));
        });

        it("maps entities to payment-flats", () => {
            service.syncFlat(CHORUS_FSE_ENTITIES);
            CHORUS_FSE_ENTITIES.forEach((entity, index) => {
                expect(mockTransformFseToFlat.execute).toHaveBeenNthCalledWith(index + 1, entity);
            });
        });

        it("send stream to persist flat entities", () => {
            service.syncFlat(CHORUS_FSE_ENTITIES);
            expect(mockSavePaymentsFromStream).toHaveBeenCalledWith(STREAM);
        });

        it("returns promise", () => {
            const actual = service.syncFlat(CHORUS_FSE_ENTITIES);
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
            mockSavePaymentsFromStream = jest.spyOn(service, "savePaymentsFromStream").mockResolvedValue();
        });

        afterAll(() => {
            mockSavePaymentsFromStream.mockRestore();
        });

        it("save flat from stream", async () => {
            await service.initFlat();
            expect(mockSavePaymentsFromStream).toHaveBeenCalledWith(STREAM);
        });
    });
});
