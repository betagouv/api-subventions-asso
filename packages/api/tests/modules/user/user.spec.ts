import request from "supertest";
import { createAndGetUserToken } from "../../__helpers__/tokenHelper";
import { createAndActiveUser, DEFAULT_PASSWORD, getDefaultUser } from "../../__helpers__/userHelper";
import userAdapter from "../../../src/adapters/outputs/db/user/user.adapter";
import statsAssociationsVisitAdapter from "../../../src/adapters/outputs/db/stats/association-visit.adapter";
import notifyService from "../../../src/modules/notify/notify.service";
import userStatsService from "../../../src/modules/user/services/stats/user.stats.service";
import configurationsService from "../../../src/modules/configurations/configurations.service";
import { App } from "supertest/types";
import UserCli from "../../../src/adapters/inputs/cli/user.cli";
import userAuthService from "../../../src/modules/user/services/auth/user.auth.service";
import UserEntity from "../../../src/domain/users/UserEntity";

const g = global as unknown as { app: App };

describe("UserController, /user", () => {
    const SIREN = "123456789";
    jest.spyOn(notifyService, "notify").mockResolvedValue(true);

    describe("Put /password", () => {
        it("should return 200", async () => {
            await request(g.app)
                .put("/user/password")
                .send({
                    password: "Test::11",
                })
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .expect(200)
                .expect(res =>
                    expect(res.body).toMatchObject({
                        user: { email: "user@beta.gouv.fr", roles: ["user"] },
                    }),
                );
        });

        it("should change password", async () => {
            const token = await createAndGetUserToken();

            const { hashPassword: previousPassword, ..._user } = (await userAdapter.getUserWithSecretsByEmail(
                "user@beta.gouv.fr",
            )) as UserEntity;

            await request(g.app)
                .put("/user/password")
                .send({
                    password: "Test::11",
                })
                .set("x-access-token", token)
                .set("Accept", "application/json")
                .expect(200);

            const { hashPassword: newPassword, ..._userUpdated } = (await userAdapter.getUserWithSecretsByEmail(
                "user@beta.gouv.fr",
            )) as UserEntity;
            expect(newPassword).not.toEqual(previousPassword);
        });

        it("should reject because password is too weak", async () => {
            const response = await request(g.app)
                .put("/user/password")
                .send({
                    password: "azerty",
                })
                .set("x-access-token", await createAndGetUserToken())
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

        it("should return 401 because user not connected", async () => {
            const response = await request(g.app)
                .put("/user/password")
                .send({
                    password: "Test::11",
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(401);
        });
    });

    describe("DELETE", () => {
        it("should anonymize user", async () => {
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())?.id;
            await request(g.app)
                .delete("/user")
                .set("x-access-token", token)
                .set("Accept", "application/json")
                .expect(204);

            const user = await userAdapter.findById(userId);

            expect(user).toMatchObject({
                signupAt: expect.any(Date),
                id: expect.any(String),
                email: `${userId}@deleted.datasubvention.beta.gouv.fr`,
                active: false,
                disable: true,
                firstName: "",
                lastName: "",
                profileToComplete: true,
                roles: ["user"],
            });
        });
    });

    describe("updateNbRequests", () => {
        const TODAY = new Date();
        const ACTIVE_USER_EMAIL = "active.user@beta.gouv.fr";

        beforeEach(async () => {
            await createAndActiveUser(ACTIVE_USER_EMAIL);
            const ACTIVE_USER = await userAdapter.findByEmail(ACTIVE_USER_EMAIL);
            await userAdapter.update(new UserEntity({ ...ACTIVE_USER, nbVisits: 40 }));
            await configurationsService.setLastUserStatsUpdate(new Date(new Date(TODAY).setDate(TODAY.getDate() - 11)));

            await Promise.all([
                statsAssociationsVisitAdapter.add({
                    associationIdentifier: SIREN,
                    userId: ACTIVE_USER.id,
                    date: new Date(new Date(TODAY).setDate(TODAY.getDate() - 12)),
                }),
                statsAssociationsVisitAdapter.add({
                    associationIdentifier: SIREN,
                    userId: ACTIVE_USER.id,
                    date: new Date(new Date(TODAY).setDate(TODAY.getDate() - 6)),
                }),
                statsAssociationsVisitAdapter.add({
                    associationIdentifier: SIREN,
                    userId: ACTIVE_USER.id,
                    date: TODAY,
                }),
            ]);

            await userStatsService.updateNbRequests();
        });

        it("should update last update date", async () => {
            const unexpected = new Date("2012-12-12");
            await configurationsService.setLastUserStatsUpdate(unexpected);
            const actual = await configurationsService.getLastUserStatsUpdate();
            expect(actual).not.toBe(unexpected);
        });
    });

    describe("createAdmin", () => {
        const EMAIL = "super-great-admin@beta.gouv.fr";
        const cli = new UserCli();

        it("creates admin with required email", async () => {
            await cli.createAdmin(EMAIL);
            const actual = await userAdapter.findByEmail(EMAIL);
            expect(actual).toMatchSnapshot({
                id: expect.any(String),
                signupAt: expect.any(Date),
                lastActivityDate: expect.any(Date),
            });
        });

        it("admin can login with default password", async () => {
            await cli.createAdmin(EMAIL);
            const test = userAuthService.login(EMAIL, DEFAULT_PASSWORD);
            await expect(test).resolves.toBeTruthy(); // we mostly check that it resolves
        });
    });
});
