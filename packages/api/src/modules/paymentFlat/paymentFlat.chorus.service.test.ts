import { PAYMENT_FLAT_DBO } from "../../dataProviders/db/paymentFlat/__fixtures__/paymentFlatDbo.fixture";
import paymentFlatPort from "../../dataProviders/db/paymentFlat/paymentFlat.port";
import { ENTITIES } from "../providers/chorus/__fixtures__/ChorusFixtures";
import ChorusMapper from "../providers/chorus/mappers/chorus.mapper";
import chorusService from "../providers/chorus/chorus.service";
import { DATA_BRETAGNE_RECORDS } from "../providers/dataBretagne/__fixtures__/dataBretagne.fixture";
import dataBretagneService from "../providers/dataBretagne/dataBretagne.service";
import { CHORUS_PAYMENT_FLAT_ENTITY } from "./__fixtures__/paymentFlatEntity.fixture";
import paymentFlatChorusService from "./paymentFlat.chorus.service";
import PaymentFlatMapper from "./payment-flat.mapper";
import paymentFlatService from "./paymentFlat.service";

jest.mock("../../dataProviders/db/paymentFlat/paymentFlat.port");
jest.mock("../providers/dataBretagne/dataBretagne.service");
jest.mock("./payment-flat.mapper");
jest.mock("./paymentFlat.service");
jest.mock("../providers/chorus/chorus.service");

describe("paymentFlatChorusService", () => {
    const CHORUS_PAYMENTS_FLAT = [
        CHORUS_PAYMENT_FLAT_ENTITY,
        { ...CHORUS_PAYMENT_FLAT_ENTITY, exerciceBudgetaire: 2022 },
    ];

    beforeAll(() => {
        jest.mocked(dataBretagneService.getMinistriesRecord).mockResolvedValue(DATA_BRETAGNE_RECORDS.ministries);
        jest.mocked(dataBretagneService.getProgramsRecord).mockResolvedValue(DATA_BRETAGNE_RECORDS.programs);
        jest.mocked(dataBretagneService.getFonctionalDomainsRecord).mockResolvedValue(
            DATA_BRETAGNE_RECORDS.fonctionalDomains,
        );
        jest.mocked(dataBretagneService.getProgramsRefRecord).mockResolvedValue(DATA_BRETAGNE_RECORDS.programsRef);
        jest.mocked(PaymentFlatMapper.toDbo).mockReturnValue(PAYMENT_FLAT_DBO);
    });

    describe("init", () => {
        const mockGetAllDataRecords = jest.spyOn(dataBretagneService, "getAllDataRecords");
        const mockToPaymentFlatChorusEntities = jest.spyOn(paymentFlatChorusService, "toAggregatedPaymentFlatEntities");
        const mockAddToPaymentFlat = jest.spyOn(paymentFlatChorusService, "addToPaymentFlat");

        beforeAll(() => {
            mockGetAllDataRecords.mockResolvedValue(DATA_BRETAGNE_RECORDS);
            mockToPaymentFlatChorusEntities.mockResolvedValue(CHORUS_PAYMENTS_FLAT);
            mockAddToPaymentFlat.mockResolvedValue();
        });

        afterAll(() => {
            mockToPaymentFlatChorusEntities.mockRestore();
            mockAddToPaymentFlat.mockRestore();
        });

        it("retrieves DataBretagne data", async () => {
            await paymentFlatChorusService.init();
            expect(mockGetAllDataRecords).toHaveBeenCalledTimes(1);
        });

        it("adapte entities", async () => {
            await paymentFlatChorusService.init();
            expect(mockToPaymentFlatChorusEntities).toHaveBeenCalledTimes(new Date().getFullYear() - 2016); // number of years since 2017
        });

        it("adds payments flat", async () => {
            await paymentFlatChorusService.init();
            expect(mockAddToPaymentFlat).toHaveBeenCalledWith(CHORUS_PAYMENTS_FLAT);
        });
    });

    describe("addToPaymentFlat", () => {
        const STREAM = {} as ReadableStream;
        let spySavePaymentsFromStream: jest.SpyInstance;
        let mockFrom: jest.SpyInstance;

        beforeEach(() => {
            spySavePaymentsFromStream = jest
                .spyOn(paymentFlatChorusService, "savePaymentsFromStream")
                .mockImplementation();
            mockFrom = jest.spyOn(ReadableStream, "from").mockReturnValue(STREAM);
        });

        afterEach(() => {
            spySavePaymentsFromStream.mockRestore();
        });

        it("creates stream", async () => {
            await paymentFlatChorusService.addToPaymentFlat(CHORUS_PAYMENTS_FLAT);
            expect(mockFrom).toHaveBeenCalledWith(CHORUS_PAYMENTS_FLAT);
        });

        it("saves payments flat from", async () => {
            const expected = STREAM;
            await paymentFlatChorusService.addToPaymentFlat(CHORUS_PAYMENTS_FLAT);
            expect(paymentFlatChorusService.savePaymentsFromStream).toHaveBeenCalledWith(expected);
        });
    });

    describe("savePaymentsFromStream", () => {
        it("save payments through payment flat service", async () => {
            const STREAM = ReadableStream.from(CHORUS_PAYMENTS_FLAT);
            await paymentFlatChorusService.savePaymentsFromStream(STREAM);
            expect(paymentFlatService.saveFromStream).toHaveBeenCalledWith(STREAM);
        });
    });

    describe("updatePaymentsFlatCollection", () => {
        let mockToPaymentFlatChorusEntities: jest.SpyInstance;
        let mockAddToPaymentFlat: jest.SpyInstance;
        let mockGetAllDataBretagneData: jest.SpyInstance;

        beforeEach(() => {
            mockGetAllDataBretagneData = jest
                .spyOn(dataBretagneService, "getAllDataRecords")
                .mockResolvedValue(DATA_BRETAGNE_RECORDS);
            mockAddToPaymentFlat = jest.spyOn(paymentFlatChorusService, "addToPaymentFlat").mockImplementation();
            mockToPaymentFlatChorusEntities = jest
                .spyOn(paymentFlatChorusService, "toAggregatedPaymentFlatEntities")
                .mockResolvedValue(CHORUS_PAYMENTS_FLAT);
        });

        afterAll(() => {
            mockToPaymentFlatChorusEntities.mockRestore();
            mockAddToPaymentFlat.mockRestore();
        });

        it("calls getAllDataRecords once", async () => {
            await paymentFlatChorusService.updatePaymentsFlatCollection();
            expect(mockGetAllDataBretagneData).toHaveBeenCalledTimes(1);
        });

        it("calls toAggregatedPaymentFlatEntities with all data from dataBretagneService", async () => {
            await paymentFlatChorusService.updatePaymentsFlatCollection();
            expect(mockToPaymentFlatChorusEntities).toHaveBeenCalledWith(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
                undefined,
            );
        });

        it("should call toAggregatedPaymentFlatEntities with all data from dataBretagneService and exerciceBudgetaire", async () => {
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

        it("adds payments flat", async () => {
            await paymentFlatChorusService.updatePaymentsFlatCollection();

            expect(paymentFlatChorusService.addToPaymentFlat).toHaveBeenCalledWith(CHORUS_PAYMENTS_FLAT);
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

    describe("toAggregatedPaymentFlatEntities", () => {
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

            mockChorusCursorFind = jest.spyOn(chorusService, "cursorFind").mockReturnValue(mockCursor);
            mockToNotAggregatedChorusPaymentFlatEntity = jest
                .spyOn(ChorusMapper, "toNotAggregatedPaymentFlatEntity")
                .mockReturnValue({ ...CHORUS_PAYMENT_FLAT_ENTITY });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it("should call chorusCursorFind without exercise", async () => {
            console.log(paymentFlatChorusService.toAggregatedPaymentFlatEntities);
            await paymentFlatChorusService.toAggregatedPaymentFlatEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockChorusCursorFind).toHaveBeenCalledWith(undefined);
        });

        it("should call chorusCursorFind with exercice", async () => {
            const exercice = 2022;
            await paymentFlatChorusService.toAggregatedPaymentFlatEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
                exercice,
            );
            expect(mockChorusCursorFind).toHaveBeenCalledWith(exercice);
        });

        it(`calls next for $nDocuments times`, async () => {
            await paymentFlatChorusService.toAggregatedPaymentFlatEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockCursor.next).toHaveBeenCalledTimes(nDocuments);
        });

        it("calls adapter.toNotAggregatedPaymentFlatEntity for each documents", async () => {
            await paymentFlatChorusService.toAggregatedPaymentFlatEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockToNotAggregatedChorusPaymentFlatEntity).toHaveBeenCalledTimes(nDocuments);
        });

        it("should return an array of PaymentFlatEntity", async () => {
            const result = await paymentFlatChorusService.toAggregatedPaymentFlatEntities(
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            const expected = [{ ...CHORUS_PAYMENT_FLAT_ENTITY, amount: CHORUS_PAYMENT_FLAT_ENTITY.amount * 2 }];
            expect(result).toEqual(expected);
        });
    });
});
