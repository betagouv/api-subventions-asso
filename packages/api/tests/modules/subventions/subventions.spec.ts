import request from "supertest"
import getUserToken from "../../__helpers__/getUserToken";
import osirisRequestRepository from '../../../src/modules/providers/osiris/repositories/osiris.request.repository';
import fonjepRepository from '../../../src/modules/providers/fonjep/repositories/fonjep.repository';
import FonjepEntityFixture from '../providers/fonjep/__fixtures__/entity';
import OsirisRequestEntityFixture from '../providers/osiris/__fixtures__/entity';
import { Document } from 'mongodb';

const g = global as unknown as { app: unknown }

let osirisDocumentId: string | undefined;
let fonjepDocumentId: string | undefined;

describe("/subvention", () => {
    beforeEach( async () => {
        osirisDocumentId = ((await osirisRequestRepository.add(OsirisRequestEntityFixture)) as Document)._id.toString();
        fonjepDocumentId = ((await fonjepRepository.create(FonjepEntityFixture)) as Document)._id.toString();
    })
    
    describe("/{id}", () => {
        it("should return a subvention from osiris-request collection", async () => {
            const response = await request(g.app)
                .get(`/subvention/${osirisDocumentId}`)
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
        it("should return a subvention from fonjep collection", async () => {
            const response = await request(g.app)
                .get(`/subvention/${fonjepDocumentId}`)
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        })
    })
})