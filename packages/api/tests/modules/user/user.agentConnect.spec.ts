import request from "supertest";
import { getTokenByUser } from "../../__helpers__/tokenHelper";
import { USER_EMAIL } from "../../__helpers__/userHelper";
import userCrudService from "../../../src/modules/user/services/crud/user.crud.service";
import { AgentTypeEnum } from "dto";
import { App } from "supertest/types";

const g = global as unknown as { app: App };

describe("UserController, /user", () => {
    it("can update agentConnect user repeating name", async () => {
        const user = await userCrudService.createUser({
            roles: ["user"],
            email: USER_EMAIL,
            firstName: "firstName",
            lastName: "lastName",
            agentConnectId: "something",
        });
        const token = await getTokenByUser(user);
        const response = await request(g.app)
            .patch("/user")
            .send({
                firstName: "firstName",
                lastName: "lastName",
                agentType: AgentTypeEnum.CENTRAL_ADMIN,
            })
            .set("x-access-token", token)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            email: "user@beta.gouv.fr",
            roles: ["user"],
            firstName: "firstName",
            lastName: "lastName",
        });
    });

    it("accepts update with no name", async () => {
        const user = await userCrudService.createUser({
            roles: ["user"],
            email: USER_EMAIL,
            firstName: "firstName",
            lastName: "lastName",
            agentConnectId: "something",
        });
        await userCrudService.update({ ...user });
        const token = await getTokenByUser(user);
        const response = await request(g.app)
            .patch("/user")
            .send({
                agentType: AgentTypeEnum.CENTRAL_ADMIN,
            })
            .set("x-access-token", token)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            email: "user@beta.gouv.fr",
            roles: ["user"],
            firstName: "firstName",
            lastName: "lastName",
        });
    });

    it.each`
        property       | errorMsg
        ${"firstName"} | ${"Un utilisateur lié à AgentConnect ne peut pas changer de prénom sur l'application"}
        ${"lastName"}  | ${"Un utilisateur lié à AgentConnect ne peut pas changer de nom de famille sur l'application"}
    `("fails on trying to update $property", async ({ property, errorMsg }) => {
        const user = await userCrudService.createUser({
            roles: ["user"],
            email: USER_EMAIL,
            firstName: "initialFirstName",
            lastName: "initialLastName",
            agentConnectId: "something",
        });
        await userCrudService.update({ ...user });
        const token = await getTokenByUser(user);
        const response = await request(g.app)
            .patch("/user")
            .send({
                [property]: property,
                agentType: AgentTypeEnum.CENTRAL_ADMIN,
            })
            .set("x-access-token", token)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: errorMsg });
    });
});
