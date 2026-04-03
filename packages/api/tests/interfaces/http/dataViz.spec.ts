import amountsVsProgramRegionAdapter from "../../../src/adapters/outputs/db/dataviz/amount-vs-program-region/amounts-vs-program-region.adapter";
import request from "supertest";
import { createAndGetUserToken } from "../../__helpers__/tokenHelper";
import { App } from "supertest/types";
import { AMOUNTS_VS_PROGRAM_REGION_ENTITIES } from "../../../src/modules/dataviz/amounts-vs-program-region/__fixtures__/amounts-vs-program-region.fixture";

jest.mock("../../../src/modules/provider-request/provider-request.service");

const g = global as unknown as { app: App };

const insertData = async () => {
    await amountsVsProgramRegionAdapter.upsertMany(AMOUNTS_VS_PROGRAM_REGION_ENTITIES);
};

describe("DataVizHttp", () => {
    beforeEach(async () => {
        await insertData();
    });

    describe("GET /dataviz/montant-versus-programme-region", () => {
        it("should return amounts versus program region data", async () => {
            const response = await request(g.app)
                .get("/dataviz/montant-versus-programme-region")
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.status).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
    });
});
