import { App } from "supertest/types";
import request from "supertest";
import { createAndGetUserToken } from "../__helpers__/tokenHelper";
import uniteLegalNamePort from "../../src/dataProviders/db/uniteLegalName/uniteLegalName.port";
import AssociationNameFixture from "../__fixtures__/association-name.fixture";
import apiEntrepriseService from "../../src/modules/providers/apiEntreprise/apiEntreprise.service";
import dauphinService from "../../src/modules/providers/dauphin-gispro/dauphin.service";
import rechercheEntreprisesPort from "../../src/dataProviders/api/rechercheEntreprises/rechercheEntreprises.port";

const g = global as unknown as { app: App };

describe("/search", () => {
    beforeAll(() => {
        jest.spyOn(apiEntrepriseService, "getHeadcount").mockImplementation(async () => null);
        jest.spyOn(rechercheEntreprisesPort, "search").mockImplementation(async () => []);
        jest.spyOn(dauphinService, "getDemandeSubvention").mockImplementation(async () => []);
    });

    describe("/associations/{input}", () => {
        beforeEach(async () => {
            Promise.all(AssociationNameFixture.map(fixture => uniteLegalNamePort.upsert(fixture)));
        });

        it("should return 200", async () => {
            const response = await request(g.app)
                .get(`/search/associations/NOT_FOUND_ASSO}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
        });

        it("should return an Association from its Siren", async () => {
            const response = await request(g.app)
                .get(`/search/associations/${AssociationNameFixture[0].siren}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot({
                results: [{ name: AssociationNameFixture[0].name, siren: AssociationNameFixture[0].siren.value }],
                nbPages: 1,
                page: 1,
                total: 1,
            });
        });

        it("should return an AssociationNameEntity from its name", async () => {
            const response = await request(g.app)
                .get(`/search/associations/${AssociationNameFixture[0].name}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot({
                results: [{ name: AssociationNameFixture[0].name, siren: AssociationNameFixture[0].siren.value }],
                nbPages: 1,
                page: 1,
                total: 1,
            });
        });

        it("should return other than first page", async () => {
            const response = await request(g.app)
                .get(`/search/associations/${AssociationNameFixture[0].name}?page=2`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot({
                results: [],
                nbPages: 1,
                page: 2,
                total: 1,
            });
        });
    });
});
