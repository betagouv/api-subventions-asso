import { ObjectId } from "mongodb";
import amountsVsProgramRegionPort from "../../../src/dataProviders/db/dataViz/amountVSProgramRegion/amountsVsProgramRegion.port";
import paymentFlatPort from "../../../src/dataProviders/db/paymentFlat/paymentFlat.port";
import AmountsVsProgramRegionCli from "../../../src/interfaces/cli/AmountsVsProgramRegion.cli";
import { CHORUS_PAYMENT_FLAT_ENTITY } from "../../../src/modules/paymentFlat/__fixtures__/paymentFlatEntity.fixture";
import PaymentFlatEntity from "../../../src/entities/PaymentFlatEntity";

const MOCK_DOCUMENTS: PaymentFlatEntity[] = [
    // the following two should be aggregated together
    { ...CHORUS_PAYMENT_FLAT_ENTITY, provider: "chorus", uniqueId: "1" },
    { ...CHORUS_PAYMENT_FLAT_ENTITY, amount: 7000, provider: "chorus", uniqueId: "2" },

    // the following two should be aggregated together
    { ...CHORUS_PAYMENT_FLAT_ENTITY, amount: 100_000, programNumber: 1234, provider: "chorus", uniqueId: "3" },
    { ...CHORUS_PAYMENT_FLAT_ENTITY, amount: 30_000, programNumber: 1234, provider: "chorus", uniqueId: "4" },

    // the following two should be aggregated together
    {
        ...CHORUS_PAYMENT_FLAT_ENTITY,
        amount: 34_000,
        attachementComptable: "HNOR",
        regionAttachementComptable: "Normandie",
        exerciceBudgetaire: 2021,
        provider: "chorus",
        uniqueId: "5",
    },
    {
        ...CHORUS_PAYMENT_FLAT_ENTITY,
        amount: 34_000,
        attachementComptable: "BNOR",
        regionAttachementComptable: "Normandie",
        exerciceBudgetaire: 2021,
        provider: "chorus",
        uniqueId: "6",
    },

    // this one should not be aggregated
    {
        ...CHORUS_PAYMENT_FLAT_ENTITY,
        amount: 34_000,
        attachementComptable: "BNOR",
        regionAttachementComptable: "Normandie",
        exerciceBudgetaire: 2024,
        provider: "chorus",
        uniqueId: "7",
    },
];

const insertData = async () => {
    await paymentFlatPort.upsertMany(MOCK_DOCUMENTS);
};

function sortResultForSnapshot(a, b) {
    if (a.regionAttachementComptable < b.regionAttachementComptable) return -1;
    if (a.regionAttachementComptable > b.regionAttachementComptable) return 1;
    if (a.programme < b.programme) return -1;
    if (a.programme > b.programme) return 1;

    return a.exerciceBudgetaire - b.exerciceBudgetaire;
}

describe("AmountsVsProgramRegionCli", () => {
    beforeEach(async () => {
        await amountsVsProgramRegionPort.deleteAll();
        await insertData();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const cli = new AmountsVsProgramRegionCli();

    describe("init()", () => {
        it("should persist amounts vs program region collection", async () => {
            await cli.init();
            //@ts-expect-error protected method
            const amountsVsProgramRegion = (await amountsVsProgramRegionPort.collection.find({}).toArray())
                .map(amountsVsProgramRegion => ({
                    ...amountsVsProgramRegion,
                    _id: expect.any(ObjectId),
                }))
                .sort(sortResultForSnapshot);

            expect(amountsVsProgramRegion).toMatchSnapshot("Snapshot init");
        });
    });

    describe("resyncExercice()", () => {
        it("should persist amounts vs program region collection for the given exercice", async () => {
            const exerciceStr = "2023";
            await cli.resyncExercice(exerciceStr);
            //@ts-expect-error protected method
            const amountsVsProgramRegion = (await amountsVsProgramRegionPort.collection.find({}).toArray())
                .map(amountsVsProgramRegion => ({
                    ...amountsVsProgramRegion,
                    _id: expect.any(ObjectId),
                }))
                .sort(sortResultForSnapshot);

            expect(amountsVsProgramRegion).toMatchSnapshot("Snapshot resyncExercice");
        });
    });
});
