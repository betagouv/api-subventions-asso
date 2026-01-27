import request from "supertest";
import { createAndGetUserToken } from "../__helpers__/tokenHelper";
import Rna from "../../src/identifierObjects/Rna";
import Siren from "../../src/identifierObjects/Siren";
import { App } from "supertest/types";
import rnaSirenPort from "../../src/dataProviders/db/rnaSiren/rnaSiren.port";
import RnaSirenEntity from "../../src/entities/RnaSirenEntity";

const g = global as unknown as { app: App };

describe("RnaSirenController", () => {
    const RNA = new Rna("W123456789");
    const NO_MATCH_RNA = new Rna("W000000000");
    const SIREN = new Siren("123456789");

    beforeEach(async () => {
        await rnaSirenPort.insert(new RnaSirenEntity(RNA, SIREN));
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
                        message: "identifier must be valid RNA, SIREN or SIRET",
                        value: "invalid-identifier",
                    }),
                );
        });
    });
});
