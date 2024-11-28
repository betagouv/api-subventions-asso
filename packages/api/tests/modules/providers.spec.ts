import request = require("supertest");
import osirisRequestRepository from "../../src/dataProviders/db/providers/osiris/osiris.request.port";
import fonjepSubventionRepository from "../../src/dataProviders/db/providers/fonjep/fonjep.subvention.port";
import { SubventionEntity as FonjepEntityFixture } from "./providers/fonjep/__fixtures__/entity";
import OsirisRequestEntityFixture from "./providers/osiris/__fixtures__/entity";

const g = global as unknown as { app: unknown };

describe("open-data/fournisseurs", () => {
    beforeEach(async () => {
        await osirisRequestRepository.add(OsirisRequestEntityFixture);
        await fonjepSubventionRepository.create(FonjepEntityFixture);
    });

    it("should return a list of providers with name, description and last update", async () => {
        const response = await request(g.app).get("/open-data/fournisseurs").set("Accept", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchSnapshot();
    });
});
