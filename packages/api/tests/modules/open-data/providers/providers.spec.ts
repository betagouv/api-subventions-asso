import request from 'supertest'
import osirisRequestRepository from '../../../../src/modules/providers/osiris/repositories/osiris.request.repository';
import fonjepRepository from '../../../../src/modules/providers/fonjep/repositories/fonjep.repository';
import { SubventionEntity as FonjepEntityFixture } from '../../providers/fonjep/__fixtures__/entity';
import OsirisRequestEntityFixture from '../../providers/osiris/__fixtures__/entity';

const g = global as unknown as { app: unknown };

describe("open-data/providers", () => {
    beforeEach(async () => {
        await osirisRequestRepository.add(OsirisRequestEntityFixture);
        await fonjepRepository.create(FonjepEntityFixture);
    })

    it("should return a list of providers with name, description and last update", async () => {
        const response = await request(g.app)
            .get("/open-data/providers")
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchSnapshot();
    })
})