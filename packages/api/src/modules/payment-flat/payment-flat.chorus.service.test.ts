import { PAYMENT_FLAT_DBO } from "../../adapters/outputs/db/payment-flat/__fixtures__/payment-flat.fixture";
import paymentFlatAdapter from "../../adapters/outputs/db/payment-flat/payment-flat.adapter";
import { AggregateChorusPayments } from "../../usecases/chorus/aggregate-chorus-payments";
import { DATA_BRETAGNE_RECORDS } from "../providers/data-bretagne/__fixtures__/dataBretagne.fixture";
import dataBretagneService from "../providers/data-bretagne/data-bretagne.service";
import { CHORUS_PAYMENT_FLAT_ENTITY } from "./__fixtures__/payment-flat.fixture";
import { PaymentFlatChorusService } from "./payment-flat.chorus.service";
import PaymentFlatMapper from "./payment-flat.mapper";
import paymentFlatService from "./payment-flat.service";
import { ReadableStream } from "stream/web";

jest.mock("../../adapters/outputs/db/payment-flat/payment-flat.adapter");
jest.mock("../providers/data-bretagne/data-bretagne.service");
jest.mock("./payment-flat.mapper");
jest.mock("./payment-flat.service");
jest.mock("../providers/chorus/chorus.service");

describe("service", () => {
    const CHORUS_PAYMENTS_FLAT = [
        CHORUS_PAYMENT_FLAT_ENTITY,
        { ...CHORUS_PAYMENT_FLAT_ENTITY, exerciceBudgetaire: 2022 },
    ];

    const mockAggregate = {
        execute: jest.fn().mockResolvedValue(CHORUS_PAYMENTS_FLAT),
    } as unknown as jest.Mocked<AggregateChorusPayments>;

    const service = new PaymentFlatChorusService(mockAggregate);

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
        const mockAddToPaymentFlat = jest.spyOn(service, "addToPaymentFlat");

        beforeAll(() => {
            mockAddToPaymentFlat.mockResolvedValue();
        });

        afterAll(() => {
            mockAddToPaymentFlat.mockRestore();
        });

        it("get aggregated payments", async () => {
            await service.init();
            expect(mockAggregate.execute).toHaveBeenCalledTimes(new Date().getFullYear() - 2016); // number of years since 2017
        });

        it("adds payments flat", async () => {
            await service.init();
            expect(mockAddToPaymentFlat).toHaveBeenCalledWith(CHORUS_PAYMENTS_FLAT);
        });
    });

    describe("addToPaymentFlat", () => {
        const STREAM = {} as ReadableStream;
        let spySavePaymentsFromStream: jest.SpyInstance;
        let mockFrom: jest.SpyInstance;

        beforeEach(() => {
            spySavePaymentsFromStream = jest.spyOn(service, "savePaymentsFromStream").mockImplementation();
            mockFrom = jest.spyOn(ReadableStream, "from").mockReturnValue(STREAM);
        });

        afterEach(() => {
            spySavePaymentsFromStream.mockRestore();
        });

        it("creates stream", async () => {
            await service.addToPaymentFlat(CHORUS_PAYMENTS_FLAT);
            expect(mockFrom).toHaveBeenCalledWith(CHORUS_PAYMENTS_FLAT);
        });

        it("saves payments flat from", async () => {
            const expected = STREAM;
            await service.addToPaymentFlat(CHORUS_PAYMENTS_FLAT);
            expect(service.savePaymentsFromStream).toHaveBeenCalledWith(expected);
        });
    });

    describe("savePaymentsFromStream", () => {
        it("save payments through payment flat service", async () => {
            const STREAM = ReadableStream.from(CHORUS_PAYMENTS_FLAT);
            await service.savePaymentsFromStream(STREAM);
            expect(paymentFlatService.saveFromStream).toHaveBeenCalledWith(STREAM);
        });
    });

    describe("updatePaymentsFlatCollection", () => {
        const EXERCISE = 2022;
        let mockAddToPaymentFlat: jest.SpyInstance;

        beforeEach(() => {
            mockAddToPaymentFlat = jest.spyOn(service, "addToPaymentFlat").mockImplementation();
        });

        afterAll(() => {
            mockAddToPaymentFlat.mockRestore();
        });

        it("get aggregated payments", async () => {
            await service.updatePaymentsFlatCollection(EXERCISE);
            expect(mockAggregate.execute).toHaveBeenCalledWith(EXERCISE);
        });

        it("adds payments flat", async () => {
            await service.updatePaymentsFlatCollection(EXERCISE);
            expect(service.addToPaymentFlat).toHaveBeenCalledWith(CHORUS_PAYMENTS_FLAT);
        });
    });

    describe("cursorFindChorusOnly", () => {
        it("should call chorusPort.cursorFindChorusOnly with undefined", () => {
            service.cursorFindChorusOnly();
            expect(paymentFlatAdapter.cursorFindChorusOnly).toHaveBeenCalledWith(undefined);
        });

        it("should call chorusPort.findData with exerciceBudgetaire", () => {
            const exerciceBudgetaire = 2021;
            service.cursorFindChorusOnly(exerciceBudgetaire);
            expect(paymentFlatAdapter.cursorFindChorusOnly).toHaveBeenCalledWith(exerciceBudgetaire);
        });
    });
});
