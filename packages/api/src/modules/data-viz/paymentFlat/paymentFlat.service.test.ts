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
import { mock } from "node:test";
import configurationsService from "../../configurations/configurations.service";
import { update } from "lodash";

const allDataBretagneDataResolvedValue = {
    programs: RECORDS["programme"],
    ministries: RECORDS["ministry"],
    domainesFonct: RECORDS["domaineFonct"],
    refsProgrammation: RECORDS["refProgrammation"],
};

describe("PaymentFlatService", () => {
    describe("getAllDataBretagneData", () => {
        //let mockDataBretagneService;

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

    describe("getChorusLastObjectId", () => {
        let mockConfigGetChorusObjectId: jest.SpyInstance;

        beforeAll(() => {
            mockConfigGetChorusObjectId = jest.spyOn(configurationsService, "getChorusLastObjectId").mockResolvedValue({
                _id: new ObjectId("007f191e810c19729de860ea"),
                name: "LAST-CHORUS-OBJECT-ID",
                data: new ObjectId("507f191e810c19729de860ea"),
                updatedAt: new Date(),
            });
        });

        afterAll(() => {
            mockConfigGetChorusObjectId.mockRestore();
        });

        it("should call configurationsService.getChorusLastObjectId", async () => {
            await paymentFlatService.getChorusLastObjectId();
            expect(mockConfigGetChorusObjectId).toHaveBeenCalledTimes(1);
        });

        it("should return lastChorusObjectId", async () => {
            const result = await paymentFlatService.getChorusLastObjectId();
            const expected = new ObjectId("507f191e810c19729de860ea");
            expect(result).toEqual(expected);
        });

        it("should return default value if lastChorusObjectId is null", async () => {
            mockConfigGetChorusObjectId.mockResolvedValueOnce(null);
            const result = await paymentFlatService.getChorusLastObjectId();
            const expected = new ObjectId("000000000000000000000000");
            expect(result).toEqual(expected);
        });
    });

    describe("setChorusLastObjectId", () => {
        let mockConfigSetChorusObjectId: jest.SpyInstance;

        beforeAll(() => {
            mockConfigSetChorusObjectId = jest
                .spyOn(configurationsService, "setChorusLastObjectId")
                .mockImplementation(jest.fn());
        });

        afterAll(() => {
            mockConfigSetChorusObjectId.mockRestore();
        });

        it("should call configurationsService.setChorusLastObjectId", async () => {
            const lastObjectId = new ObjectId("000000000000000000000000");
            await paymentFlatService.setChorusLastObjectId(lastObjectId);

            expect(mockConfigSetChorusObjectId).toHaveBeenCalledWith(lastObjectId);
        });
    });

    describe("updatePaymentsFlatCollection", () => {
        const mockDocument1 = {
            _id: new ObjectId("607f191e810c19729de860eb"),
            indexedInformations: {},
        } as WithId<ChorusLineEntity>;

        const mockDocument2 = {
            _id: new ObjectId("507f291e810c19729de860ec"),
            indexedInformations: {},
        } as WithId<ChorusLineEntity>;

        let mockGetAllDataBretagneData: jest.SpyInstance;
        let mockchorusCursorFind: jest.SpyInstance;
        let mockToPaymentFlatEntity: jest.SpyInstance;
        let mockInsertOne: jest.SpyInstance;
        let mockGetChorusLastObjectId: jest.SpyInstance;
        let mockSetChrousLastObjectId: jest.SpyInstance;
        let mockCursor;

        beforeEach(() => {
            //@ts-expect-error : private methode
            mockGetAllDataBretagneData = jest.spyOn(paymentFlatService, "getAllDataBretagneData");
            mockGetAllDataBretagneData.mockResolvedValue(allDataBretagneDataResolvedValue);
            mockGetChorusLastObjectId = jest
                .spyOn(paymentFlatService, "getChorusLastObjectId")
                .mockResolvedValue(new ObjectId("507f191e810c19729de860ea"));
            mockSetChrousLastObjectId = jest
                .spyOn(paymentFlatService, "setChorusLastObjectId")
                .mockImplementation(jest.fn());
            mockCursor = {
                next: jest
                    .fn()
                    .mockReturnValueOnce(mockDocument1)
                    .mockReturnValueOnce(mockDocument2)
                    .mockReturnValueOnce(null),
            };

            mockchorusCursorFind = jest
                .spyOn(chorusService, "chorusCursorFindIndexedData")
                .mockReturnValue(mockCursor as any);
            mockToPaymentFlatEntity = jest
                .spyOn(PaymentFlatAdapter, "toPaymentFlatEntity")
                .mockReturnValue(PAYMENT_FLAT_ENTITY);
            mockInsertOne = jest.spyOn(paymentFlatPort, "insertOne").mockImplementation(jest.fn());
        });

        afterEach(() => {
            mockGetAllDataBretagneData.mockRestore();
            mockchorusCursorFind.mockRestore();
            mockToPaymentFlatEntity.mockRestore();
            mockGetChorusLastObjectId.mockRestore();
            mockSetChrousLastObjectId.mockRestore();
            mockInsertOne.mockRestore();
            mockCursor.next.mockRestore();
        });

        it("should call getAllDataBretagneData", async () => {
            await paymentFlatService.updatePaymentsFlatCollection();
            expect(mockGetAllDataBretagneData).toHaveBeenCalledTimes(1);
        });

        it("should call getChorusLastObjectId", async () => {
            await paymentFlatService.updatePaymentsFlatCollection();
            expect(mockGetChorusLastObjectId).toHaveBeenCalledTimes(1);
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

            expect(mockSetChrousLastObjectId).toHaveBeenCalledWith(mockDocument1._id);
        });

        it("should call toPaymentFlatEntity for number of documents times", async () => {
            await paymentFlatService.updatePaymentsFlatCollection();
            expect(mockToPaymentFlatEntity).toHaveBeenCalledTimes(2);
        });

        it("should call insertOne for number of documents times", async () => {
            await paymentFlatService.updatePaymentsFlatCollection();
            expect(mockInsertOne).toHaveBeenCalledTimes(2);
        });
    });
});
