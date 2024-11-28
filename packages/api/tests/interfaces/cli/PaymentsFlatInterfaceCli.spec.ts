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
import chorusLineRepository from "../../../src/dataProviders/db/providers/chorus/chorus.line.port";
import dataBretagnePort from "../../../src/dataProviders/api/dataBretagne/dataBretagne.port";
import stateBudgetProgramPort from "../../../src/dataProviders/db/state-budget-program/stateBudgetProgram.port";

const insertData = async () => {
    await paymentFlatService.setChorusLastUpdateImported(CHORUS_LAST_UPDATE);
    await chorusLineRepository.upsertMany(MOCK_DOCUMENTS);
    await stateBudgetProgramPort.replace(PROGRAMS);
};

describe("PaymentsFlatCli", () => {
    beforeEach(async () => {
        await insertData();
        jest.spyOn(dataBretagnePort, "login").mockImplementation(jest.fn());
        jest.spyOn(dataBretagnePort, "getCollection").mockImplementation(collection => DATA_BRETAGNE_DTOS[collection]);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    let cli = new PaymentsFlatCli();
    describe("resync()", () => {
        it("should persist payments flat collection", async () => {
            await cli.resync();

            const paymentsFlat = (await paymentFlatPort.findAll())
                .map(paymentFlat => ({
                    ...paymentFlat,
                    _id: expect.any(ObjectId),
                }))
                .sort((a, b) => Number(a.uniqueId) - Number(b.uniqueId));

            expect(paymentsFlat).toMatchSnapshot();
        });
    });
});
