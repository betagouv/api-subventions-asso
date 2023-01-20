import request from "supertest";
import getUserToken from "../../../../../__helpers__/getUserToken";
import rnaSirenService from "../../../../../../src/modules/open-data/rna-siren/rnaSiren.service";

const g = global as unknown as { app: unknown };

describe("RnaSirenController", () => {
    const RNA = "W123456789";
    const SIREN = "123456789";

    beforeEach(() => {
        jest.spyOn(rnaSirenService, "getSiren");
        jest.spyOn(rnaSirenService, "getRna");
    });

    describe("GET /open-data/rna-siren/{rna}", () => {
        describe("on success", () => {
            it("should return an object", async () => {
                (rnaSirenService.getSiren as jest.Mock).mockImplementation(async () => SIREN);
                const expected = { siren: SIREN, rna: RNA };
                const actual = (
                    await request(g.app)
                        .get(`/open-data/rna-siren/${RNA}`)
                        .set("x-access-token", await getUserToken())
                        .set("Accept", "application/json")
                ).body;

                expect(actual).toEqual(expected);
            });
        });
    });

    describe("GET /open-data/rna-siren/{siren}", () => {
        describe("on success", () => {
            it("should return an object", async () => {
                (rnaSirenService.getRna as jest.Mock).mockImplementation(async () => RNA);
                const expected = { siren: SIREN, rna: RNA };
                const actual = (
                    await request(g.app)
                        .get(`/open-data/rna-siren/${SIREN}`)
                        .set("x-access-token", await getUserToken())
                        .set("Accept", "application/json")
                ).body;

                expect(actual).toEqual(expected);
            });
        });
    });
});
