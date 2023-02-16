import request = require("supertest");
import getUserToken from "../../__helpers__/getUserToken";
import getAdminToken from "../../__helpers__/getAdminToken";
import userService from "../../../src/modules/user/user.service";
import { RoleEnum } from "../../../src/@enums/Roles";

const g = global as unknown as { app: unknown };

describe("UserController, /user", () => {
    describe("POST /admin/roles", () => {
        it("should return 200", async () => {
            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "admin@beta.gouv.fr",
                    roles: [RoleEnum.admin]
                })
                .set("x-access-token", await getAdminToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                success: true,
                user: { email: "admin@beta.gouv.fr", roles: ["user", "admin"] }
            });
        });

        it("should add role", async () => {
            await userService.createUser("futur-admin@beta.gouv.fr");

            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "futur-admin@beta.gouv.fr",
                    roles: [RoleEnum.admin]
                })
                .set("x-access-token", await getAdminToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                success: true,
                user: {
                    email: "futur-admin@beta.gouv.fr",
                    roles: ["user", RoleEnum.admin]
                }
            });
        });

        it("should reject because role not exist", async () => {
            await userService.createUser("futur-admin@beta.gouv.fr");

            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "futur-admin@beta.gouv.fr",
                    roles: ["test"]
                })
                .set("x-access-token", await getAdminToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchSnapshot();
        });

        it("should return 401 because user dont have right", async () => {
            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "admin@beta.gouv.fr",
                    roles: [RoleEnum.admin]
                })
                .set("x-access-token", await getUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(401);
        });

        it("should return 401 because user not connected", async () => {
            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "admin@beta.gouv.fr",
                    roles: [RoleEnum.admin]
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(401);
        });
    });

    describe("Put /password", () => {
        it("should return 200", async () => {
            const response = await request(g.app)
                .put("/user/password")
                .send({
                    password: "Test::11"
                })
                .set("x-access-token", await getUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                success: true,
                user: { email: "user@beta.gouv.fr", roles: ["user"] }
            });
        });

        it("should change password", async () => {
            const user = await userService.createUser("user@beta.gouv.fr");
            await userService.activeUser(user);

            const response = await request(g.app)
                .put("/user/password")
                .send({
                    password: "Test::11"
                })
                .set("x-access-token", await getUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            const userUpdated = await userService.findByEmail("user@beta.gouv.fr");

            expect(userUpdated).toMatchObject(user);
        });

        it("should reject because password is too weak", async () => {
            const response = await request(g.app)
                .put("/user/password")
                .send({
                    password: "azerty"
                })
                .set("x-access-token", await getUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchSnapshot();
        });

        it("should return 401 because user not connected", async () => {
            const response = await request(g.app)
                .put("/user/password")
                .send({
                    password: "Test::11"
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(401);
        });
    });
});
