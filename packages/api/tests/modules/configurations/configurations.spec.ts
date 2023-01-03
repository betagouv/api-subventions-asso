import request from "supertest";
import { BadRequestErrorCode, BadRequestErrorMessage } from "../../../src/shared/errors/httpErrors";
import getAdminToken from "../../__helpers__/getAdminToken";

const g = global as unknown as { app: unknown };

describe("/config", () => {
    describe("email domains", () => {
        describe("GET /domains", () => {
            it("should return SuccessResponse", async () => {
                await request(g.app)
                    .get("/config/domains")
                    .set("x-access-token", await getAdminToken())
                    .set("Accept", "application/json")
                    .expect(200, { success: true, domains: [process.env.DEFAULT_EMAIL_DOMAIN] });
            });
        });
        describe("POST /domain", () => {
            const VALID_DOMAIN = "@rhone.fr";
            const INVALID_DOMAIN = "@invalid.f";
            it("should return SuccessResponse", async () => {
                await request(g.app)
                    .post("/config/domain")
                    .send({ domain: VALID_DOMAIN })
                    .set("x-access-token", await getAdminToken())
                    .set("Accept", "application/json")
                    .expect(201, { success: true, domain: VALID_DOMAIN });
            });
            it("should return BadRequestError", async () => {
                await request(g.app)
                    .post("/config/domain")
                    .send({ domain: INVALID_DOMAIN })
                    .set("x-access-token", await getAdminToken())
                    .set("Accept", "application/json")
                    .expect(BadRequestErrorCode, { success: false, message: BadRequestErrorMessage });
            });
        });
    });
});
