import request from "supertest"
import getUserToken from "../../../../__helpers__/getUserToken";
import getAdminToken from "../../../../__helpers__/getAdminToken";
import userService from "../../../../../src/modules/user/user.service";

const g = global as unknown as { app: unknown }

describe('UserController, /user', () => {
    let log: jest.SpyInstance;
    beforeEach(() => {
        log = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        log.mockClear();
    })

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
            expect(response.body).toMatchObject({success: true, user: { email: "admin@beta.gouv.fr", roles: ["user", "admin"]}})
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
            expect(response.body).toMatchObject({ success: true, user: { email: "futur-admin@beta.gouv.fr", roles: ["user", "admin"]}})
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
                
            expect(response.statusCode).toBe(500);
            expect(response.body).toMatchObject({ success: false, message: "The role \"test\" does not exist"})
        })

        it("should return 401 beacause user dont have rigth", async () => {
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

        it("should return 401 beacause user not connected", async () => {
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

    describe("POST /forget-password", () => {
        beforeEach(async () => {
            await userService.createUser("user@beta.gouv.fr");
        })
        it("should return 200", async () => {
            const response = await request(g.app)
                .post("/user/forget-password")
                .send({
                    email: "user@beta.gouv.fr",
                })
                .set('Accept', 'application/json');

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({success: true, reset: expect.objectContaining({userId: expect.any(String)})})
        })

        it("should add reject because user not found", async () => {

            const response = await request(g.app)
                .post("/user/forget-password")
                .send({
                    email: "useraa@beta.gouv.fr",
                })
                .set('Accept', 'application/json')
                
            expect(response.statusCode).toBe(500);
            expect(response.body).toMatchObject({ success: false, message: "User not found"})
        })

    })

    describe("POST /reset-password", () => {
        it("should return 200", async () => {
            await userService.createUser("test-reset@beta.gouv.fr");
            const result = await userService.forgetPassword("test-reset@beta.gouv.fr");

            if (!result.success) throw new Error("forget password error");

            const response = await request(g.app)
                .post("/user/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: result.reset.token
                })
                .set('Accept', 'application/json');
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({success: true, user: { email: "test-reset@beta.gouv.fr", active: true }})
        });

        it("should reject because password is not hard", async () => {
            await userService.createUser("test-reset@beta.gouv.fr");
            const result = await userService.forgetPassword("test-reset@beta.gouv.fr");

            if (!result.success) throw new Error("forget password error");

            const response = await request(g.app)
                .post("/user/reset-password")
                .send({
                    password: "AAAAaaa",
                    token: result.reset.token
                })
                .set('Accept', 'application/json');
            console.log(response.body);
            expect(response.statusCode).toBe(500);
            expect(response.body).toMatchObject({success: false, code: 13})
        })

        it("should reject because wrong token", async () => {

            const response = await request(g.app)
                .post("/user/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: "sdsdsdsd"
                })
                .set('Accept', 'application/json')
                
            expect(response.statusCode).toBe(500);
            expect(response.body).toMatchObject({ success: false, message: "Reset token not found"})
        })

    })

    describe("POST /login", () => {
        it("should logged user", async () => {
            await userService.createUser("test-login@beta.gouv.fr");
            await userService.activeUser("test-login@beta.gouv.fr");

            const response = await request(g.app)
                .post("/user/login")
                .send({
                    password: "TMP_PASSWOrd;12345678",
                    email: "test-login@beta.gouv.fr"
                })
                .set("x-access-token", await getAdminToken())
                .set('Accept', 'application/json');

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({ token: expect.any(String)})
        });

        it("should not log user", async () => {
            await userService.createUser("test-login@beta.gouv.fr");
            await userService.activeUser("test-login@beta.gouv.fr");

            const response = await request(g.app)
                .post("/user/login")
                .send({
                    password: "WRONG PASS",
                    email: "test-login@beta.gouv.fr"
                })
                .set("x-access-token", await getAdminToken())
                .set('Accept', 'application/json');

            expect(response.statusCode).toBe(401);
        });

        it("should reject because user not active", async () => {
            await userService.createUser("test-login@beta.gouv.fr");

            const response = await request(g.app)
                .post("/user/login")
                .send({
                    password: "TMP_PASSWOrd;12345678",
                    email: "test-login@beta.gouv.fr"
                })
                .set("x-access-token", await getAdminToken())
                .set('Accept', 'application/json');

            expect(response.statusCode).toBe(401);
        });
    })
});

