import request from "supertest";
import { ASSOCIATION_SEARCH_DBOS } from "../../../../src/adapters/outputs/db/association-search/__fixtures__/association-search.fixture";
import db from "../../../../src/shared/MongoConnection";
import { createAndGetUserToken } from "../../../__helpers__/tokenHelper";
import DEFAULT_ASSOCIATION from "../../../__fixtures__/association.fixture";
import { App } from "supertest/types";

const g = global as unknown as { app: App };

describe("/search", () => {
    describe("/association/{identifier}", () => {
        beforeEach(() => {
            db.collection("association-search").insertMany(ASSOCIATION_SEARCH_DBOS);
        });

        it("returns result from rna", async () => {
            await request(g.app)
                .get(`/search/associations/${DEFAULT_ASSOCIATION.rna}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .then(res => {
                    expect(res.body).toMatchSnapshot();
                });
        });

        it("returns result from siren", async () => {
            await request(g.app)
                .get(`/search/associations/${DEFAULT_ASSOCIATION.siren}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .then(res => {
                    expect(res.body).toMatchSnapshot();
                });
        });

        it("returns result from siret", async () => {
            await request(g.app)
                .get(`/search/associations/${DEFAULT_ASSOCIATION.siret}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .then(res => {
                    expect(res.body).toMatchSnapshot();
                });
        });

        // odd for now but was asked : nothing should return as none of the establishment as this post code
        it("filter by post code", async () => {
            await request(g.app)
                .get(`/search/associations/${DEFAULT_ASSOCIATION.rna}?postalCode=35000`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .then(res => {
                    expect(res.body).toMatchSnapshot();
                });
        });

        it("rejects invalid postal code", async () => {
            await request(g.app)
                .get(`/search/associations/${DEFAULT_ASSOCIATION.rna}}?postalCode=7A`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .expect(400)
                .then(res => expect(res.body.message).toEqual("postalCode must contain between 2 and 5 digits"));
        });
    });

    describe("/association/{text}", () => {
        beforeEach(() => {
            db.collection("association-search").insertMany(ASSOCIATION_SEARCH_DBOS);
        });

        it("returns results matching text", async () => {
            await request(g.app)
                .get(`/search/associations/tennis`) // ASSOCIATION_SEARCH_DBOS[1] and ASSOCIATION_SEARCH_DBOS[2]
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .then(res => {
                    expect(res.body).toMatchSnapshot();
                });
        });

        it("filter by post code", async () => {
            await request(g.app)
                .get(`/search/associations/tennis?postalCode=69001`) // ASSOCIATION_SEARCH_DBOS[2]
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .then(res => {
                    expect(res.body).toMatchSnapshot();
                });
        });

        it("returns results from object field", async () => {
            await request(g.app)
                .get(`/search/associations/balle`) // ASSOCIATION_SEARCH_DBOS[1] and ASSOCIATION_SEARCH_DBOS[2]
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .then(res => {
                    expect(res.body).toMatchSnapshot();
                });
        });

        it("search only plain words", async () => {
            await request(g.app)
                .get(`/search/associations/bal`) // ASSOCIATION_SEARCH_DBOS[4]
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .then(res => {
                    expect(res.body).toMatchSnapshot();
                });
        });
    });
});
