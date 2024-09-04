import { ObjectId } from "mongodb";
import paymentFlatPort from "../../../src/dataProviders/db/paymentFlat/paymentFlat.port";
import PaymentsFlatCli from "../../../src/interfaces/cli/PaymentsFlat.cli";
import paymentFlatService from "../../../src/modules/data-viz/paymentFlat/paymentFlat.service";
import chorusService from "../../../src/modules/providers/chorus/chorus.service";
import { MOCK_CURSOR, CHORUS_LAST_UPDATE, ALL_DATA_BRETAGNE_DATA } from "../../__fixtures__/paymentsFlat.fixture";

describe("PaymentsFlatCli", () => {
    let mockGetChorusLastUpdateImported: jest.SpyInstance;
    let mockChorusCursorFindData: jest.SpyInstance;
    let mockGetAllDataBretagneData: jest.SpyInstance;

    beforeEach(() => {
        mockGetChorusLastUpdateImported = jest
            .spyOn(paymentFlatService, "getChorusLastUpdateImported")
            .mockResolvedValue(CHORUS_LAST_UPDATE);
        mockChorusCursorFindData = jest
            .spyOn(chorusService, "chorusCursorFindData")
            .mockReturnValue(MOCK_CURSOR as any);
        mockGetAllDataBretagneData = jest
            //@ts-expect-error protected method
            .spyOn(paymentFlatService, "getAllDataBretagneData")
            //@ts-expect-error - je ne comprends pas trop porquoi il n'est pas content
            .mockResolvedValue(ALL_DATA_BRETAGNE_DATA);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    let cli = new PaymentsFlatCli();
    describe("resync()", () => {
        it("should persist payments flat collection", async () => {
            await cli.resync();
            //@ts-expect-error protected method
            const paymentsFlat = (await paymentFlatPort.collection.find({}).toArray()).map(paymentFlat => ({
                ...paymentFlat,
                _id: expect.any(ObjectId),
            }));

            expect(paymentsFlat).toMatchSnapshot();
        });
    });
});
