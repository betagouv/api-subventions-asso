import request from "supertest"
import getUserToken from "../../__helpers__/getUserToken";
import osirisRequestRepository from '../../../src/modules/providers/osiris/repositories/osiris.request.repository';
import osirisService from '../../../src/modules/providers/osiris/osiris.service';
import fonjepSubventionRepository from '../../../src/modules/providers/fonjep/repositories/fonjep.subvention.repository';
import fonjepService from '../../../src/modules/providers/fonjep/fonjep.service';
import { SubventionEntity as FonjepEntityFixture } from '../providers/fonjep/__fixtures__/entity';
import OsirisRequestEntityFixture from '../providers/osiris/__fixtures__/entity';
import dauphinService from "../../../src/modules/providers/dauphin/dauphin.service";
import { siretToSiren } from "../../../src/shared/helpers/SirenHelper";

const g = global as unknown as { app: unknown }

describe("/association", () => {
    beforeEach(async () => {
        jest.spyOn(dauphinService, "getDemandeSubventionBySiren").mockImplementationOnce(async () => [])
        await osirisRequestRepository.add(OsirisRequestEntityFixture);

        await fonjepSubventionRepository.create(FonjepEntityFixture);
    })

    describe("/{structure_identifier}/subventions", () => {
        it("should return a list of subventions", async () => {

            const expected = JSON.parse(JSON.stringify([
                ... (await osirisService.getDemandeSubventionBySiren(siretToSiren(OsirisRequestEntityFixture.legalInformations.siret)) || []),
                ... (await fonjepService.getDemandeSubventionBySiren(siretToSiren(OsirisRequestEntityFixture.legalInformations.siret)) || []),
            ]));

            const response = await request(g.app)
                .get(`/association/${OsirisRequestEntityFixture.legalInformations.siret}/subventions`)
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.subventions).toEqual(expect.arrayContaining(expected));
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

    describe("/{structure_identifier}/etablissements", () => {
        it("should return SimplifiedEtablissement[]", async () => {
            const response = await request(g.app)
                .get(`/association/${OsirisRequestEntityFixture.legalInformations.rna}/etablissements`)
                .set("x-access-token", await getUserToken())
                .set('Accept', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
    });
})