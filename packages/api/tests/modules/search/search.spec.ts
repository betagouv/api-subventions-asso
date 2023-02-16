import request = require("supertest");
import getUserToken from "../../__helpers__/getUserToken";
import { osirisRequestRepository } from "../../../src/modules/providers/osiris/repositories";
import associationNameRepository from "../../../src/modules/association-name/repositories/associationName.repository";
import OsirisRequestEntityFixture from "../providers/osiris/__fixtures__/entity";
import AssociationNameFixture from "../association-name/__fixtures__/entity";
import apiEntrepriseService from "../../../src/modules/providers/apiEntreprise/apiEntreprise.service";
import dauphinService from "../../../src/modules/providers/dauphin/dauphin.service";

const g = global as unknown as { app: unknown };

describe("/search", () => {
    beforeAll(() => {
        jest.spyOn(apiEntrepriseService, "getHeadcount").mockImplementation(async () => null);
        jest.spyOn(dauphinService, "getDemandeSubventionBySiret").mockImplementation(async () => []);
        jest.spyOn(dauphinService, "getDemandeSubventionBySiren").mockImplementation(async () => []);
    });

    describe("/associations/{input}", () => {
        beforeEach(async () => {
            Promise.all(AssociationNameFixture.map(fixture => associationNameRepository.create(fixture)));
        });

        it("should return an Association from its RNA", async () => {
            const response = await request(g.app)
                .get(`/search/associations/${AssociationNameFixture[0].rna}`)
                .set("x-access-token", await getUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot({
                result: [{ lastUpdate: expect.any(String) }]
            });
        });
        it("should return an Association from its Siren", async () => {
            const response = await request(g.app)
                .get(`/search/associations/${AssociationNameFixture[0].siren}`)
                .set("x-access-token", await getUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot({
                result: [{ lastUpdate: expect.any(String) }]
            });
        });
        it("should return an AssociationNameEntity from its name", async () => {
            const response = await request(g.app)
                .get(`/search/associations/${AssociationNameFixture[0].name}`)
                .set("x-access-token", await getUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot({
                result: [{ lastUpdate: expect.any(String) }]
            });
        });
    });
});
