import request = require("supertest");
import getUserToken from "../../__helpers__/getUserToken";
import { createAndGetConsumerToken, createAndGetUserToken } from "../../__helpers__/tokenHelper";

const g = global as unknown as { app: unknown };

describe("/consumer", () => {
    describe("GET /token", () => {
        it("should return 401", async () => {
            await request(g.app)
                .get("/consumer/token")
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .expect(401);
        });

        it("should return token", async () => {
            await request(g.app)
                .get("/consumer/token")
                .set("x-access-token", await createAndGetConsumerToken())
                .set("Accept", "application/json")
                .expect(200)
                .then(response => {
                    expect(response.body).toBeDefined();
                });
        });

        // it("should add role", async () => {
        //     await userService.createUser("futur-admin@beta.gouv.fr");

        //     const response = await request(g.app)
        //         .post("/user/admin/roles")
        //         .send({
        //             email: "futur-admin@beta.gouv.fr",
        //             roles: [RoleEnum.admin]
        //         })
        //         .set("x-access-token", await getAdminToken())
        //         .set("Accept", "application/json");

        //     expect(response.statusCode).toBe(200);
        //     expect(response.body).toMatchObject({
        //         user: {
        //             email: "futur-admin@beta.gouv.fr",
        //             roles: ["user", RoleEnum.admin]
        //         }
        //     });
        // });
    });
});
