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
    beforeAll(() => {
        jest.mocked(dataBretagneService.getMinistriesRecord).mockResolvedValue(DATA_BRETAGNE_RECORDS.ministries);
        jest.mocked(dataBretagneService.getProgramsRecord).mockResolvedValue(DATA_BRETAGNE_RECORDS.programs);
        jest.mocked(dataBretagneService.getFonctionalDomainsRecord).mockResolvedValue(
            DATA_BRETAGNE_RECORDS.fonctionalDomains,
        );
        jest.mocked(dataBretagneService.getProgramsRefRecord).mockResolvedValue(DATA_BRETAGNE_RECORDS.programsRef);
        jest.mocked(PaymentFlatAdapter.toDbo).mockReturnValue(PAYMENT_FLAT_DBO);
    });

    describe("updatePaymentsFlatCollection", () => {
        const mockToPaymentFlatChorusEntities = jest.spyOn(paymentFlatChorusService, "toPaymentFlatChorusEntities");
        const mockGetAllDataBretagneData = jest.spyOn(dataBretagneService, "getAllDataRecords");
        const serviceMocks = [mockToPaymentFlatChorusEntities, mockGetAllDataBretagneData];
        let mockEntities;

        beforeEach(() => {
            mockEntities = [PAYMENT_FLAT_ENTITY, { ...PAYMENT_FLAT_ENTITY, exerciceBudgetaire: 2022 }];
            mockGetAllDataBretagneData.mockResolvedValue(DATA_BRETAGNE_RECORDS);
            mockToPaymentFlatChorusEntities.mockResolvedValue(mockEntities);
        });

        afterEach(() => {
            serviceMocks.forEach(mock => mock.mockClear());
        });

        afterAll(() => {
            serviceMocks.forEach(mock => mock.mockRestore());
        });

        it("calls getAllDataRecords once", async () => {
            await paymentFlatChorusService.updatePaymentsFlatCollection();
            expect(mockGetAllDataBretagneData).toHaveBeenCalledTimes(1);
        });

        it("calls toPaymentFlatChorusEntities with all data from dataBretagneService", async () => {
            await paymentFlatChorusService.updatePaymentsFlatCollection();
            expect(mockToPaymentFlatChorusEntities).toHaveBeenCalledWith(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
                undefined,
            );
        });

        it("should call toPaymentFlatChorusEntities with all data from dataBretagneService and exerciceBudgetaire", async () => {
            const exerciceBudgetaire = 2022;
            await paymentFlatChorusService.updatePaymentsFlatCollection(exerciceBudgetaire);
            expect(mockToPaymentFlatChorusEntities).toHaveBeenCalledWith(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
                exerciceBudgetaire,
            );
        });

        it("should call upsertMany for each batch", async () => {
            // @ts-expect-error: private var
            paymentFlatChorusService.BATCH_SIZE = 1;

            await paymentFlatChorusService.updatePaymentsFlatCollection();

            // works because BATCH_SIZE = 1
            mockEntities.forEach((entity, index) => {
                expect(paymentFlatPort.upsertMany).toHaveBeenNthCalledWith(index + 1, [entity]);
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

            mockChorusCursorFind = jest.spyOn(chorusService, "cursorFind").mockReturnValue(mockCursor as any);
            mockToNotAggregatedChorusPaymentFlatEntity = jest
                .spyOn(ChorusAdapter, "toNotAggregatedChorusPaymentFlatEntity")
                .mockReturnValue({ ...PAYMENT_FLAT_ENTITY });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it("should call chorusCursorFind without exercise", async () => {
            await paymentFlatChorusService.toPaymentFlatChorusEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockChorusCursorFind).toHaveBeenCalledWith(undefined);
        });

        it("should call chorusCursorFind with exercice", async () => {
            const exercice = 2022;
            await paymentFlatChorusService.toPaymentFlatChorusEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
                exercice,
            );
            expect(mockChorusCursorFind).toHaveBeenCalledWith(exercice);
        });

        it(`calls next for $nDocuments times`, async () => {
            await paymentFlatChorusService.toPaymentFlatChorusEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockCursor.next).toHaveBeenCalledTimes(nDocuments);
        });

        it("calls adapter.toNotAggregatedChorusPaymentFlatEntity for each documents", async () => {
            await paymentFlatChorusService.toPaymentFlatChorusEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockToNotAggregatedChorusPaymentFlatEntity).toHaveBeenCalledTimes(nDocuments);
        });

        it("should return an array of PaymentFlatEntity", async () => {
            const result = await paymentFlatChorusService.toPaymentFlatChorusEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            const expected = [{ ...PAYMENT_FLAT_ENTITY, amount: PAYMENT_FLAT_ENTITY.amount * 2 }];
            expect(result).toEqual(expected);
        });
    });
});
