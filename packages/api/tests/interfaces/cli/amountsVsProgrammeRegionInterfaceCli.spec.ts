import amountsVsProgrammeRegionPort from "../../../src/dataProviders/db/dataViz/amountVSProgrammeRegion/amountsVsProgrammeRegion.port";
import { PAYMENT_FLAT_DBO } from "../../../src/dataProviders/db/paymentFlat/__fixtures__/paymentFlatDbo.fixture";
import paymentFlatPort from "../../../src/dataProviders/db/paymentFlat/paymentFlat.port"
import { PAYMENT_FLAT_ENTITY } from "../../../src/modules/paymentFlat/__fixtures__/paymentFlatEntity.fixture";


const MOCK_DOCUMENTS = [
    PAYMENT_FLAT_DBO,
    { ...PAYMENT_FLAT_DBO, montant : 7000 },
    { ...PAYMENT_FLAT_DBO, montant : 100_000, numeroProgramme : "1234" },
    { ...PAYMENT_FLAT_DBO, montant: 34_000, attachementComptable : "HNOR" },
];

const insertData = async () => {
    await paymentFlatPort.upsertMany(MOCK_DOCUMENTS);

};

describe("AmountsVsProgrammeRegionCli", () => {
    beforeEach(async () => {
        await amountsVsProgrammeRegionPort.deleteAll();
        await insertData();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    let cli = new AmountsVsProgrammeRegionCli();

    
});