import request from "supertest";
import emailDomainsService from "../../../src/modules/email-domains/emailDomains.service";
import { BadRequestErrorCode, BadRequestErrorMessage } from "../../../src/shared/errors/httpErrors";
import getAdminToken from "../../__helpers__/getAdminToken";

const g = global as unknown as { app: unknown };

describe("/domain", () => {
    describe("POST", () => {
        const VALID_DOMAIN = "@rhones.fr";
        const INVALID_DOMAIN = "@invalid.f";
        it("should return SuccessResponse", async () => {
            await request(g.app)
                .post("/domain")
                .send({ domain: VALID_DOMAIN })
                .set("x-access-token", await getAdminToken())
                .set("Accept", "application/json")
                .expect(201, { success: true, domain: VALID_DOMAIN });
        });
        it("should return BadRequestError", async () => {
            await request(g.app)
                .post("/domain")
                .send({ domain: INVALID_DOMAIN })
                .set("x-access-token", await getAdminToken())
                .set("Accept", "application/json")
                .expect(BadRequestErrorCode, { success: false, message: BadRequestErrorMessage });
        });
    });
});
