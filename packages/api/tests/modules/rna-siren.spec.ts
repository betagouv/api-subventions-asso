import request = require("supertest");
import { createAndGetUserToken } from "../__helpers__/tokenHelper";
import rnaSirenService from "../../src/modules/rna-siren/rnaSiren.service";
import Rna from "../../src/valueObjects/Rna";
import Siren from "../../src/valueObjects/Siren";

import { App } from "supertest/types";

const g = global as unknown as { app: App };

describe("RnaSirenController", () => {
    const RNA = new Rna("W123456789");
    const SIREN = new Siren("123456789");

    beforeEach(() => {
        jest.spyOn(rnaSirenService, "find");
    });

    describe("GET /open-data/rna-siren/{rna}", () => {
        describe("on success", () => {
            it("should return an object", async () => {
                const expected = [{ siren: SIREN.value, rna: RNA.value }];
                (rnaSirenService.find as jest.Mock).mockResolvedValueOnce([{ siren: SIREN, rna: RNA }]);
                const actual = await request(g.app)
                    .get(`/open-data/rna-siren/${RNA.value}`)
                    .set("x-access-token", await createAndGetUserToken())
                    .set("Accept", "application/json");
                expect(actual.body).toEqual(expected);
            });
        });
    });

    describe("GET /open-data/rna-siren/{siren}", () => {
        describe("on success", () => {
            it("should return an object", async () => {
                const expected = [{ siren: SIREN.value, rna: RNA.value }];
                (rnaSirenService.find as jest.Mock).mockResolvedValueOnce([{ siren: SIREN, rna: RNA }]);
                const actual = (
                    await request(g.app)
                        .get(`/open-data/rna-siren/${SIREN.value}`)
                        .set("x-access-token", await createAndGetUserToken())
                        .set("Accept", "application/json")
                ).body;

                expect(actual).toEqual(expected);
            });
        });
    });
});
