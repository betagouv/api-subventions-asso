import request = require("supertest");
import osirisRequestPort from "../../src/dataProviders/db/providers/osiris/osiris.request.port";
import fonjepSubventionPort from "../../src/dataProviders/db/providers/fonjep/fonjep.subvention.port.old";
import { SubventionEntity as FonjepEntityFixture } from "./providers/fonjep/__fixtures__/entity";
import OsirisRequestEntityFixture from "./providers/osiris/__fixtures__/entity";

const g = global as unknown as { app: unknown };

describe("open-data/fournisseurs", () => {
    beforeEach(async () => {
        await osirisRequestPort.add(OsirisRequestEntityFixture);
        await fonjepSubventionPort.create(FonjepEntityFixture);
    });

    it("should return a list of providers with name, description and last update", async () => {
        const response = await request(g.app).get("/open-data/fournisseurs").set("Accept", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchSnapshot();
    });
});
