import request from "supertest";
import dataLogPort from "../../../src/dataProviders/db/data-log/dataLog.port";
import { App } from "supertest/types";
import { API_PROVIDER, RAW_PROVIDER } from "../../../src/modules/providers/__fixtures__/providers.fixture";
import { DataLogSource } from "../../../src/modules/data-log/entities/dataLogEntity";

jest.mock("../../../src/modules/provider-request/providerRequest.service");

const g = global as unknown as { app: App };

const insertData = async () => {
    await dataLogPort.insertMany([
        {
            editionDate: new Date("2022-01-01"),
            integrationDate: new Date("2022-01-01"),
            providerId: RAW_PROVIDER.meta.id,
            providerName: RAW_PROVIDER.meta.name,
            source: DataLogSource.FILE,
        },
        {
            editionDate: new Date("2023-01-01"),
            integrationDate: new Date("2023-01-01"),
            providerId: RAW_PROVIDER.meta.id,
            providerName: RAW_PROVIDER.meta.name,
            source: DataLogSource.FILE,
        },
        {
            editionDate: new Date("2022-05-01"),
            integrationDate: new Date("2022-05-01"),
            providerId: API_PROVIDER.meta.id,
            providerName: API_PROVIDER.meta.name,
            source: DataLogSource.API,
        },
    ]);
};

describe("/open-data/fournisseurs", () => {
    beforeEach(async () => {
        await insertData();
    });

    describe("/historique", () => {
        it("should return raw grants with rna", async () => {
            const response = await request(g.app)
                .get(`/open-data/fournisseurs/historique`)
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
    });
});
