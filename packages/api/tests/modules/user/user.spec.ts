import request from "supertest";
import emailDomainsRepository from "../../../src/modules/email-domains/repositories/emailDomains.repository";
import {
    BadRequestErrorCode,
    BadRequestErrorMessage,
    InternalServerErrorCode,
    InternalServerErrorMessage
} from "../../../src/shared/errors/httpErrors";
import getAdminToken from "../../__helpers__/getAdminToken";

const g = global as unknown as { app: unknown };

const SUCCESS_RESPONSE = { success: true };
const ERROR_RESPONSE = { success: false };
const VALID_DOMAIN = "rhones.fr";
const INVALID_DOMAIN = "rhones";
describe("/user", () => {
    describe("/admin", () => {
        describe("/domain", () => {
            describe("POST", () => {
                it("should return HTTP 201 with SuccessResponse", async () => {
                    await request(g.app)
                        .post("/user/admin/domain")
                        .send({ domain: VALID_DOMAIN })
                        .set("x-access-token", await getAdminToken())
                        .expect(201)
                        .expect(SUCCESS_RESPONSE);
                });

                it("should return 400 Bad Request", async () => {
                    await request(g.app)
                        .post("/user/admin/domain")
                        .send({ domain: INVALID_DOMAIN })
                        .set("x-access-token", await getAdminToken())
                        .expect(400)
                        .expect({ ...ERROR_RESPONSE, message: BadRequestErrorMessage, status: BadRequestErrorCode });
                });

                it("should return 500 Internal Server Error", async () => {
                    jest.spyOn(emailDomainsRepository, "add").mockImplementationOnce(() => {
                        throw "";
                    });
                    await request(g.app)
                        .post("/user/admin/domain")
                        .send({ domain: VALID_DOMAIN })
                        .set("x-access-token", await getAdminToken())
                        .expect(500)
                        .expect({
                            ...ERROR_RESPONSE,
                            message: InternalServerErrorMessage,
                            status: InternalServerErrorCode
                        });
                });
            });
        });
    });
});
