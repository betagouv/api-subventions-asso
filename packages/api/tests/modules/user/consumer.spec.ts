import request = require("supertest");
import { createAndGetConsumerToken, createAndGetUserToken } from "../../__helpers__/tokenHelper";

const g = global as unknown as { app: unknown };

describe("/consumer", () => {
    describe("GET /token", () => {
        it("should return 401", async () => {
            await request(g.app)
                .get("/consumer/token")
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json")
                .expect(401);
        });

        it("should return token", async () => {
            await request(g.app)
                .get("/consumer/token")
                .set("x-access-token", await createAndGetConsumerToken())
                .set("Accept", "application/json")
                .expect(200)
                .then(response => {
                    expect(response.body).toBeDefined();
                });
        });
    });
});
