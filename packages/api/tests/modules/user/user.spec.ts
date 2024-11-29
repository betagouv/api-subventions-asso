import request = require("supertest");
import { createAndGetAdminToken, createAndGetUserToken } from "../../__helpers__/tokenHelper";
import { RoleEnum } from "../../../src/@enums/Roles";
import { createAndActiveUser, getDefaultUser } from "../../__helpers__/userHelper";
import userRepository from "../../../src/modules/user/repositories/user.repository";
import statsAssociationsVisitRepository from "../../../src/modules/stats/repositories/statsAssociationsVisit.repository";
import UserDbo from "../../../src/modules/user/repositories/dbo/UserDbo";
import { ObjectId } from "mongodb";
import notifyService from "../../../src/modules/notify/notify.service";
import userActivationService from "../../../src/modules/user/services/activation/user.activation.service";
import userCrudService from "../../../src/modules/user/services/crud/user.crud.service";
import userStatsService from "../../../src/modules/user/services/stats/user.stats.service";
import configurationsService from "../../../src/modules/configurations/configurations.service";

const g = global as unknown as { app: unknown };

describe("UserController, /user", () => {
    const SIREN = "123456789";
    jest.spyOn(notifyService, "notify").mockResolvedValue(true);

    describe("POST /admin/roles", () => {
        it("should return 200", async () => {
            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "admin@beta.gouv.fr",
                    roles: [RoleEnum.admin],
                })
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                user: { email: "admin@beta.gouv.fr", roles: ["user", "admin"] },
            });
        });

        it("should add role", async () => {
            await userCrudService.createUser({ email: "futur-admin@beta.gouv.fr" });

            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "futur-admin@beta.gouv.fr",
                    roles: [RoleEnum.admin],
                })
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                user: {
                    email: "futur-admin@beta.gouv.fr",
                    roles: ["user", RoleEnum.admin],
                },
            });
        });

        it("should reject because role not exist", async () => {
            await userCrudService.createUser({ email: "futur-admin@beta.gouv.fr" });

            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "futur-admin@beta.gouv.fr",
                    roles: ["test"],
                })
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchSnapshot();
        });

        it("should return 401 because user dont have right", async () => {
            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "admin@beta.gouv.fr",
                    roles: [RoleEnum.admin],
                })
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(401);
        });

        it("should return 401 because user not connected", async () => {
            const response = await request(g.app)
                .post("/user/admin/roles")
                .send({
                    email: "admin@beta.gouv.fr",
                    roles: [RoleEnum.admin],
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
                    password: "Test::11",
                })
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                user: { email: "user@beta.gouv.fr", roles: ["user"] },
            });
        });

        it("should change password", async () => {
            const user = await userCrudService.createUser({ email: "user@beta.gouv.fr" });
            await userActivationService.activeUser(user);

            const response = await request(g.app)
                .put("/user/password")
                .send({
                    password: "Test::11",
                })
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            const userUpdated = await userCrudService.findByEmail("user@beta.gouv.fr");

            expect(userUpdated).toEqual({ ...user, lastActivityDate: expect.any(Date) });
        });

        it("should reject because password is too weak", async () => {
            const response = await request(g.app)
                .put("/user/password")
                .send({
                    password: "azerty",
                })
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchSnapshot();
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

    describe("GET /admin/list-users", () => {
        it("should return UserRequestsSuccessResponse", async () => {
            const TODAY = new Date();
            const ACTIVE_USER_EMAIL = "active.user@beta.gouv.fr";
            await createAndActiveUser(ACTIVE_USER_EMAIL);
            const ACTIVE_USER = (await userRepository.findByEmail(ACTIVE_USER_EMAIL)) as UserDbo;
            await Promise.all([
                statsAssociationsVisitRepository.add({
                    associationIdentifier: SIREN,
                    userId: ACTIVE_USER._id,
                    date: new Date(new Date(TODAY).setDate(TODAY.getDate() - 12)),
                }),
                statsAssociationsVisitRepository.add({
                    associationIdentifier: SIREN,
                    userId: ACTIVE_USER._id,
                    date: new Date(new Date(TODAY).setDate(TODAY.getDate() - 6)),
                }),
                statsAssociationsVisitRepository.add({
                    associationIdentifier: SIREN,
                    userId: ACTIVE_USER._id,
                    date: TODAY,
                }),
            ]);
            await userStatsService.updateNbRequests();

            const response = await request(g.app)
                .get(`/user/admin/list-users`)
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json")
                .expect(200);

            expect(response.body.users[0]).toMatchSnapshot({
                _id: expect.any(String),
                signupAt: expect.any(String),
            });
        });
    });

    describe("DELETE", () => {
        it("should anonymize user", async () => {
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())?._id;
            await request(g.app)
                .delete("/user")
                .set("x-access-token", token)
                .set("Accept", "application/json")
                .expect(204);

            const user = await userRepository.findById(userId?.toString() as string);
            expect(user).toMatchObject({
                signupAt: expect.any(Date),
                _id: expect.any(ObjectId),
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

    describe("/auth/signup", () => {
        it("prevents creating duplicate accounts - one at the time", async () => {
            const res1 = await request(g.app)
                .post("/auth/signup")
                .send({
                    email: "test.duplicate@beta.gouv.fr",
                })
                .set("Accept", "application/json");

            const res2 = await request(g.app)
                .post("/auth/signup")
                .send({
                    email: "test.duplicate@beta.gouv.fr",
                })
                .set("Accept", "application/json");

            expect([res1.statusCode, res2.statusCode]).toContain(500);
        });
        it("prevents creating duplicate - fast requests", async () => {
            const promise1 = request(g.app)
                .post("/auth/signup")
                .send({
                    email: "test.duplicate@beta.gouv.fr",
                })
                .set("Accept", "application/json");

            const promise2 = request(g.app)
                .post("/auth/signup")
                .send({
                    email: "test.duplicate@beta.gouv.fr",
                })
                .set("Accept", "application/json");

            const responses = await Promise.all([promise1, promise2]);

            expect(responses.map(r => r.statusCode)).toContain(500);
        });
    });

    describe("updateNbRequests", () => {
        const TODAY = new Date();
        const ACTIVE_USER_EMAIL = "active.user@beta.gouv.fr";

        beforeEach(async () => {
            await createAndActiveUser(ACTIVE_USER_EMAIL);
            const ACTIVE_USER = (await userRepository.findByEmail(ACTIVE_USER_EMAIL)) as UserDbo;
            await userRepository.update({ searchCount: 40 });
            await configurationsService.setLastUserStatsUpdate(new Date(new Date(TODAY).setDate(TODAY.getDate() - 11)));

            await Promise.all([
                statsAssociationsVisitRepository.add({
                    associationIdentifier: SIREN,
                    userId: ACTIVE_USER._id,
                    date: new Date(new Date(TODAY).setDate(TODAY.getDate() - 12)),
                }),
                statsAssociationsVisitRepository.add({
                    associationIdentifier: SIREN,
                    userId: ACTIVE_USER._id,
                    date: new Date(new Date(TODAY).setDate(TODAY.getDate() - 6)),
                }),
                statsAssociationsVisitRepository.add({
                    associationIdentifier: SIREN,
                    userId: ACTIVE_USER._id,
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

        // sets up user
        // sets up visits
        // updates nb requests
        // checks user stats
    });
});
