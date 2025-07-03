import request from "supertest";
import { createAndGetAdminToken, createAndGetUserToken } from "../../__helpers__/tokenHelper";
import etablissementService from "../../../src/modules/etablissements/etablissements.service";
import associationsService from "../../../src/modules/associations/associations.service";
import { BadRequestError } from "core";
import DEFAULT_ASSOCIATION, {
    API_ASSO_ETABLISSEMENTS_FROM_SIREN,
    LONELY_RNA,
    SIREN_STR,
    SIRET_STR,
} from "../../__fixtures__/association.fixture";
import rnaSirenPort from "../../../src/dataProviders/db/rnaSiren/rnaSiren.port";
import Rna from "../../../src/identifierObjects/Rna";
import RnaSirenEntity from "../../../src/entities/RnaSirenEntity";
import Siren from "../../../src/identifierObjects/Siren";
import statsAssociationsVisitPort from "../../../src/dataProviders/db/stats/statsAssociationsVisit.port";
import { App } from "supertest/types";
import apiAssoService from "../../../src/modules/providers/apiAsso/apiAsso.service";

const g = global as unknown as { app: App };

const ETABLISSEMENT_SIRET = SIRET_STR;

describe("/etablissement", () => {
    const getSubventionsMock: jest.SpyInstance = jest.spyOn(etablissementService, "getSubventions");

    beforeAll(async () => {
        jest.spyOn(apiAssoService, "findEtablissementsBySiren").mockResolvedValue(API_ASSO_ETABLISSEMENTS_FROM_SIREN);
    });

    beforeEach(async () => {
        await rnaSirenPort.insert(
            new RnaSirenEntity(new Rna(DEFAULT_ASSOCIATION.rna), new Siren(DEFAULT_ASSOCIATION.siren)),
        );
    });

    afterAll(() => {
        getSubventionsMock.mockRestore();
    });

    describe("/siret/subventions", () => {
        // TODO fix these tests
        describe("on success", () => {
            const SUBVENTIONS = ["subventions"];
            const SUBVENTION_FLUX = [{ subventions: SUBVENTIONS }];

            beforeEach(() => {
                getSubventionsMock.mockImplementationOnce(() => ({
                    toPromise: async () => SUBVENTION_FLUX,
                }));
            });

            it("should return 200", async () => {
                const actual = (
                    await request(g.app)
                        .get(`/etablissement/${ETABLISSEMENT_SIRET}/subventions`)
                        .set("x-access-token", await createAndGetUserToken())
                        .set("Accept", "application/json")
                ).statusCode;

                expect(actual).toBe(200);
            });

            it("should return an object with subventions", async () => {
                const expected = { subventions: SUBVENTIONS };
                const actual = (
                    await request(g.app)
                        .get(`/etablissement/${ETABLISSEMENT_SIRET}/subventions`)
                        .set("x-access-token", await createAndGetUserToken())
                        .set("Accept", "application/json")
                ).body;

                expect(actual).toEqual(expected);
            });
        });
    });

    describe("/siret/grants", () => {
        it("should return grants", async () => {
            // SIREN must be from an association
            await rnaSirenPort.insert({
                siren: new Siren(DEFAULT_ASSOCIATION.siren),
                rna: new Rna(DEFAULT_ASSOCIATION.rna),
            });
            const response = await request(g.app)
                .get(`/etablissement/${ETABLISSEMENT_SIRET}/grants`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
    });

    describe("/siret", () => {
        it("should add one visits on stats AssociationsVisit", async () => {
            const beforeRequestTime = new Date();
            await rnaSirenPort.insert(new RnaSirenEntity(new Rna(LONELY_RNA), new Siren(SIREN_STR)));
            await request(g.app)
                .get(`/etablissement/${SIRET_STR}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            const actual = (await statsAssociationsVisitPort.findOnPeriod(beforeRequestTime, new Date()))[0];
            expect(actual).toMatchObject({
                associationIdentifier: SIRET_STR.slice(0, 9),
            });
        });

        it("should not add one visits on stats AssociationsVisit beacause user is admin", async () => {
            const beforeRequestTime = new Date();
            await request(g.app)
                .get(`/etablissement/${SIRET_STR}`)
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json");

            const actual = await statsAssociationsVisitPort.findOnPeriod(beforeRequestTime, new Date());
            expect(actual).toHaveLength(0);
        });

        it("should not add one visits on stats AssociationsVisit beacause user is not authentified", async () => {
            const beforeRequestTime = new Date();
            await request(g.app).get(`/etablissement/${SIRET_STR}`).set("Accept", "application/json");

            const actual = await statsAssociationsVisitPort.findOnPeriod(beforeRequestTime, new Date());
            expect(actual).toHaveLength(0);
        });

        it("should not add one visits on stats AssociationsVisit beacause status is not 200", async () => {
            const beforeRequestTime = new Date();
            jest.spyOn(associationsService, "getAssociation").mockImplementationOnce(() => {
                throw new BadRequestError();
            });
            await request(g.app).get(`/etablissement/${SIRET_STR}`).set("Accept", "application/json");

            const actual = await statsAssociationsVisitPort.findOnPeriod(beforeRequestTime, new Date());
            expect(actual).toHaveLength(0);
        });
    });
});
