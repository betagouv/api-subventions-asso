import amountsVsProgramRegionPort from "../../../src/dataProviders/db/dataViz/amountVSProgramRegion/amountsVsProgramRegion.port";
import { AMOUNTS_VS_PROGRAM_REGION_ENTITIES } from "../../../src/modules/dataViz/amountsVsProgramRegion/__fixtures__/amountsVSProgramRegion.fixture";
import request from "supertest";
import { createAndGetUserToken } from "../../__helpers__/tokenHelper";

jest.mock("../../../src/modules/provider-request/providerRequest.service");

import { App } from "supertest/types";

const g = global as unknown as { app: App };

const insertData = async () => {
    await amountsVsProgramRegionPort.upsertMany(AMOUNTS_VS_PROGRAM_REGION_ENTITIES);
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
