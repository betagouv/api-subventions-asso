import request from "supertest";
import getAdminToken from "../../__helpers__/getAdminToken";

const g = global as unknown as { app: unknown };

describe("/domain", () => {
    describe("POST", () => {
        const VALID_DOMAIN = "@rhones.fr";
        it("should return SuccessResponse", async () => {
            await request(g.app)
                .post("/domain")
                .send({ domain: VALID_DOMAIN })
                .set("x-access-token", await getAdminToken())
                .set("Accept", "application/json")
                .expect(201, { success: true, domain: VALID_DOMAIN });
        });
    });
});
