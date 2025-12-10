import request from "supertest";
import { App } from "supertest/types";

const g = global as unknown as { app: App };

describe("open-data/fournisseurs", () => {
    it("should return a list of providers with name, description and last update", async () => {
        const response = await request(g.app).get("/open-data/fournisseurs").set("Accept", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchSnapshot();
    });
});
