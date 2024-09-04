import dataBretagneService from "../../providers/dataBretagne/dataBretagne.service";
import { RECORDS } from "./__fixtures__/dataBretagne.fixture";
jest.mock("../../providers/dataBretagne/dataBretagne.service", () => ({
    getMinistriesRecord: jest.fn(),
    findProgramsRecord: jest.fn(),
    getDomaineFonctRecord: jest.fn(),
    getRefProgrammationRecord: jest.fn(),
}));
const mockDataBretagneService = jest.mocked(dataBretagneService);
import paymentFlatService from "./paymentFlat.service";
import { ObjectId, WithId } from "mongodb";
import chorusService from "../../providers/chorus/chorus.service";
import ChorusLineEntity from "../../providers/chorus/entities/ChorusLineEntity";
import PaymentFlatAdapter from "./paymentFlatAdapter";
import { PAYMENT_FLAT_ENTITY } from "./__fixtures__/paymentFlatEntity.fixture";
import paymentFlatPort from "../../../dataProviders/db/paymentFlat/paymentFlat.port";
import configurationsService from "../../configurations/configurations.service";
import { mock } from "node:test";

const allDataBretagneDataResolvedValue = {
    programs: RECORDS["programme"],
    ministries: RECORDS["ministry"],
    domainesFonct: RECORDS["domaineFonct"],
    refsProgrammation: RECORDS["refProgrammation"],
};

describe("PaymentFlatService", () => {
    describe("getAllDataBretagneData", () => {
        beforeAll(() => {
            mockDataBretagneService.getMinistriesRecord.mockResolvedValue(RECORDS["ministry"]);
            mockDataBretagneService.findProgramsRecord.mockResolvedValue(RECORDS["programme"]);
            mockDataBretagneService.getDomaineFonctRecord.mockResolvedValue(RECORDS["domaineFonct"]);
            mockDataBretagneService.getRefProgrammationRecord.mockResolvedValue(RECORDS["refProgrammation"]);
        });

        afterAll(() => {
            jest.restoreAllMocks();
        });

        it("should return all data from dataBretagneService", async () => {
            //@ts-expect-error : private methode
            const result = await paymentFlatService.getAllDataBretagneData();
            const expected = allDataBretagneDataResolvedValue;
            expect(result).toEqual(expected);
        });

        it.each(["getMinistriesRecord", "findProgramsRecord", "getDomaineFonctRecord", "getRefProgrammationRecord"])(
            "should call %s",
            async methodName => {
                //@ts-expect-error : private methode
                await paymentFlatService.getAllDataBretagneData();
                expect(mockDataBretagneService[methodName]).toHaveBeenCalledTimes(1);
            },
        );
    });

    describe("getChorusLastUpdateImported", () => {
        let mockConfigGetChorusUpdate: jest.SpyInstance;

        beforeAll(() => {
            mockConfigGetChorusUpdate = jest
                .spyOn(configurationsService, "getChorusLastUpdateImported")
                .mockResolvedValue({
                    _id: new ObjectId("007f191e810c19729de860ea"),
                    name: "LAST-CHORUS-OBJECT-ID",
                    data: new Date("2021-04-01"),
                    updatedAt: new Date(),
                });
        });

        afterAll(() => {
            mockConfigGetChorusUpdate.mockRestore();
        });

        it("should call configurationsService.getChorusLastUpdateImported", async () => {
            await paymentFlatService.getChorusLastUpdateImported();
            expect(mockConfigGetChorusUpdate).toHaveBeenCalledTimes(1);
        });

        it("should return lastChorusUpdate", async () => {
            const result = await paymentFlatService.getChorusLastUpdateImported();
            const expected = new Date("2021-04-01");
            expect(result).toEqual(expected);
        });

        it("should return default value if lastChorusUpdate is null", async () => {
            mockConfigGetChorusUpdate.mockResolvedValueOnce(null);
            const result = await paymentFlatService.getChorusLastUpdateImported();
            const expected = new Date("1970-01-01");
            expect(result).toEqual(expected);
        });
    });

    describe("setChorusLastUpdateImported", () => {
        let mockConfigSetChorusUpdateImported: jest.SpyInstance;

        beforeAll(() => {
            mockConfigSetChorusUpdateImported = jest
                .spyOn(configurationsService, "setChorusLastUpdateImported")
                .mockImplementation(jest.fn());
        });

        afterAll(() => {
            mockConfigSetChorusUpdateImported.mockRestore();
        });

        it("should call configurationsService.setChorusLastUpdateImported", async () => {
            const lastUpdate = new Date("2021-05-01");
            await paymentFlatService.setChorusLastUpdateImported(lastUpdate);

            expect(mockConfigSetChorusUpdateImported).toHaveBeenCalledWith(lastUpdate);
        });
    });

    describe("updatePaymentsFlatCollection", () => {
        const mockDocument1 = {
            updated: new Date("2021-05-02"),
            _id: new ObjectId("607f191e810c19729de860eb"),
            indexedInformations: {},
        } as WithId<ChorusLineEntity>;

        const mockDocument2 = {
            updated: new Date("2021-04-03"),
            _id: new ObjectId("507f291e810c19729de860ec"),
            indexedInformations: {},
        } as WithId<ChorusLineEntity>;

        let mockGetAllDataBretagneData: jest.SpyInstance;
        let mockchorusCursorFind: jest.SpyInstance;
        let mockToPaymentFlatEntity: jest.SpyInstance;
        let mockUpsertOne: jest.SpyInstance;
        let mockGetChorusLastUpdateImported: jest.SpyInstance;
        let mockSetChrousLastUpdateImported: jest.SpyInstance;
        let mockCursor;

        beforeEach(() => {
            //@ts-expect-error : private methode
            mockGetAllDataBretagneData = jest.spyOn(paymentFlatService, "getAllDataBretagneData");
            mockGetAllDataBretagneData.mockResolvedValue(allDataBretagneDataResolvedValue);
            mockGetChorusLastUpdateImported = jest
                .spyOn(paymentFlatService, "getChorusLastUpdateImported")
                .mockResolvedValue(new Date("2021-04-01"));
            mockSetChrousLastUpdateImported = jest
                .spyOn(paymentFlatService, "setChorusLastUpdateImported")
                .mockImplementation(jest.fn());
            mockCursor = {
                next: jest
                    .fn()
                    .mockReturnValueOnce(mockDocument1)
                    .mockReturnValueOnce(mockDocument2)
                    .mockReturnValueOnce(null),
            };

            mockchorusCursorFind = jest.spyOn(chorusService, "chorusCursorFindData").mockReturnValue(mockCursor as any);
            mockToPaymentFlatEntity = jest
                .spyOn(PaymentFlatAdapter, "toPaymentFlatEntity")
                .mockReturnValue(PAYMENT_FLAT_ENTITY);
            mockUpsertOne = jest.spyOn(paymentFlatPort, "upsertOne").mockImplementation(jest.fn());
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it("should call getAllDataBretagneData", async () => {
            const result = await paymentFlatService.updatePaymentsFlatCollection();
            expect(mockGetAllDataBretagneData).toHaveBeenCalledTimes(1);
        });

        it("should call getChorusLastObjectId", async () => {
            await paymentFlatService.updatePaymentsFlatCollection();
            expect(mockGetChorusLastUpdateImported).toHaveBeenCalledTimes(1);
        });

        it("should call chorusCursorFind once", async () => {
            await paymentFlatService.updatePaymentsFlatCollection();
            expect(mockchorusCursorFind).toHaveBeenCalledTimes(1);
        });

        it("should call next for times : number of documents + 1", async () => {
            await paymentFlatService.updatePaymentsFlatCollection();
            expect(mockCursor.next).toHaveBeenCalledTimes(3);
        });

        it("should set newChorusLastUpdate", async () => {
            await paymentFlatService.updatePaymentsFlatCollection();

            expect(mockSetChrousLastUpdateImported).toHaveBeenCalledWith(mockDocument1.updated);
        });

        it("should call toPaymentFlatEntity for number of documents times", async () => {
            await paymentFlatService.updatePaymentsFlatCollection();
            expect(mockToPaymentFlatEntity).toHaveBeenCalledTimes(2);
        });

        it("should call upsertOne for number of documents times", async () => {
            await paymentFlatService.updatePaymentsFlatCollection();
            expect(mockUpsertOne).toHaveBeenCalledTimes(2);
        });
    });
});
