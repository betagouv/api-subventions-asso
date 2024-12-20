import request = require("supertest");
import { createAndGetAdminToken } from "../__helpers__/tokenHelper";
import { BadRequestErrorCode, BadRequestErrorMessage } from "../../src/shared/errors/httpErrors";

const g = global as unknown as { app: unknown };

describe("/config", () => {
    describe("email domains", () => {
        describe("GET /domains", () => {
            it("should return SuccessResponse", async () => {
                await request(g.app)
                    .get("/config/domains")
                    .set("x-access-token", await createAndGetAdminToken())
                    .set("Accept", "application/json")
                    .expect(200, {
                        domains: [process.env.BETA_GOUV_DOMAIN],
                    });
            });
        });
        describe("POST /domains", () => {
            const VALID_DOMAIN = "@rhone.fr";
            const INVALID_DOMAIN = "@invalid.f";
            it("should return SuccessResponse", async () => {
                await request(g.app)
                    .post("/config/domains")
                    .send({ domain: VALID_DOMAIN })
                    .set("x-access-token", await createAndGetAdminToken())
                    .set("Accept", "application/json")
                    .expect(201, { domain: VALID_DOMAIN });
            });
            it("should return BadRequestError", async () => {
                await request(g.app)
                    .post("/config/domains")
                    .send({ domain: INVALID_DOMAIN })
                    .set("x-access-token", await createAndGetAdminToken())
                    .set("Accept", "application/json")
                    .expect(BadRequestErrorCode, {
                        message: BadRequestErrorMessage,
                    });
            });
        });
    });
    describe("main info banner", () => {
        describe("GET /main-info-banner", () => {
            it("should return SuccessResponse", async () => {
                await request(g.app)
                    .get("/config/main-info-banner")
                    .set("x-access-token", await createAndGetAdminToken())
                    .set("Accept", "application/json")
                    .expect(200, {});
            });
        });
        describe("POST /main-info-banner", () => {
            it("should return SuccessResponse", async () => {
                await request(g.app)
                    .post("/config/main-info-banner")
                    .send({ title: "Titre", desc: "Description" })
                    .set("x-access-token", await createAndGetAdminToken())
                    .set("Accept", "application/json")
                    .expect(201, { title: "Titre", desc: "Description" });
            });
        });
    });
});
