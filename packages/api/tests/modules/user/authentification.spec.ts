import request from "supertest";
import { AgentTypeEnum } from "dto";
import { createAndActiveUser, createUser, DEFAULT_PASSWORD, USER_EMAIL } from "../../__helpers__/userHelper";
import { createResetToken } from "../../__helpers__/resetTokenHelper";
import userResetAdapter from "../../../src/adapters/outputs/db/user/user-reset.adapter";
import notifyService from "../../../src/modules/notify/notify.service";
import userActivationService, {
    UserActivationService,
} from "../../../src/modules/user/services/activation/user.activation.service";
import userCrudService from "../../../src/modules/user/services/crud/user.crud.service";
import { App } from "supertest/types";
import NewUserEntity from "../../../src/domain/users/NewUserEntity";
import UserEntity from "../../../src/domain/users/UserEntity";

const g = global as unknown as { app: App };

describe("AuthentificationController, /auth", () => {
    jest.spyOn(notifyService, "notify").mockResolvedValue(true);
    describe("POST /forget-password", () => {
        beforeEach(async () => {
            await createUser();
        });
        it("should return SuccessResponse", async () => {
            const response = await request(g.app)
                .post("/auth/forget-password")
                .send({ email: "user@beta.gouv.fr" })
                .set("Accept", "application/json");

            expect(response).toMatchObject({
                statusCode: 200,
                body: { success: true },
            });
        });

        it("should return 200 even if the user doesn't exist", async () => {
            const response = await request(g.app)
                .post("/auth/forget-password")
                .send({
                    email: "useraa@beta.gouv.fr",
                })
                .set("Accept", "application/json");

            expect(response).toMatchObject({
                statusCode: 200,
                body: { success: true },
            });
        });
    });

    describe("POST /reset-password", () => {
        it("should return 200", async () => {
            const user = await userCrudService.createUser(new NewUserEntity({ email: "test-reset@beta.gouv.fr" }));
            await userActivationService.forgetPassword("test-reset@beta.gouv.fr");

            const userReset = await userResetAdapter.findOneByUserId(user.id);

            await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: userReset?.token,
                })
                .set("Accept", "application/json")
                .expect(200)
                .expect(res =>
                    expect(res.body).toMatchObject({
                        user: { email: "test-reset@beta.gouv.fr", active: true },
                    }),
                );
        });

        it("should reject because password is too weak", async () => {
            const user = await userCrudService.createUser(new NewUserEntity({ email: "test-reset@beta.gouv.fr" }));
            await userActivationService.forgetPassword("test-reset@beta.gouv.fr");

            const userReset = await userResetAdapter.findOneByUserId(user.id);

            const response = await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaa",
                    token: userReset?.token,
                })
                .set("Accept", "application/json");

            expect({
                statusCode: response.statusCode,
                messageType: typeof response.body.message,
                bodyKeys: Object.keys(response.body),
            }).toEqual({
                statusCode: 400,
                messageType: "string",
                bodyKeys: ["message"],
            });
        });

        it("should reject because wrong token", async () => {
            await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: "sdsdsdsd",
                })
                .set("Accept", "application/json")
                .expect(404)
                .expect(res => expect(res.body).toMatchObject({ message: "Reset token not found" }));
        });

        it("should reject because token is outdated", async () => {
            const user = await userCrudService.createUser(new NewUserEntity({ email: "test-reset@beta.gouv.fr" }));
            await userActivationService.forgetPassword("test-reset@beta.gouv.fr");

            const userReset = await userResetAdapter.findOneByUserId(user.id);

            const oldResetTimout = UserActivationService.RESET_TIMEOUT;
            UserActivationService.RESET_TIMEOUT = 0;

            const response = await request(g.app)
                .post("/auth/reset-password")
                .send({
                    password: "AAAAaaaaa;;;;2222",
                    token: userReset?.token,
                })
                .set("Accept", "application/json");
            UserActivationService.RESET_TIMEOUT = oldResetTimout;

            expect({
                statusCode: response.statusCode,
                body: response.body,
                bodyKeys: Object.keys(response.body),
            }).toEqual({
                statusCode: 410,
                body: { message: "Reset token has expired, please retry forget password" },
                bodyKeys: ["message"],
            });

            UserActivationService.RESET_TIMEOUT = oldResetTimout;
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

                const response = await request(g.app)
                    .post("/auth/login")
                    .send({
                        password: DEFAULT_PASSWORD,
                        email: USER_EMAIL,
                    })
                    .set("Accept", "application/json");

                expect(response).toMatchObject({
                    statusCode: 200,
                    body: {
                        user: expected,
                    },
                });
            });

            it("should not return password", async () => {
                const response = await request(g.app)
                    .post("/auth/login")
                    .send({
                        password: DEFAULT_PASSWORD,
                        email: USER_EMAIL,
                    })
                    .set("Accept", "application/json");

                expect(response.body.user.hashPassword).toEqual(undefined);
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

    describe("POST /activate", () => {
        let user: UserEntity;
        let userResetToken;

        beforeEach(async () => {
            user = await createUser();
            userResetToken = await createResetToken(user.id);
        });
        it("should return user", async () => {
            await request(g.app)
                .post("/auth/activate")
                .send({
                    token: userResetToken.token,
                    data: {
                        password: DEFAULT_PASSWORD,
                        agentType: AgentTypeEnum.CENTRAL_ADMIN,
                        jobType: [],
                    },
                })
                .set("Accept", "application/json")
                .expect(200)
                .expect(res =>
                    expect(res.body.user).toMatchSnapshot({
                        signupAt: expect.any(String),
                        id: expect.any(String),
                        jwt: { expirateDate: expect.any(String), token: expect.any(String) },
                        lastActivityDate: expect.any(String),
                    }),
                );
        });

        describe("404 NotFoundError", () => {
            it("should return NotFoundError", async () => {
                await request(g.app)
                    .post("/auth/activate")
                    .send({
                        token: "qdqzdqzd1414ZD^$$*",
                        data: {
                            password: DEFAULT_PASSWORD,
                            agentType: AgentTypeEnum.CENTRAL_ADMIN,
                            jobType: [],
                        },
                    })
                    .set("Accept", "application/json")
                    .expect(404);
            });
        });

        describe("400 BadRequestError", () => {
            const DATA = {
                password: DEFAULT_PASSWORD,
                agentType: AgentTypeEnum.CENTRAL_ADMIN,
                jobType: [],
            };

            const DATA_WITH_WRONG_PASSWORD = { ...DATA, password: "WRONG_PASSWORD!!" };
            const DATA_WITH_WRONG_AGENT_TYPE = { ...DATA, agentType: "WRONG" };
            const DATA_WITH_WRONG_JOB_TYPE = { ...DATA, password: "WRONG_PASSWORD!!" };
            const DATA_WITH_WRONG_STRUCTURE = { ...DATA, structure: 9 };
            const DATA_WITH_WRONG_REGISTRATIONSRC = { ...DATA, registrationSrc: ["WRONG"] };
            const DATA_WITH_WRONG_TERRITORIAL_SCOPE = {
                ...DATA,
                agentType: AgentTypeEnum.TERRITORIAL_COLLECTIVITY,
                territorialScope: "WRONG",
            };
            const DATA_WITH_WRONG_DECENTRALIZED_LEVEL = {
                ...DATA,
                agentType: AgentTypeEnum.DECONCENTRATED_ADMIN,
                decentralizedLevel: "WRONG",
            };

            it.each`
                data
                ${DATA_WITH_WRONG_PASSWORD}
                ${DATA_WITH_WRONG_AGENT_TYPE}
                ${DATA_WITH_WRONG_JOB_TYPE}
                ${DATA_WITH_WRONG_STRUCTURE}
                ${DATA_WITH_WRONG_REGISTRATIONSRC}
                ${DATA_WITH_WRONG_TERRITORIAL_SCOPE}
                ${DATA_WITH_WRONG_DECENTRALIZED_LEVEL}
            `("return a 404 BadRequestError'", async ({ data }) => {
                await request(g.app)
                    .post("/auth/activate")
                    .send({
                        token: userResetToken.token,
                        data,
                    })
                    .set("Accept", "application/json")
                    .expect(400);
            });
        });
    });
});
