import amountsVsProgramRegionService from "./amountsVsProgramRegion.service";
import AmountsVsProgramRegionAdapter from "./amountsVsProgramRegion.adapter";
import {
    AMOUNTS_VS_PROGRAM_REGION_ENTITIES,
    NOT_AGGREGATED_ENTITIES,
} from "./__fixtures__/amountsVSProgramRegion.fixture";
import amountsVsProgramRegionPort from "../../../dataProviders/db/dataViz/amountVSProgramRegion/amountsVsProgramRegion.port";
import paymentFlatChorusService from "../../paymentFlat/paymentFlat.chorus.service";
import {
    CHORUS_PAYMENT_FLAT_ENTITY,
    CHORUS_PAYMENT_FLAT_ENTITY_WITH_NULLS,
} from "../../paymentFlat/__fixtures__/paymentFlatEntity.fixture";

describe("amountsVSProgramRegionService", () => {
    describe("toAmountsVsProgramRegionEntities", () => {
        let mockAdapter: jest.SpyInstance;
        let mockCursorFindChorusOnly: jest.SpyInstance;

        let mockCursor;
        let mockDocuments;
        let nDocuments;

        beforeEach(() => {
            mockDocuments = [
                CHORUS_PAYMENT_FLAT_ENTITY,
                { ...CHORUS_PAYMENT_FLAT_ENTITY, amount: 7000 },
                CHORUS_PAYMENT_FLAT_ENTITY_WITH_NULLS,
                { ...CHORUS_PAYMENT_FLAT_ENTITY, exerciceBudgetaire: 2025 },
                { ...CHORUS_PAYMENT_FLAT_ENTITY, programNumber: "programNumber" },
                { ...CHORUS_PAYMENT_FLAT_ENTITY, regionAttachementComptable: "Occitanie" },
            ];
            nDocuments = mockDocuments.length;

            mockCursor = {
                next: jest.fn().mockImplementation(() => {
                    return mockDocuments.shift();
                }),
                hasNext: jest.fn().mockImplementation(() => {
                    if (mockDocuments.length) return true;
                    return false;
                }),
            };

            mockCursorFindChorusOnly = jest
                .spyOn(paymentFlatChorusService, "cursorFindChorusOnly")
                .mockReturnValue(mockCursor);

            mockAdapter = jest.spyOn(AmountsVsProgramRegionAdapter, "toNotAggregatedEntity");
            //* NOT_AGGREGATED_ENTITIES[1] has the same agregation key (program, budgetExercice, region)
            // of NOT_AGGREGATED_ENTITIES[0]
            // and toNotAggregatedEntity is called only for new key
            mockAdapter.mockReturnValueOnce(NOT_AGGREGATED_ENTITIES[0]);
            mockAdapter.mockReturnValueOnce(NOT_AGGREGATED_ENTITIES[2]);
            mockAdapter.mockReturnValueOnce(NOT_AGGREGATED_ENTITIES[3]);
            mockAdapter.mockReturnValueOnce(NOT_AGGREGATED_ENTITIES[4]);
            mockAdapter.mockReturnValueOnce(NOT_AGGREGATED_ENTITIES[5]);

            mockAdapter.mockReturnValue(undefined);
        });

        afterEach(() => {
            mockAdapter.mockRestore();
            mockCursorFindChorusOnly.mockRestore();
            mockCursor.next.mockRestore();
            mockCursor.hasNext.mockRestore();
        });

        it("should call cursorFindChorusOnly with the budget exercice", async () => {
            const exerciceBudgetaire = 2020;
            await amountsVsProgramRegionService.toAmountsVsProgramRegionEntities(exerciceBudgetaire);

            expect(mockCursorFindChorusOnly).toHaveBeenCalledWith(exerciceBudgetaire);
        });

        it("should call cursorFindChorusOnly without the budget exercice", async () => {
            await amountsVsProgramRegionService.toAmountsVsProgramRegionEntities();

            expect(mockCursorFindChorusOnly).toHaveBeenCalledWith(undefined);
        });

        it("should call hasNext nDocuments + 1 times", async () => {
            await amountsVsProgramRegionService.toAmountsVsProgramRegionEntities();

            expect(mockCursor.hasNext).toHaveBeenCalledTimes(nDocuments + 1);
        });

        it("should call cursor.next nDocuments times", async () => {
            await amountsVsProgramRegionService.toAmountsVsProgramRegionEntities();

            expect(mockCursor.next).toHaveBeenCalledTimes(nDocuments);
        });

        it("should call toNotAggregatedEntity for each first time occurrence of agregation key (program, year,region)", async () => {
            await amountsVsProgramRegionService.toAmountsVsProgramRegionEntities();

            expect(mockAdapter).toHaveBeenCalledTimes(AMOUNTS_VS_PROGRAM_REGION_ENTITIES.length);
        });

        it("should return the right entities", async () => {
            const actual = await amountsVsProgramRegionService.toAmountsVsProgramRegionEntities();
            const expected = AMOUNTS_VS_PROGRAM_REGION_ENTITIES;

            expect(actual).toEqual(expected);
        });
    });

    describe("init", () => {
        let mockToAmountsVsProgramRegionEntities: jest.SpyInstance;
        let mockInsertMany: jest.SpyInstance;

        beforeEach(() => {
            mockToAmountsVsProgramRegionEntities = jest
                .spyOn(amountsVsProgramRegionService, "toAmountsVsProgramRegionEntities")
                .mockResolvedValue(AMOUNTS_VS_PROGRAM_REGION_ENTITIES);

            mockInsertMany = jest.spyOn(amountsVsProgramRegionPort, "insertMany").mockImplementation(jest.fn());
        });

        afterAll(() => {
            mockToAmountsVsProgramRegionEntities.mockRestore();
            mockInsertMany.mockRestore();
        });

        it("should call toAmountsVsProgramRegionEntities", async () => {
            await amountsVsProgramRegionService.init();

            expect(mockToAmountsVsProgramRegionEntities).toHaveBeenCalledTimes(1);
        });

        it("should call insertMany with the right entities", async () => {
            await amountsVsProgramRegionService.init();

            expect(mockInsertMany).toHaveBeenCalledWith(AMOUNTS_VS_PROGRAM_REGION_ENTITIES);
        });
    });

    describe("updateCollection", () => {
        let mockToAmountsVsProgramRegionEntities: jest.SpyInstance;
        let mockUpsertMany: jest.SpyInstance;

        beforeEach(() => {
            mockToAmountsVsProgramRegionEntities = jest
                .spyOn(amountsVsProgramRegionService, "toAmountsVsProgramRegionEntities")
                .mockResolvedValue(AMOUNTS_VS_PROGRAM_REGION_ENTITIES);

            mockUpsertMany = jest.spyOn(amountsVsProgramRegionPort, "upsertMany").mockImplementation(jest.fn());
        });

        afterEach(() => {
            mockToAmountsVsProgramRegionEntities.mockRestore();
            mockUpsertMany.mockRestore();
        });

        it("should call toAmountsVsProgramRegionEntities without ExcerciceBudgetaire", async () => {
            await amountsVsProgramRegionService.updateCollection();

            expect(mockToAmountsVsProgramRegionEntities).toHaveBeenCalledWith(undefined);
        });

        it("should call toAmountsVsProgramRegionEntities with ExcerciceBudgetaire", async () => {
            const exerciceBudgetaire = 2020;
            await amountsVsProgramRegionService.updateCollection(exerciceBudgetaire);

            expect(mockToAmountsVsProgramRegionEntities).toHaveBeenCalledWith(exerciceBudgetaire);
        });

        it("should call upsertMany with the right entities", async () => {
            await amountsVsProgramRegionService.updateCollection();

            expect(mockUpsertMany).toHaveBeenCalledWith(AMOUNTS_VS_PROGRAM_REGION_ENTITIES);
        });
    });

    describe("isCollectionInitialized", () => {
        let mockHasBeenInitialized: jest.SpyInstance;

        beforeEach(() => {
            mockHasBeenInitialized = jest
                .spyOn(amountsVsProgramRegionPort, "hasBeenInitialized")
                .mockReturnValue(Promise.resolve(true));
        });

        afterEach(() => {
            mockHasBeenInitialized.mockRestore();
        });

        it("should call hasBeenInitialized", async () => {
            await amountsVsProgramRegionService.isCollectionInitialized();

            expect(mockHasBeenInitialized).toHaveBeenCalledTimes(1);
        });
    });

    describe("getAmountsVsProgramRegionData", () => {
        let mockFindAll: jest.SpyInstance;

        beforeEach(() => {
            mockFindAll = jest
                .spyOn(amountsVsProgramRegionPort, "findAll")
                .mockResolvedValue(AMOUNTS_VS_PROGRAM_REGION_ENTITIES);
        });

        afterEach(() => {
            mockFindAll.mockRestore();
        });

        it("should call findAll", () => {
            amountsVsProgramRegionService.getAmountsVsProgramRegionData();

            expect(mockFindAll).toHaveBeenCalledTimes(1);
        });
    });
});
