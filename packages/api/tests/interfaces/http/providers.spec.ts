import request from "supertest";
import dataLogRepository from "../../../src/modules/data-log/repositories/dataLog.repository";

jest.mock("../../../src/modules/provider-request/providerRequest.service");

const g = global as unknown as { app: unknown };

const insertData = async () => {
    await dataLogRepository.insertMany([
        {
            editionDate: new Date("2022-01-01"),
            integrationDate: new Date("2022-01-01"),
            providerId: "prov1",
        },
        {
            editionDate: new Date("2023-01-01"),
            integrationDate: new Date("2023-01-01"),
            providerId: "prov1",
        },
        {
            editionDate: new Date("2022-05-01"),
            integrationDate: new Date("2022-05-01"),
            providerId: "prov2",
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
