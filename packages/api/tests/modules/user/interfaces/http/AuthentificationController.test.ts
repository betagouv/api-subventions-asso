import request from "supertest"
import userService, { UserService } from "../../../../../src/modules/user/user.service";
import { ResetPasswordErrorCodes } from "@api-subventions-asso/dto";
import db from "../../../../../src/shared/MongoConnection";

const g = global as unknown as { app: unknown }

describe('AuthentificationController, /auth', () => {
    let log: jest.SpyInstance;
    beforeEach(() => {
        log = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        log.mockClear();
    })

    describe("POST /forget-password", () => {
        beforeEach(async () => {
            await userService.createUser("user@beta.gouv.fr");
        })
        it("should return 200", async () => {
            const response = await request(g.app)
                .post("/auth/forget-password")
                .send({
                    email: "user@beta.gouv.fr",
                })
                .set('Accept', 'application/json');

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({success: true, reset: expect.objectContaining({userId: expect.any(String)})})
        })

        it("should add reject because user not found", async () => {

            const response = await request(g.app)
                .post("/auth/forget-password")
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
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: result.reset.token
                })
                .set('Accept', 'application/json');
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({success: true, data: { user: { email: "test-reset@beta.gouv.fr", active: true }}})
        });

        it("should reject because password is not hard", async () => {
            await userService.createUser("test-reset@beta.gouv.fr");
            const result = await userService.forgetPassword("test-reset@beta.gouv.fr");

            if (!result.success) throw new Error("forget password error");

            const response = await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaa",
                    token: result.reset.token
                })
                .set('Accept', 'application/json');
            expect(response.statusCode).toBe(500);
            expect(response.body).toMatchObject({success: false, data: { code: ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID }})
        })

        it("should reject because wrong token", async () => {

            const response = await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: "sdsdsdsd"
                })
                .set('Accept', 'application/json')
                
            expect(response.statusCode).toBe(500);
            expect(response.body).toMatchObject({ success: false, data: { code: ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND }})
        })

        it("should reject because token is outdated", async () => {
            await userService.createUser("test-reset@beta.gouv.fr");
            const result = await userService.forgetPassword("test-reset@beta.gouv.fr");

            if (!result.success) throw new Error("forget password error");

            const oldResetTimout = UserService.RESET_TIMEOUT;
            UserService.RESET_TIMEOUT = 0;

            const response = await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: result.reset.token
                })
                .set('Accept', 'application/json')
                
            expect(response.statusCode).toBe(500);
            expect(response.body).toMatchObject({ success: false, data: { code: ResetPasswordErrorCodes.RESET_TOKEN_EXPIRED }});

            UserService.RESET_TIMEOUT = oldResetTimout;
        })

        it("should reject because user is deleted", async () => {
            await userService.createUser("test-reset@beta.gouv.fr");
            const result = await userService.forgetPassword("test-reset@beta.gouv.fr");

            if (!result.success) throw new Error("forget password error");

            await db.collection("users").deleteOne({ email: "test-reset@beta.gouv.fr"});

            const response = await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: result.reset.token
                })
                .set('Accept', 'application/json')
                
            expect(response.statusCode).toBe(500);
            expect(response.body).toMatchObject({ success: false, data: { code: ResetPasswordErrorCodes.USER_NOT_FOUND }});
        })
    })

    describe("POST /login", () => {
        it("should logged user", async () => {
            await userService.createUser("test-login@beta.gouv.fr");
            await userService.activeUser("test-login@beta.gouv.fr");

            const response = await request(g.app)
                .post("/auth/login")
                .send({
                    password: "TMP_PASSWOrd;12345678",
                    email: "test-login@beta.gouv.fr"
                })
                .set('Accept', 'application/json');

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({ success: true, data: { token: expect.any(String)} })
        });

        it("should not log user", async () => {
            await userService.createUser("test-login@beta.gouv.fr");
            await userService.activeUser("test-login@beta.gouv.fr");

            const response = await request(g.app)
                .post("/auth/login")
                .send({
                    password: "WRONG PASS",
                    email: "test-login@beta.gouv.fr"
                })
                .set('Accept', 'application/json');

            expect(response.statusCode).toBe(401);
        });

        it("should reject because user not active", async () => {
            await userService.createUser("test-login@beta.gouv.fr");

            const response = await request(g.app)
                .post("/auth/login")
                .send({
                    password: "TMP_PASSWOrd;12345678",
                    email: "test-login@beta.gouv.fr"
                })
                .set('Accept', 'application/json');

            expect(response.statusCode).toBe(401);
        });
    })
});

