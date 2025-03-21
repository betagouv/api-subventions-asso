import { ObjectId } from "mongodb";
import amountsVsProgramRegionPort from "../../../src/dataProviders/db/dataViz/amountVSProgramRegion/amountsVsProgramRegion.port";
import { PAYMENT_FLAT_DBO } from "../../../src/dataProviders/db/paymentFlat/__fixtures__/paymentFlatDbo.fixture";
import paymentFlatPort from "../../../src/dataProviders/db/paymentFlat/paymentFlat.port";
import AmountsVsProgramRegionCli from "../../../src/interfaces/cli/AmountsVsProgramRegion.cli";

const MOCK_DOCUMENTS = [
    // the following two should be agregated together
    { ...PAYMENT_FLAT_DBO, provider: "chorus", uniqueId: "1" },
    { ...PAYMENT_FLAT_DBO, montant: 7000, provider: "chorus", uniqueId: "2" },

    // the following two should be agregated together
    { ...PAYMENT_FLAT_DBO, montant: 100_000, numeroProgramme: "1234", provider: "chorus", uniqueId: "3" },
    { ...PAYMENT_FLAT_DBO, montant: 30_000, numeroProgramme: "1234", provider: "chorus", uniqueId: "4" },

    // the following two should be agregated together
    {
        ...PAYMENT_FLAT_DBO,
        montant: 34_000,
        attachementComptable: "HNOR",
        regionAttachementComptable: "Normandie",
        exerciceBudgetaire: 2021,
        provider: "chorus",
        uniqueId: "5",
    },
    {
        ...PAYMENT_FLAT_DBO,
        montant: 34_000,
        attachementComptable: "BNOR",
        regionAttachementComptable: "Normandie",
        exerciceBudgetaire: 2021,
        provider: "chorus",
        uniqueId: "6",
    },

    // this one should not be agregated
    {
        ...PAYMENT_FLAT_DBO,
        montant: 34_000,
        attachementComptable: "BNOR",
        regionAttachementComptable: "Normandie",
        exerciceBudgetaire: 2024,
        provider: "chorus",
        uniqueId: "7",
    },
];

const insertData = async () => {
    const bulkWriteArray = MOCK_DOCUMENTS.map(dbo => {
        const { _id, ...DboWithoutId } = dbo;
        return {
            updateOne: {
                filter: { uniqueId: DboWithoutId.uniqueId },
                update: { $set: DboWithoutId },
                upsert: true,
            },
        };
    });

    await paymentFlatPort.upsertMany(bulkWriteArray);
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

    let cli = new AmountsVsProgramRegionCli();

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
