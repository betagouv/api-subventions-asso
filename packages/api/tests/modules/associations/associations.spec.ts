import request from "supertest"
import getUserToken from "../../__helpers__/getUserToken";
import osirisRepository from '../../../src/modules/providers/osiris/repositories/osiris.repository';
import fonjepRepository from '../../../src/modules/providers/fonjep/repositories/fonjep.repository';
import FonjepEntityFixture from '../providers/fonjep/__fixtures__/entity';
import OsirisRequestEntityFixture from '../providers/osiris/__fixtures__/entity';

const g = global as unknown as { app: unknown }

describe("/association", () => {
    beforeEach( async () => {
        await osirisRepository.addRequest(OsirisRequestEntityFixture);
        await fonjepRepository.create(FonjepEntityFixture);
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