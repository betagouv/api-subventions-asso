import { App } from "supertest/types";
import request from "supertest";
import { createAndGetUserToken } from "../__helpers__/tokenHelper";
import associationSearchAdapter from "../../src/adapters/outputs/db/association-search/association-search.adapter";
import apiEntrepriseService from "../../src/modules/providers/api-entreprise/api-entreprise.service";
import rechercheEntreprisesAdapter from "../../src/adapters/outputs/api/recherche-entreprises/recherche-entreprises.adapter";
import { EMPTY_RECHERCHE_ENTREPRISES_DTO } from "../../src/adapters/outputs/api/recherche-entreprises/__fixtures__/recherche-entreprise.fixture";
import { ASSOCIATION_SEARCH_DBOS } from "../../src/adapters/outputs/db/association-search/__fixtures__/association-search.fixture";

const g = global as unknown as { app: App };

describe("/search", () => {
    beforeAll(() => {
        jest.spyOn(apiEntrepriseService, "getHeadcount").mockImplementation(async () => null);
        jest.spyOn(rechercheEntreprisesAdapter, "search").mockImplementation(
            async () => EMPTY_RECHERCHE_ENTREPRISES_DTO,
        );
    });

    describe("/associations/{input}", () => {
        beforeEach(async () => {
            await associationSearchAdapter.upsertMany(ASSOCIATION_SEARCH_DBOS);
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
                .get(`/search/associations/${ASSOCIATION_SEARCH_DBOS[0].siren}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });

        it("should return an AssociationSearchEntity from its name", async () => {
            const response = await request(g.app)
                .get(`/search/associations/${ASSOCIATION_SEARCH_DBOS[0].name}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });

        it("should return other than first page", async () => {
            const response = await request(g.app)
                .get(`/search/associations/${ASSOCIATION_SEARCH_DBOS[0].name}?page=2`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
    });
});
