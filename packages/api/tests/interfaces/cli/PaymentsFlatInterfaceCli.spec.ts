import { ObjectId } from "mongodb";
import paymentFlatPort from "../../../src/dataProviders/db/paymentFlat/paymentFlat.port";
import PaymentsFlatCli from "../../../src/interfaces/cli/PaymentFlat.cli";
import { DATA_BRETAGNE_DTOS, MOCK_DOCUMENTS, PROGRAMS } from "../../__fixtures__/paymentsFlat.fixture";
import chorusLinePort from "../../../src/dataProviders/db/providers/chorus/chorus.line.port";
import dataBretagnePort from "../../../src/dataProviders/api/dataBretagne/dataBretagne.port";
import stateBudgetProgramPort from "../../../src/dataProviders/db/state-budget-program/stateBudgetProgram.port";

const insertData = async () => {
    await chorusLinePort.upsertMany(MOCK_DOCUMENTS);
    await stateBudgetProgramPort.replace(PROGRAMS);
};

describe("PaymentsFlatCli", () => {
    beforeAll(() => {
        // mock API call to DataBretagne
        jest.spyOn(dataBretagnePort, "login").mockImplementation(jest.fn());
        jest.spyOn(dataBretagnePort, "getCollection").mockImplementation(collection => DATA_BRETAGNE_DTOS[collection]);
    });

    beforeEach(async () => {
        await paymentFlatPort.deleteAll();
        await insertData();
    });

    const cli = new PaymentsFlatCli();

    describe("initChorus()", () => {
        it("should persist payments flat collection", async () => {
            await cli.initChorus();
            //@ts-expect-error protected method
            const paymentsFlat = (await paymentFlatPort.collection.find({}).toArray())
                .map(paymentFlat => ({
                    ...paymentFlat,
                    _id: expect.any(ObjectId),
                }))
                .sort((a, b) => Number(a.idEtablissementBeneficiaire) - Number(b.idEtablissementBeneficiaire));

            expect(paymentsFlat).toMatchSnapshot("Snapshot init");
        });
    });

    describe("resyncExercice()", () => {
        it("should persist payments flat collection for the given exercice", async () => {
            const exercice = 2023;
            await cli.resyncExercice(exercice);
            //@ts-expect-error protected method
            const paymentsFlat = (await paymentFlatPort.collection.find({}).toArray())

                .map(paymentFlat => ({
                    ...paymentFlat,
                    _id: expect.any(ObjectId),
                }))
                .sort((a, b) => Number(a.idEtablissementBeneficiaire) - Number(b.idEtablissementBeneficiaire));

            expect(paymentsFlat).toMatchSnapshot("Snapshot resyncExercice");
        });
    });
});
