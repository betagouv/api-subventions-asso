import dataBretagneService from "../providers/dataBretagne/dataBretagne.service";
import { RECORDS } from "./__fixtures__/dataBretagne.fixture";
import { ENTITIES } from "../providers/chorus/__fixtures__/ChorusFixtures";

jest.mock("../providers/dataBretagne/dataBretagne.service", () => ({
    getMinistriesRecord: jest.fn(),
    findProgramsRecord: jest.fn(),
    getDomaineFonctRecord: jest.fn(),
    getRefProgrammationRecord: jest.fn(),
}));
const mockDataBretagneService = jest.mocked(dataBretagneService);
import paymentFlatService from "./paymentFlat.service";
import chorusService from "../providers/chorus/chorus.service";
import PaymentFlatAdapter from "./paymentFlatAdapter";
import { PAYMENT_FLAT_ENTITY } from "./__fixtures__/paymentFlatEntity.fixture";
import paymentFlatPort from "../../dataProviders/db/paymentFlat/paymentFlat.port";

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

    describe("isCollectionInitialized", () => {
        it("calls port.hasBeenInitialized", () => {
            paymentFlatService.isCollectionInitialized();
            expect(paymentFlatPort.hasBeenInitialized).toHaveBeenCalledTimes(1);
        });
    });

    describe.only("toPaymentFlatChorusEntities", () => {
        let mockChorusCursorFind: jest.SpyInstance;
        let mockToPaymentFlatEntity: jest.SpyInstance;

        let mockCursor;
        let mockDocuments;
        let nDocuments;

        beforeEach(() => {
            mockDocuments = [ENTITIES[1], ENTITIES[0], null];

            nDocuments = mockDocuments.length - 1;

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
            mockToPaymentFlatEntity = jest
                .spyOn(PaymentFlatAdapter, "toNotAggregatedChorusPaymentFlatEntity")
                .mockReturnValue({ ...PAYMENT_FLAT_ENTITY });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it("should call chorusCursorFind with no argument", async () => {
            await paymentFlatService.toPaymentFlatChorusEntities(
                RECORDS["programme"],
                RECORDS["ministry"],
                RECORDS["domaineFonct"],
                RECORDS["refProgrammation"],
            );
            expect(mockChorusCursorFind).toHaveBeenCalledWith();
        });

        it("should call chorusCursorFind with exercice", async () => {
            const exercice = 2022;
            await paymentFlatService.toPaymentFlatChorusEntities(
                RECORDS["programme"],
                RECORDS["ministry"],
                RECORDS["domaineFonct"],
                RECORDS["refProgrammation"],
                exercice,
            );
            expect(mockChorusCursorFind).toHaveBeenCalledWith(exercice);
        });

        it(`should call next for ${nDocuments} times`, async () => {
            await paymentFlatService.toPaymentFlatChorusEntities(
                RECORDS["programme"],
                RECORDS["ministry"],
                RECORDS["domaineFonct"],
                RECORDS["refProgrammation"],
            );
            expect(mockCursor.next).toHaveBeenCalledTimes(nDocuments + 1);
        });

        it("should call toPaymentFlatEntity for number of documents times", async () => {
            await paymentFlatService.toPaymentFlatChorusEntities(
                RECORDS["programme"],
                RECORDS["ministry"],
                RECORDS["domaineFonct"],
                RECORDS["refProgrammation"],
            );
            expect(mockToPaymentFlatEntity).toHaveBeenCalledTimes(nDocuments);
        });

        it("should return an array of PaymentFlatEntity", async () => {
            const result = await paymentFlatService.toPaymentFlatChorusEntities(
                RECORDS["programme"],
                RECORDS["ministry"],
                RECORDS["domaineFonct"],
                RECORDS["refProgrammation"],
            );
            const expected = [{ ...PAYMENT_FLAT_ENTITY, amount: PAYMENT_FLAT_ENTITY.amount * 2 }];
            expect(result).toEqual(expected);
        });
    });

    describe("updatePaymentsFlatCollection", () => {
        let mockToPaymentFlatChorusEntities: jest.SpyInstance;
        let mockUpsertOne: jest.SpyInstance;
        let mockGetAllDataBretagneData: jest.SpyInstance;
        let mockEntities;

        beforeEach(() => {
            //@ts-expect-error : private methode
            mockGetAllDataBretagneData = jest.spyOn(paymentFlatService, "getAllDataBretagneData");
            mockGetAllDataBretagneData.mockResolvedValue(allDataBretagneDataResolvedValue);
            mockEntities = [PAYMENT_FLAT_ENTITY, { ...PAYMENT_FLAT_ENTITY, exerciceBudgetaire: 2022 }];
            mockToPaymentFlatChorusEntities = jest
                .spyOn(paymentFlatService, "toPaymentFlatChorusEntities")
                .mockResolvedValue(mockEntities);
            mockUpsertOne = jest.spyOn(paymentFlatPort, "upsertOne").mockImplementation(jest.fn());
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it("should call getAllDataBretagneData once", async () => {
            await paymentFlatService.updatePaymentsFlatCollection();
            expect(mockGetAllDataBretagneData).toHaveBeenCalledTimes(1);
        });

        it("should call toPaymentFlatChorusEntities with all data from dataBretagneService", async () => {
            await paymentFlatService.updatePaymentsFlatCollection();
            expect(mockToPaymentFlatChorusEntities).toHaveBeenCalledWith(
                RECORDS["programme"],
                RECORDS["ministry"],
                RECORDS["domaineFonct"],
                RECORDS["refProgrammation"],
                undefined,
            );
        });

        it("should call toPaymentFlatChorusEntities with all data from dataBretagneService and exerciceBudgetaire", async () => {
            const exerciceBudgetaire = 2022;
            await paymentFlatService.updatePaymentsFlatCollection(exerciceBudgetaire);
            expect(mockToPaymentFlatChorusEntities).toHaveBeenCalledWith(
                RECORDS["programme"],
                RECORDS["ministry"],
                RECORDS["domaineFonct"],
                RECORDS["refProgrammation"],
                exerciceBudgetaire,
            );
        });

        it("should call upsertOne for each entity", async () => {
            await paymentFlatService.updatePaymentsFlatCollection();
            expect(mockUpsertOne).toHaveBeenCalledTimes(mockEntities.length);
        });

        it("should call upsertOne with each entity", async () => {
            await paymentFlatService.updatePaymentsFlatCollection();
            mockEntities.forEach(entity => {
                expect(mockUpsertOne).toHaveBeenCalledWith(entity);
            });
        });
    });
});
