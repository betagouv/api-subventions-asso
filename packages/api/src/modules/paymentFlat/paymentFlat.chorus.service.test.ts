import { PAYMENT_FLAT_DBO } from "../../dataProviders/db/paymentFlat/__fixtures__/paymentFlatDbo.fixture";
import paymentFlatPort from "../../dataProviders/db/paymentFlat/paymentFlat.port";
import { ENTITIES } from "../providers/chorus/__fixtures__/ChorusFixtures";
import ChorusAdapter from "../providers/chorus/adapters/ChorusAdapter";
import chorusService from "../providers/chorus/chorus.service";
import { DATA_BRETAGNE_RECORDS } from "../providers/dataBretagne/__fixtures__/dataBretagne.fixture";
import dataBretagneService from "../providers/dataBretagne/dataBretagne.service";
import { PAYMENT_FLAT_ENTITY } from "./__fixtures__/paymentFlatEntity.fixture";
import paymentFlatChorusService from "./paymentFlat.chorus.service";
import PaymentFlatAdapter from "./paymentFlatAdapter";

jest.mock("../../dataProviders/db/paymentFlat/paymentFlat.port");
jest.mock("../providers/dataBretagne/dataBretagne.service");
jest.mock("./paymentFlatAdapter");

describe("paymentFlatChorusService", () => {
    // beforeEach(() => {
    //     //@ts-expect-error : private methode
    //     mockGetAllDataBretagneData = jest.spyOn(paymentFlatChorusService, "getAllDataBretagneData");
    //     mockGetAllDataBretagneData.mockResolvedValue(DATA_BRETAGNE_RECORDS);
    //     mockToDbo = jest.spyOn(PaymentFlatAdapter, "toDbo");
    //     mockToDbo.mockReturnValue(PAYMENT_FLAT_DBO);
    //     mockEntities = [PAYMENT_FLAT_ENTITY, { ...PAYMENT_FLAT_ENTITY, exerciceBudgetaire: 2022 }];
    //     mockToPaymentFlatChorusEntities = jest
    //         .spyOn(paymentFlatChorusService, "toPaymentFlatChorusEntities")
    //         .mockResolvedValue(mockEntities);
    // });

    beforeAll(() => {
        jest.mocked(dataBretagneService.getMinistriesRecord).mockResolvedValue(DATA_BRETAGNE_RECORDS.ministries);
        jest.mocked(dataBretagneService.findProgramsRecord).mockResolvedValue(DATA_BRETAGNE_RECORDS.programs);
        jest.mocked(dataBretagneService.getDomaineFonctRecord).mockResolvedValue(DATA_BRETAGNE_RECORDS.domainesFonct);
        jest.mocked(dataBretagneService.getRefProgrammationRecord).mockResolvedValue(
            DATA_BRETAGNE_RECORDS.refsProgrammation,
        );
        jest.mocked(PaymentFlatAdapter.toDbo).mockReturnValue(PAYMENT_FLAT_DBO);
    });

    describe("updatePaymentsFlatCollection", () => {
        const mockToPaymentFlatChorusEntities = jest.spyOn(paymentFlatChorusService, "toPaymentFlatChorusEntities");
        // @ts-expect-error: mock private method
        const mockGetAllDataBretagneData = jest.spyOn(paymentFlatChorusService, "getAllDataBretagneData");
        const serviceMocks = [mockToPaymentFlatChorusEntities, mockGetAllDataBretagneData];
        let mockEntities;

        beforeEach(() => {
            mockEntities = [PAYMENT_FLAT_ENTITY, { ...PAYMENT_FLAT_ENTITY, exerciceBudgetaire: 2022 }];
            //@ts-expect-error : private methode
            mockGetAllDataBretagneData.mockResolvedValue(DATA_BRETAGNE_RECORDS);
            mockToPaymentFlatChorusEntities.mockResolvedValue(mockEntities);
        });

        afterEach(() => {
            serviceMocks.forEach(mock => mock.mockClear());
        });

        afterAll(() => {
            serviceMocks.forEach(mock => mock.mockRestore());
        });

        it("calls getAllDataBretagneData once", async () => {
            await paymentFlatChorusService.updatePaymentsFlatCollection();
            expect(mockGetAllDataBretagneData).toHaveBeenCalledTimes(1);
        });

        it("calls toPaymentFlatChorusEntities with all data from dataBretagneService", async () => {
            await paymentFlatChorusService.updatePaymentsFlatCollection();
            expect(mockToPaymentFlatChorusEntities).toHaveBeenCalledWith(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.domainesFonct,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
                undefined,
            );
        });

        it("should call toPaymentFlatChorusEntities with all data from dataBretagneService and exerciceBudgetaire", async () => {
            const exerciceBudgetaire = 2022;
            await paymentFlatChorusService.updatePaymentsFlatCollection(exerciceBudgetaire);
            expect(mockToPaymentFlatChorusEntities).toHaveBeenCalledWith(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.domainesFonct,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
                exerciceBudgetaire,
            );
        });

        it("should call toDbo for each entity", async () => {
            await paymentFlatChorusService.updatePaymentsFlatCollection();
            mockEntities.map((entity, index) => {
                expect(PaymentFlatAdapter.toDbo).toHaveBeenNthCalledWith(index + 1, entity);
            });
        });

        it("should call upsertMany for each batch", async () => {
            // @ts-expect-error: private var
            paymentFlatChorusService.BATCH_SIZE = 1;

            await paymentFlatChorusService.updatePaymentsFlatCollection();

            mockEntities.map((_entity, index) => {
                // PAYMENT_FLAT_DBO is the mocked value of toDbo()
                const expected = [
                    {
                        updateOne: {
                            filter: { uniqueId: PAYMENT_FLAT_DBO.uniqueId },
                            update: { $set: PAYMENT_FLAT_DBO },
                            upsert: true,
                        },
                    },
                ];
                expect(paymentFlatPort.upsertMany).toHaveBeenNthCalledWith(index + 1, expected);
            });
        });
    });

    describe("cursorFindChorusOnly", () => {
        it("should call chorusLinePort.cursorFindChorusOnly with undefined", () => {
            paymentFlatChorusService.cursorFindChorusOnly();
            expect(paymentFlatPort.cursorFindChorusOnly).toHaveBeenCalledWith(undefined);
        });

        it("should call chorusLinePort.findData with exerciceBudgetaire", () => {
            const exerciceBudgetaire = 2021;
            paymentFlatChorusService.cursorFindChorusOnly(exerciceBudgetaire);
            expect(paymentFlatPort.cursorFindChorusOnly).toHaveBeenCalledWith(exerciceBudgetaire);
        });
    });

    describe("getAllDataBretagneData", () => {
        it("should return all data from dataBretagneService", async () => {
            //@ts-expect-error : private methode
            const result = await paymentFlatChorusService.getAllDataBretagneData();
            const expected = DATA_BRETAGNE_RECORDS;
            expect(result).toEqual(expected);
        });

        it.each(["getMinistriesRecord", "findProgramsRecord", "getDomaineFonctRecord", "getRefProgrammationRecord"])(
            "should call %s",
            async methodName => {
                //@ts-expect-error : private methode
                await paymentFlatChorusService.getAllDataBretagneData();
                expect(dataBretagneService[methodName]).toHaveBeenCalledTimes(1);
            },
        );
    });

    describe("toPaymentFlatChorusEntities", () => {
        let mockChorusCursorFind: jest.SpyInstance;
        let mockToNotAggregatedChorusPaymentFlatEntity: jest.SpyInstance;

        let mockCursor;
        let mockDocuments;
        let nDocuments;

        beforeEach(() => {
            mockDocuments = [ENTITIES[1], ENTITIES[0]];

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

            mockChorusCursorFind = jest
                .spyOn(chorusService, "cursorFindDataWithoutHash")
                .mockReturnValue(mockCursor as any);
            mockToNotAggregatedChorusPaymentFlatEntity = jest
                .spyOn(ChorusAdapter, "toNotAggregatedChorusPaymentFlatEntity")
                .mockReturnValue({ ...PAYMENT_FLAT_ENTITY });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it("should call chorusCursorFind with no argument", async () => {
            await paymentFlatChorusService.toPaymentFlatChorusEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.domainesFonct,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
            );
            expect(mockChorusCursorFind).toHaveBeenCalledWith();
        });

        it("should call chorusCursorFind with exercice", async () => {
            const exercice = 2022;
            await paymentFlatChorusService.toPaymentFlatChorusEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.domainesFonct,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
                exercice,
            );
            expect(mockChorusCursorFind).toHaveBeenCalledWith(exercice);
        });

        it(`calls next for $nDocuments times`, async () => {
            await paymentFlatChorusService.toPaymentFlatChorusEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.domainesFonct,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
            );
            expect(mockCursor.next).toHaveBeenCalledTimes(nDocuments);
        });

        it("calls adapter.toNotAggregatedChorusPaymentFlatEntity for each documents", async () => {
            await paymentFlatChorusService.toPaymentFlatChorusEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.domainesFonct,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
            );
            expect(mockToNotAggregatedChorusPaymentFlatEntity).toHaveBeenCalledTimes(nDocuments);
        });

        it("should return an array of PaymentFlatEntity", async () => {
            const result = await paymentFlatChorusService.toPaymentFlatChorusEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.domainesFonct,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
            );
            const expected = [{ ...PAYMENT_FLAT_ENTITY, amount: PAYMENT_FLAT_ENTITY.amount * 2 }];
            expect(result).toEqual(expected);
        });
    });
});
