import request = require("supertest");
import { createAndGetUserToken } from "../__helpers__/tokenHelper";
import uniteLegalNamePort from "../../src/dataProviders/db/uniteLegalName/uniteLegalName.port";
import AssociationNameFixture from "../__fixtures__/association-name.fixture";
import apiEntrepriseService from "../../src/modules/providers/apiEntreprise/apiEntreprise.service";
import dauphinService from "../../src/modules/providers/dauphin/dauphin.service";
import rechercheEntreprises from "../../src/dataProviders/api/rechercheEntreprises/rechercheEntreprises.port";

const g = global as unknown as { app: unknown };

describe("/search", () => {
    beforeAll(() => {
        jest.spyOn(apiEntrepriseService, "getHeadcount").mockImplementation(async () => null);
        jest.spyOn(rechercheEntreprises, "search").mockImplementation(async () => []);
        jest.spyOn(dauphinService, "getDemandeSubventionBySiret").mockImplementation(async () => []);
        jest.spyOn(dauphinService, "getDemandeSubventionBySiren").mockImplementation(async () => []);
    });

    describe("/associations/{input}", () => {
        beforeEach(async () => {
            Promise.all(AssociationNameFixture.map(fixture => uniteLegalNamePort.insert(fixture)));
        });

        it("should return 204", async () => {
            const response = await request(g.app)
                .get(`/search/associations/NOT_FOUND_ASSO}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(204);
        });

        it("should return an Association from its Siren", async () => {
            const response = await request(g.app)
                .get(`/search/associations/${AssociationNameFixture[0].siren}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot({
                result: [{ name: AssociationNameFixture[0].name, siren: AssociationNameFixture[0].siren }],
            });
        });
        it("should return an AssociationNameEntity from its name", async () => {
            const response = await request(g.app)
                .get(`/search/associations/${AssociationNameFixture[0].name}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot({
                result: [{ name: AssociationNameFixture[0].name, siren: AssociationNameFixture[0].siren }],
            });
        });
    });
});
