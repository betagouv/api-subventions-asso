import request from "supertest"
import getUserToken from "../../../../__helpers__/getUserToken";
import getAdminToken from "../../../../__helpers__/getAdminToken";
import userService, { UserServiceErrors } from "../../../../../src/modules/user/user.service";

const g = global as unknown as { app: unknown }

describe('UserController, /user', () => {

    describe("POST /admin/roles", () => {
        it("should return 200", async () => {
            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "admin@beta.gouv.fr",
                    roles: ["admin"]
                })
                .set("x-access-token", await getAdminToken())
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({ success: true, user: { email: "admin@beta.gouv.fr", roles: ["user", "admin"] } })
        })

        it("should add role", async () => {
            await userService.createUser("futur-admin@beta.gouv.fr");

            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "futur-admin@beta.gouv.fr",
                    roles: ["admin"]
                })
                .set("x-access-token", await getAdminToken())
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({ success: true, user: { email: "futur-admin@beta.gouv.fr", roles: ["user", "admin"] } })
        })

        it("should add reject because role not exist", async () => {
            await userService.createUser("futur-admin@beta.gouv.fr");

            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "futur-admin@beta.gouv.fr",
                    roles: ["test"]
                })
                .set("x-access-token", await getAdminToken())
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchSnapshot();
        })

        it("should return 401 because user dont have rigth", async () => {
            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "admin@beta.gouv.fr",
                    roles: ["admin"]
                })
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(401);
        })

        it("should return 401 because user not connected", async () => {
            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "admin@beta.gouv.fr",
                    roles: ["admin"]
                })
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(401);
        })
    })

    describe("Put /password", () => {
        it("should return 200", async () => {
            const response = await request(g.app)
                .put("/user/password")
                .send({
                    password: "Test::11",
                })
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({ success: true, user: { email: "user@beta.gouv.fr", roles: ["user"] } })
        })

        it("should be change password", async () => {
            const result = await userService.createUser("user@beta.gouv.fr");

            if (!result.success) throw new Error("User create not works");

            await userService.activeUser(result.user);

            const response = await request(g.app)
                .put("/user/password")
                .send({
                    password: "Test::11",
                })
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(200);
            const userUpdated = await userService.findByEmail("user@beta.gouv.fr");

            expect(userUpdated).toMatchObject(result.user);
        })

        it("should add reject because password is not hard", async () => {
            const response = await request(g.app)
                .put("/user/password")
                .send({
                    password: "azerty"
                })
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchSnapshot();
        })


        it("should return 401 beacause user not connected", async () => {
            const response = await request(g.app)
                .put("/user/password")
                .send({
                    password: "Test::11",
                })
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(401);
        })
    })
});

