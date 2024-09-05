import { ObjectId } from "mongodb";
import paymentFlatPort from "../../../src/dataProviders/db/paymentFlat/paymentFlat.port";
import PaymentsFlatCli from "../../../src/interfaces/cli/PaymentsFlat.cli";
import paymentFlatService from "../../../src/modules/data-viz/paymentFlat/paymentFlat.service";
import {
    CHORUS_LAST_UPDATE,
    DATA_BRETAGNE_DTOS,
    MOCK_DOCUMENTS,
    PROGRAMS,
} from "../../__fixtures__/paymentsFlat.fixture";
import chorusLineRepository from "../../../src/modules/providers/chorus/repositories/chorus.line.repository";
import dataBretagnePort from "../../../src/dataProviders/api/dataBretagne/dataBretagne.port";
import stateBudgetProgramPort from "../../../src/dataProviders/db/state-budget-program/stateBudgetProgram.port";

const insertData = async () => {
    await paymentFlatService.setChorusLastUpdateImported(CHORUS_LAST_UPDATE);
    await chorusLineRepository.upsertMany(MOCK_DOCUMENTS);
    await stateBudgetProgramPort.replace(PROGRAMS);
};

describe("PaymentsFlatCli", () => {
    let mockGetCollection: jest.SpyInstance;
    let mockDataBretagneLogin: jest.SpyInstance;
    beforeEach(async () => {
        await insertData();

        mockGetCollection = jest
            .spyOn(dataBretagnePort, "getCollection")
            .mockImplementation(collection => DATA_BRETAGNE_DTOS[collection]);
    });

    mockDataBretagneLogin = jest.spyOn(dataBretagnePort, "login").mockImplementation(jest.fn());

    afterEach(() => {
        jest.restoreAllMocks();
    });

    let cli = new PaymentsFlatCli();
    describe("resync()", () => {
        it("should persist payments flat collection", async () => {
            await cli.resync();
            //@ts-expect-error protected method
            const paymentsFlat = (await paymentFlatPort.collection.find({}).toArray())
                .map(paymentFlat => ({
                    ...paymentFlat,
                    _id: expect.any(ObjectId),
                }))
                .sort((a, b) => Number(a.uniqueId) - Number(b.uniqueId));

            expect(paymentsFlat).toMatchSnapshot();
        });
    });
});
