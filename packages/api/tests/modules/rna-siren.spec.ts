import request from "supertest";
import { createAndGetUserToken } from "../__helpers__/tokenHelper";
import Rna from "../../src/identifier-objects/Rna";
import { App } from "supertest/types";
import db from "../../src/shared/MongoConnection";
import { ASSOCIATION_SEARCH_DBOS } from "../../src/adapters/outputs/db/association-search/__fixtures__/association-search.fixture";
import { Siren } from "../../src/identifier-objects";

const g = global as unknown as { app: App };

describe("RnaSirenController", () => {
    const RNA = new Rna(ASSOCIATION_SEARCH_DBOS[0].rna!);
    const NO_MATCH_RNA = new Rna("W000000001");
    const SIREN = new Siren(ASSOCIATION_SEARCH_DBOS[0].siren!);

    beforeEach(async () => {
        await db.collection("association-search").insertOne(ASSOCIATION_SEARCH_DBOS[0]);
    });

    describe("GET /open-data/rna-siren/{identifier}", () => {
        it("returns data with RNA", async () => {
            const expected = [{ siren: SIREN.value, rna: RNA.value }];
            await request(g.app)
                .get(`/open-data/rna-siren/${RNA.value}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .expect(200)
                .then(res => res.body === expected);
        });

        it("returns data with SIREN", async () => {
            const expected = [{ siren: SIREN.value, rna: RNA.value }];
            await request(g.app)
                .get(`/open-data/rna-siren/${SIREN.value}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .expect(200)
                .then(res => res.body === expected);
        });

        it("returns a 204 when no identifier found", async () => {
            await request(g.app)
                .get(`/open-data/rna-siren/${NO_MATCH_RNA.value}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .expect(204);
        });

        it("returns a 422 when identifier is not valid", async () => {
            await request(g.app)
                .get(`/open-data/rna-siren/invalid-identifier`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .expect(422)
                .then(res =>
                    expect(res.body).toEqual({
                        message: "Identifier must be valid RNA, SIREN or SIRET",
                        value: "invalid-identifier",
                    }),
                );
        });
    });
});
