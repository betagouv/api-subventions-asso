import dataBretagneService from "../../providers/dataBretagne/dataBretagne.service";
import { RECORDS } from "./__fixtures__/dataBretagne.fixture";
jest.mock("../../providers/dataBretagne/dataBretagne.service");
import paymentFlatService from "./paymentFlat.service";
import { ObjectId, WithId } from "mongodb";
import chorusService from "../../providers/chorus/chorus.service";
import ChorusLineEntity from "../../providers/chorus/entities/ChorusLineEntity";
import PaymentFlatAdapter from "./paymentFlatAdapter";
import { PAYMENT_FLAT_ENTITY } from "./__fixtures__/paymentFlatEntity.fixture";
import paymentFlatPort from "../../../dataProviders/db/paymentFlat/paymentFlat.port";

const allDataBretagneDataRsolvedValue = {
    programs: RECORDS["programme"],
    ministries: RECORDS["ministry"],
    domainesFonct: RECORDS["domaineFonct"],
    refsProgrammation: RECORDS["refProgrammation"],
};

describe("PaymentFlatService", () => {
    describe("getAllDataBretagneData", () => {
        let mockDataBretagneService;
        beforeEach(() => {
            mockDataBretagneService = {
                getMinistriesRecord: jest.fn().mockResolvedValue(RECORDS["ministry"]),
                findProgramsRecord: jest.fn().mockResolvedValue(RECORDS["programme"]),
                getDomaineFonctRecord: jest.fn().mockResolvedValue(RECORDS["domaineFonct"]),
                getRefProgrammationRecord: jest.fn().mockResolvedValue(RECORDS["refProgrammation"]),
            };

            (dataBretagneService as jest.Mocked<typeof dataBretagneService>).getMinistriesRecord =
                mockDataBretagneService.getMinistriesRecord;
            (dataBretagneService as jest.Mocked<typeof dataBretagneService>).findProgramsRecord =
                mockDataBretagneService.findProgramsRecord;
            (dataBretagneService as jest.Mocked<typeof dataBretagneService>).getDomaineFonctRecord =
                mockDataBretagneService.getDomaineFonctRecord;
            (dataBretagneService as jest.Mocked<typeof dataBretagneService>).getRefProgrammationRecord =
                mockDataBretagneService.getRefProgrammationRecord;
        });

        afterAll(() => {
            jest.resetAllMocks();
        });

        it("should return all data from dataBretagneService", async () => {
            //@ts-expect-error : private methode
            const result = await paymentFlatService.getAllDataBretagneData();
            const ministries = await dataBretagneService.getMinistriesRecord();
            const expected = allDataBretagneDataRsolvedValue;
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

    describe("upDatePaymentsFlatCollection", () => {
        const lastChorusObjectId = new ObjectId("507f191e810c19729de860ea");
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
        let mockCursor;

        beforeEach(() => {
            //@ts-expect-error : private methode
            mockGetAllDataBretagneData = jest.spyOn(paymentFlatService, "getAllDataBretagneData");
            mockGetAllDataBretagneData.mockResolvedValue(allDataBretagneDataRsolvedValue);

            mockCursor = {
                next: jest
                    .fn()
                    .mockReturnValueOnce(mockDocument1)
                    .mockReturnValueOnce(mockDocument2)
                    .mockReturnValueOnce(null),
            };

            mockchorusCursorFind = jest
                .spyOn(chorusService, "chorusCursorFindIndexedData")
                .mockResolvedValue(mockCursor as any);
            mockToPaymentFlatEntity = jest
                .spyOn(PaymentFlatAdapter, "toPaymentFlatEntity")
                .mockReturnValue(PAYMENT_FLAT_ENTITY);
            mockInsertOne = jest.spyOn(paymentFlatPort, "insertOne").mockImplementation(jest.fn());
        });

        afterEach(() => {
            mockGetAllDataBretagneData.mockRestore();
            mockchorusCursorFind.mockRestore();
            mockToPaymentFlatEntity.mockRestore();
            mockInsertOne.mockRestore();
            mockCursor.next.mockRestore();
        });

        it("should call getAllDataBretagneData", async () => {
            await paymentFlatService.upDatePaymentsFlatCollection(lastChorusObjectId);
            expect(mockGetAllDataBretagneData).toHaveBeenCalledTimes(1);
        });

        it("should call chorusCursorFind once", async () => {
            await paymentFlatService.upDatePaymentsFlatCollection(lastChorusObjectId);
            expect(mockchorusCursorFind).toHaveBeenCalledTimes(1);
        });

        it("should call next for times : number of documents + 1", async () => {
            await paymentFlatService.upDatePaymentsFlatCollection(lastChorusObjectId);
            expect(mockCursor.next).toHaveBeenCalledTimes(3);
        });

        it("should return newChorusLastUpdate", async () => {
            const result = await paymentFlatService.upDatePaymentsFlatCollection(lastChorusObjectId);
            expect(result).toEqual(mockDocument1._id);
        });

        it("should call toPaymentFlatEntity for number of ducments times", async () => {
            await paymentFlatService.upDatePaymentsFlatCollection(lastChorusObjectId);
            expect(mockToPaymentFlatEntity).toHaveBeenCalledTimes(2);
        });

        it("should call insertOne for number of ducments times", async () => {
            await paymentFlatService.upDatePaymentsFlatCollection(lastChorusObjectId);
            expect(mockInsertOne).toHaveBeenCalledTimes(2);
        });
    });
});
