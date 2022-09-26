import request from "supertest"
import getUserToken from "../../__helpers__/getUserToken";
import osirisRequestRepository from '../../../src/modules/providers/osiris/repositories/osiris.request.repository';
import fonjepSubventionRepository from '../../../src/modules/providers/fonjep/repositories/fonjep.subvention.repository';
import { SubventionEntity as FonjepEntityFixture } from '../providers/fonjep/__fixtures__/entity';
import OsirisRequestEntityFixture from '../providers/osiris/__fixtures__/entity';
import dauphinService from "../../../src/modules/providers/dauphin/dauphin.service";

const g = global as unknown as { app: unknown }

describe("/association", () => {
    beforeEach(async () => {
        jest.spyOn(dauphinService, "getDemandeSubventionBySiren").mockImplementationOnce(async () => [])
        await osirisRequestRepository.add(OsirisRequestEntityFixture);

        await fonjepSubventionRepository.create(FonjepEntityFixture);
    })

    describe("/{structure_identifier}/subventions", () => {
        it("should return a list of subventions", async () => {
            const response = await request(g.app)
                .get(`/association/${OsirisRequestEntityFixture.legalInformations.siret}/subventions`)
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        })
    })


    describe("/{structure_identifier}", () => {
        it("should return an association", async () => {
            const response = await request(g.app)
                .get(`/association/${OsirisRequestEntityFixture.legalInformations.siret}`)
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
    });
})