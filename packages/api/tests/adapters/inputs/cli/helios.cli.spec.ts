import path from "path";
import heliosAdapter from "../../../../src/adapters/outputs/db/providers/helios/helios.adapter";
import paymentFlatAdapter from "../../../../src/adapters/outputs/db/payment-flat/payment-flat.adapter";
import { expectAnyUpdateDate } from "../../../__helpers__/expect-any.helper";
import uniteLegalEntrepriseAdapter from "../../../../src/adapters/outputs/db/unite-legale-entreprise/unite-legale-entreprise.adapter";
import { Siren } from "../../../../src/identifier-objects";
import sireneUniteLegaleAdapter from "../../../../src/adapters/outputs/db/sirene/sirene-unite-legale.adapter";
import { ENTITIES } from "../../../../src/modules/providers/sirene/__fixtures__/sirene-unite-legale.fixture";
import DEFAULT_ASSOCIATION from "../../../__fixtures__/association.fixture";
import apiAssoService from "../../../../src/modules/providers/api-asso/api-asso.service";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../src/shared/LegalCategoriesAccepted";
import applicationFlatAdapter from "../../../../src/adapters/outputs/db/application-flat/application-flat.adapter";
import SaveHeliosDataUseCase from "../../../../src/modules/providers/helios/use-cases/save-helios-data.use-case";
import HeliosCli from "../../../../src/adapters/inputs/cli/helios/helios.cli";
import getIdentifierFromString from "../../../../src/modules/associations/use-cases/get-identifier-from-string.use-case";
import saveHeliosToFlat from "../../../../src/modules/providers/helios/use-cases/save-helios-entities-to-flat.use-case";
import { CheckIdentifierIsFromAssoUseCase } from "../../../../src/modules/associations/use-cases/check-identifier-is-from-asso.use-case";
import { CheckSirenIsFromAssoUseCase } from "../../../../src/modules/associations/use-cases/check-siren-is-from-asso.use-case";
import rnaSirenAdapter from "../../../../src/adapters/outputs/db/rna-siren/rna-siren.adapter";

jest.mock("../../../../src/modules/providers/api-asso/api-asso.service");

describe("Helios CLI", () => {
    let cli;
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
            await sireneUniteLegaleAdapter.insertOne({
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

            cli = new HeliosCli(
                new SaveHeliosDataUseCase(
                    getIdentifierFromString,
                    new CheckIdentifierIsFromAssoUseCase(
                        new CheckSirenIsFromAssoUseCase(
                            sireneUniteLegaleAdapter,
                            rnaSirenAdapter,
                            uniteLegalEntrepriseAdapter,
                            apiAssoService,
                        ),
                    ),
                    saveHeliosToFlat,
                    heliosAdapter,
                ),
            );
        });

        it("persists raw data", async () => {
            await cli.parse(path.resolve(__dirname, "./helios.fixture.ods"));
            expect((await heliosAdapter.findAll()).map(expectAnyUpdateDate)).toMatchSnapshot();
        });

        it("persists data as flat payments", async () => {
            await cli.parse(path.resolve(__dirname, "./helios.fixture.ods"));
            expect((await paymentFlatAdapter.findAll()).map(expectAnyUpdateDate)).toMatchSnapshot();
        });

        it("persists data as flat application", async () => {
            await cli.parse(path.resolve(__dirname, "./helios.fixture.ods"));
            expect((await applicationFlatAdapter.findAll()).map(expectAnyUpdateDate)).toMatchSnapshot();
        });
    });
});
