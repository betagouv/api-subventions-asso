import request from "supertest";
import { createAndGetAdminToken } from "../../__helpers__/tokenHelper";

const g = global as unknown as { app: unknown };

describe("Tools http interface", () => {
    describe("/tools/scdl/validate", () => {
        it("returns errors as csv", async () => {
            const response = await request(g.app)
                .post(`/tools/scdl/validate`)
                .set("x-access-token", await createAndGetAdminToken())
                .field("type", "csv")
                .field("delimiter", ",")
                .attach("file", "tests/interfaces/http/fixtures/fixture.csv");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });

        it("returns errors as excel", async () => {
            const response = await request(g.app)
                .post(`/tools/scdl/validate`)
                .set("x-access-token", await createAndGetAdminToken())
                .field("type", "excel")
                .field("pageName", "fixture")
                .field("rowOffset", "2")
                .attach("file", "tests/interfaces/http/fixtures/fixture.xlsx");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
    });
});
