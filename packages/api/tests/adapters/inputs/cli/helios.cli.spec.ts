import path from "path";
import createHeliosCli from "../../../../src/adapters/inputs/cli/helios/helios.cli.factory";
import heliosAdapter from "../../../../src/adapters/outputs/db/providers/helios/helios.adapter";
import paymentFlatAdapter from "../../../../src/adapters/outputs/db/payment-flat/payment-flat.adapter";
import { expectAnyUpdateDate } from "../../../__helpers__/expect-any.helper";
import uniteLegalEntrepriseAdapter from "../../../../src/adapters/outputs/db/unite-legale-entreprise/unite-legale-entreprise.adapter";
import { Siren } from "../../../../src/identifier-objects";
import sireneStockUniteLegaleAdapter from "../../../../src/adapters/outputs/db/sirene/stock-unite-legale/sirene-stock-unite-legale.adapter";
import { ENTITIES } from "../../../../src/modules/providers/sirene/__fixtures__/sirene-stock-unite-legale.fixture";
import DEFAULT_ASSOCIATION from "../../../__fixtures__/association.fixture";
import apiAssoService from "../../../../src/modules/providers/api-asso/api-asso.service";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../src/shared/LegalCategoriesAccepted";

jest.mock("../../../../src/modules/providers/api-asso/api-asso.service");

describe("Helios CLI", () => {
    /**
     * It :
     * - persist line for association with SIREN 100000000
     * - does not persist line for company with SIREN 90000000
     * - persist the first line that is not from SIREN 100000000 or 90000000
     *
     * So only 3 lines should be persisted
     */
    describe("parse", () => {
        beforeEach(async () => {
            await sireneStockUniteLegaleAdapter.insertOne({
                ...ENTITIES[0],
                siren: new Siren(DEFAULT_ASSOCIATION.siren),
            });
            await uniteLegalEntrepriseAdapter.insertMany([{ siren: new Siren("900000000") }]);
            jest.spyOn(apiAssoService, "findAssociationBySiren").mockResolvedValue({
                categorie_juridique: [],
            });
            jest.spyOn(apiAssoService, "findAssociationBySiren").mockResolvedValueOnce({
                // @ts-expect-error: mock partial provider value
                categorie_juridique: [{ value: LEGAL_CATEGORIES_ACCEPTED[0] }],
            });
        });

        it("persists raw data", async () => {
            const cli = createHeliosCli();
            await cli.parse(path.resolve(__dirname, "./helios.fixture.ods"));
            expect((await heliosAdapter.findAll()).map(expectAnyUpdateDate)).toMatchSnapshot();
        });

        it("persists data as flat payments", async () => {
            const cli = createHeliosCli();
            await cli.parse(path.resolve(__dirname, "./helios.fixture.ods"));
            expect((await paymentFlatAdapter.findAll()).map(expectAnyUpdateDate)).toMatchSnapshot();
        });

        it("persists data as flat application", async () => {
            const cli = createHeliosCli();
            await cli.parse(path.resolve(__dirname, "./helios.fixture.ods"));
            expect((await paymentFlatAdapter.findAll()).map(expectAnyUpdateDate)).toMatchSnapshot();
        });
    });
});
