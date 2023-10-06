import request = require("supertest");
import { createAndGetAdminToken, createAndGetUserToken } from "../../__helpers__/tokenHelper";
import userService from "../../../src/modules/user/user.service";
import { RoleEnum } from "../../../src/@enums/Roles";
import { createAndActiveUser, getDefaultUser } from "../../__helpers__/userHelper";
import userRepository from "../../../src/modules/user/repositories/user.repository";
import statsAssociationsVisitRepository from "../../../src/modules/stats/repositories/statsAssociationsVisit.repository";
import UserDbo from "../../../src/modules/user/repositories/dbo/UserDbo";
import { ObjectId } from "mongodb";
import notifyService from "../../../src/modules/notify/notify.service";
import userActivationService from "../../../src/modules/user/services/activation/user.activation.service";

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
            await userService.createUser({ email: "futur-admin@beta.gouv.fr" });

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
            await userService.createUser({ email: "futur-admin@beta.gouv.fr" });

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
            const user = await userService.createUser({ email: "user@beta.gouv.fr" });
            await userActivationService.activeUser(user);

            const response = await request(g.app)
                .put("/user/password")
                .send({
                    password: "Test::11",
                })
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            const userUpdated = await userService.findByEmail("user@beta.gouv.fr");

            expect(userUpdated).toMatchObject(user);
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
            await statsAssociationsVisitRepository.add({
                associationIdentifier: SIREN,
                userId: ACTIVE_USER._id,
                date: new Date(new Date(TODAY).setDate(TODAY.getDate() - 12)),
            });
            await statsAssociationsVisitRepository.add({
                associationIdentifier: SIREN,
                userId: ACTIVE_USER._id,
                date: new Date(new Date(TODAY).setDate(TODAY.getDate() - 6)),
            });
            await statsAssociationsVisitRepository.add({
                associationIdentifier: SIREN,
                userId: ACTIVE_USER._id,
                date: TODAY,
            });

            const response = await request(g.app)
                .get(`/user/admin/list-users`)
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json")
                .expect(200);

            expect(response.body.users[0]).toMatchSnapshot({
                _id: expect.any(String),
                signupAt: expect.any(String),
                stats: {
                    lastSearchDate: expect.any(String),
                },
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
            expect(user).toMatchSnapshot({ signupAt: expect.any(Date), _id: expect.any(ObjectId) });
        });
    });
});
