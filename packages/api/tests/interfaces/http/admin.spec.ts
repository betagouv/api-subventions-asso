import request from "supertest";
import { createAndGetAdminToken, createAndGetUserToken } from "../../__helpers__/tokenHelper";
import { RoleEnum } from "../../../src/@enums/Roles";
import { createAndActiveUser } from "../../__helpers__/userHelper";
import userPort from "../../../src/dataProviders/db/user/user.port";
import statsAssociationsVisitPort from "../../../src/dataProviders/db/stats/statsAssociationsVisit.port";
import UserDbo from "../../../src/dataProviders/db/user/UserDbo";
import notifyService from "../../../src/modules/notify/notify.service";
import userCrudService from "../../../src/modules/user/services/crud/user.crud.service";
import userStatsService from "../../../src/modules/user/services/stats/user.stats.service";
import { App } from "supertest/types";

const g = global as unknown as { app: App };

describe("AdminController, /admin", () => {
    const SIREN = "123456789";
    jest.spyOn(notifyService, "notify").mockResolvedValue(true);

    describe("POST /user/roles", () => {
        it("should return 200", async () => {
            const response = await request(g.app)
                .post("/admin/user/roles")
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
                .post("/admin/user/roles")
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
                .post("/admin/user/roles")
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
                .post("/admin/user/roles")
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
                .post("/admin/user/roles")
                .send({
                    email: "admin@beta.gouv.fr",
                    roles: [RoleEnum.admin],
                })
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(401);
        });
    });

    describe("GET /user/list-users", () => {
        it("should return UserRequestsSuccessResponse", async () => {
            const TODAY = new Date();
            const ACTIVE_USER_EMAIL = "active.user@beta.gouv.fr";
            await createAndActiveUser(ACTIVE_USER_EMAIL);
            const ACTIVE_USER = (await userPort.findByEmail(ACTIVE_USER_EMAIL)) as UserDbo;
            await Promise.all([
                statsAssociationsVisitPort.add({
                    associationIdentifier: SIREN,
                    userId: ACTIVE_USER._id,
                    date: new Date(new Date(TODAY).setDate(TODAY.getDate() - 12)),
                }),
                statsAssociationsVisitPort.add({
                    associationIdentifier: SIREN,
                    userId: ACTIVE_USER._id,
                    date: new Date(new Date(TODAY).setDate(TODAY.getDate() - 6)),
                }),
                statsAssociationsVisitPort.add({
                    associationIdentifier: SIREN,
                    userId: ACTIVE_USER._id,
                    date: TODAY,
                }),
            ]);
            await userStatsService.updateNbRequests();

            const response = await request(g.app)
                .get(`/admin/user/list-users`)
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json")
                .expect(200);

            expect(response.body.users[0]).toMatchSnapshot({
                _id: expect.any(String),
                signupAt: expect.any(String),
            });
        });
    });
});
