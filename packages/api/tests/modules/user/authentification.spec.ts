import request from "supertest";
import userService, { UserService } from "../../../src/modules/user/user.service";
import { ResetPasswordErrorCodes } from "@api-subventions-asso/dto";
import db from "../../../src/shared/MongoConnection";
import { createAndActiveUser, createUser, DEFAULT_PASSWORD, USER_EMAIL } from "../../__helpers__/userHelper";

const g = global as unknown as { app: unknown };

describe("AuthentificationController, /auth", () => {
    describe("POST /forget-password", () => {
        beforeEach(async () => {
            await createUser();
        });
        it("should return SuccessResponse", async () => {
            const expected = {
                success: true,
                reset: {
                    _id: expect.any(String),
                    userId: expect.any(String),
                    createdAt: expect.any(String)
                }
            };
            await request(g.app)
                .post("/auth/forget-password")
                .send({ email: "user@beta.gouv.fr" })
                .set("Accept", "application/json")
                .expect(200)
                .expect(res => expect(res.body).toMatchObject(expected));
        });

        it("should add reject because user not found", async () => {
            const response = await request(g.app)
                .post("/auth/forget-password")
                .send({
                    email: "useraa@beta.gouv.fr"
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(500);
            expect(response.body).toMatchObject({
                success: false,
                message: "User not found"
            });
        });
    });

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
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                success: true,
                data: { user: { email: "test-reset@beta.gouv.fr", active: true } }
            });
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
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(500);
            expect(response.body).toMatchObject({
                success: false,
                data: { code: ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID }
            });
        });

        it("should reject because wrong token", async () => {
            const response = await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: "sdsdsdsd"
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(500);
            expect(response.body).toMatchObject({
                success: false,
                data: { code: ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND }
            });
        });

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
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(500);
            expect(response.body).toMatchObject({
                success: false,
                data: { code: ResetPasswordErrorCodes.RESET_TOKEN_EXPIRED }
            });

            UserService.RESET_TIMEOUT = oldResetTimout;
        });

        it("should reject because user is deleted", async () => {
            await userService.createUser("test-reset@beta.gouv.fr");
            const result = await userService.forgetPassword("test-reset@beta.gouv.fr");

            if (!result.success) throw new Error("forget password error");

            await db.collection("users").deleteOne({ email: "test-reset@beta.gouv.fr" });

            const response = await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: result.reset.token
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(500);
            expect(response.body).toMatchObject({
                success: false,
                data: { code: ResetPasswordErrorCodes.USER_NOT_FOUND }
            });
        });
    });

    describe("POST /login", () => {
        describe("with active user", () => {
            beforeEach(async () => {
                await createAndActiveUser();
            });

            it("should log user", async () => {
                const expected = {
                    success: true,
                    data: {
                        email: USER_EMAIL,
                        roles: ["user"],
                        active: true,
                        jwt: {
                            token: expect.any(String),
                            expirateDate: expect.any(String)
                        }
                    }
                };

                await request(g.app)
                    .post("/auth/login")
                    .send({
                        password: DEFAULT_PASSWORD,
                        email: USER_EMAIL
                    })
                    .set("Accept", "application/json")
                    .expect(201)
                    .expect(res => expect(res.body).toMatchObject(expected));
            });

            it("should not return password", async () => {
                await request(g.app)
                    .post("/auth/login")
                    .send({
                        password: DEFAULT_PASSWORD,
                        email: USER_EMAIL
                    })
                    .set("Accept", "application/json")
                    .expect(res => expect(res.body.data.hashPassword).toEqual(undefined));
            });

            it("should not log user", async () => {
                await request(g.app)
                    .post("/auth/login")
                    .send({
                        password: "WRONG PASSWORD",
                        email: USER_EMAIL
                    })
                    .set("Accept", "application/json")
                    .expect(401);
            });
        });

        describe("with not activated user", () => {
            beforeEach(async () => await createUser());
            it("should reject because user not active", async () => {
                const response = await request(g.app)
                    .post("/auth/login")
                    .send({
                        password: DEFAULT_PASSWORD,
                        email: USER_EMAIL
                    })
                    .set("Accept", "application/json");

                expect(response.statusCode).toBe(401);
            });
        });
    });
});
