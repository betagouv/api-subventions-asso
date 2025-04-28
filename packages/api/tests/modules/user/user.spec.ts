import request = require("supertest");
import { createAndGetUserToken } from "../../__helpers__/tokenHelper";
import { createAndActiveUser, getDefaultUser } from "../../__helpers__/userHelper";
import userPort from "../../../src/dataProviders/db/user/user.port";
import statsAssociationsVisitPort from "../../../src/dataProviders/db/stats/statsAssociationsVisit.port";
import UserDbo from "../../../src/dataProviders/db/user/UserDbo";
import { ObjectId } from "mongodb";
import notifyService from "../../../src/modules/notify/notify.service";
import userActivationService from "../../../src/modules/user/services/activation/user.activation.service";
import userCrudService from "../../../src/modules/user/services/crud/user.crud.service";
import userStatsService from "../../../src/modules/user/services/stats/user.stats.service";
import configurationsService from "../../../src/modules/configurations/configurations.service";

import { App } from "supertest/types";

const g = global as unknown as { app: App };

describe("UserController, /user", () => {
    const SIREN = "123456789";
    jest.spyOn(notifyService, "notify").mockResolvedValue(true);

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

    describe("DELETE", () => {
        it("should anonymize user", async () => {
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())?._id;
            await request(g.app)
                .delete("/user")
                .set("x-access-token", token)
                .set("Accept", "application/json")
                .expect(204);

            const user = await userPort.findById(userId?.toString() as string);
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

    describe("updateNbRequests", () => {
        const TODAY = new Date();
        const ACTIVE_USER_EMAIL = "active.user@beta.gouv.fr";

        beforeEach(async () => {
            await createAndActiveUser(ACTIVE_USER_EMAIL);
            const ACTIVE_USER = (await userPort.findByEmail(ACTIVE_USER_EMAIL)) as UserDbo;
            await userPort.update({ nbVisits: 40 });
            await configurationsService.setLastUserStatsUpdate(new Date(new Date(TODAY).setDate(TODAY.getDate() - 11)));

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
        });

        it("should update last update date", async () => {
            const unexpected = new Date("2012-12-12");
            await configurationsService.setLastUserStatsUpdate(unexpected);
            const actual = await configurationsService.getLastUserStatsUpdate();
            expect(actual).not.toBe(unexpected);
        });
    });
});
