import request = require("supertest");
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
                reset: {
                    _id: expect.any(String),
                    userId: expect.any(String),
                    createdAt: expect.any(String),
                },
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
                    email: "useraa@beta.gouv.fr",
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                message: "User not found",
            });
        });
    });

    describe("POST /reset-password", () => {
        it("should return 200", async () => {
            await userService.createUser({ email: "test-reset@beta.gouv.fr" });
            const result = await userService.forgetPassword("test-reset@beta.gouv.fr");

            const response = await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: result.token,
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                user: { email: "test-reset@beta.gouv.fr", active: true },
            });
        });

        it("should reject because password is too weak", async () => {
            await userService.createUser({ email: "test-reset@beta.gouv.fr" });
            const result = await userService.forgetPassword("test-reset@beta.gouv.fr");

            const response = await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaa",
                    token: result.token,
                })
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchObject({
                code: ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID,
            });
        });

        it("should reject because wrong token", async () => {
            const response = await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: "sdsdsdsd",
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                code: ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND,
            });
        });

        it("should reject because token is outdated", async () => {
            await userService.createUser({ email: "test-reset@beta.gouv.fr" });
            const result = await userService.forgetPassword("test-reset@beta.gouv.fr");

            const oldResetTimout = UserService.RESET_TIMEOUT;
            UserService.RESET_TIMEOUT = 0;

            const response = await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: result.token,
                })
                .set("Accept", "application/json");
            UserService.RESET_TIMEOUT = oldResetTimout;

            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchObject({
                code: ResetPasswordErrorCodes.RESET_TOKEN_EXPIRED,
            });

            UserService.RESET_TIMEOUT = oldResetTimout;
        });

        it("should reject because user is deleted", async () => {
            await userService.createUser({ email: "test-reset@beta.gouv.fr" });
            const result = await userService.forgetPassword("test-reset@beta.gouv.fr");

            await db.collection("users").deleteOne({ email: "test-reset@beta.gouv.fr" });

            const response = await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: result.token,
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                code: ResetPasswordErrorCodes.USER_NOT_FOUND,
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
                    email: USER_EMAIL,
                    roles: ["user"],
                    active: true,
                    jwt: {
                        token: expect.any(String),
                        expirateDate: expect.any(String),
                    },
                };

                await request(g.app)
                    .post("/auth/login")
                    .send({
                        password: DEFAULT_PASSWORD,
                        email: USER_EMAIL,
                    })
                    .set("Accept", "application/json")
                    .expect(200)
                    .expect(res => {
                        expect(res.body.user).toMatchObject(expected);
                    });
            });

            it("should not return password", async () => {
                await request(g.app)
                    .post("/auth/login")
                    .send({
                        password: DEFAULT_PASSWORD,
                        email: USER_EMAIL,
                    })
                    .set("Accept", "application/json")
                    .expect(res => expect(res.body.user.hashPassword).toEqual(undefined));
            });

            it("should not log user", async () => {
                await request(g.app)
                    .post("/auth/login")
                    .send({
                        password: "WRONG PASSWORD",
                        email: USER_EMAIL,
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
                        email: USER_EMAIL,
                    })
                    .set("Accept", "application/json");

                expect(response.statusCode).toBe(401);
            });
        });
    });
});
