import { createAndGetAdminToken, createAndGetUserToken } from "../../__helpers__/tokenHelper";
import osirisRequestRepository from "../../../src/modules/providers/osiris/repositories/osiris.request.repository";
import fonjepSubventionRepository from "../../../src/modules/providers/fonjep/repositories/fonjep.subvention.repository";
import { SubventionEntity as FonjepEntityFixture } from "../../modules/providers/fonjep/__fixtures__/entity";
import request from "supertest";
import OsirisRequestEntityFixture from "../../modules/providers/osiris/__fixtures__/entity";
import dauphinService from "../../../src/modules/providers/dauphin/dauphin.service";
import { compareByValueBuilder } from "../../../src/shared/helpers/ArrayHelper";
import statsService from "../../../src/modules/stats/stats.service";
import { siretToSiren } from "../../../src/shared/helpers/SirenHelper";
import { BadRequestError } from "../../../src/shared/errors/httpErrors";
import associationsService from "../../../src/modules/associations/associations.service";
import rnaSirenPort from "../../../src/dataProviders/db/rnaSiren/rnaSiren.port";
import { Rna } from "dto";
import { JoinedRawGrant, RawGrant } from "../../../src/modules/grant/@types/rawGrant";
import demarchesSimplifieesDataRepository from "../../../src/modules/providers/demarchesSimplifiees/repositories/demarchesSimplifieesData.repository";
import {
    DATA_ENTITIES as DS_DATA_ENTITIES,
    SCHEMAS as DS_SCHEMAS,
} from "../../dataProviders/db/__fixtures__/demarchesSimplifiees.fixtures";
import demarchesSimplifieesMapperRepository from "../../../src/modules/providers/demarchesSimplifiees/repositories/demarchesSimplifieesMapper.repository";
import demarchesSimplifieesService from "../../../src/modules/providers/demarchesSimplifiees/demarchesSimplifiees.service";
import caisseDepotsService from "../../../src/modules/providers/caisseDepots/caisseDepots.service";
import { CAISSE_DES_DEPOTS_DTO } from "../../dataProviders/api/caisseDepots.fixtures";
import miscScdlProducersRepository from "../../../src/modules/providers/scdl/repositories/miscScdlProducer.repository";
import { LOCAL_AUTHORITIES, SCDL_GRANT_DBOS } from "../../dataProviders/db/__fixtures__/scdl.fixtures";
import miscScdlGrantRepository from "../../../src/modules/providers/scdl/repositories/miscScdlGrant.repository";
import DEFAULT_ASSOCIATION from "../../__fixtures__/association.fixture";
import dauphinGisproRepository from "../../../src/modules/providers/dauphin/repositories/dauphin-gispro.repository";
import { DAUPHIN_GISPRO_DBOS } from "../../dataProviders/db/__fixtures__/dauphinGispro.fixtures";
jest.mock("../../../src/modules/provider-request/providerRequest.service");

const g = global as unknown as { app: unknown };

const mockExternalData = async () => {
    // @ts-expect-error: mock protected http ProviderServiceRequest
    caisseDepotsService.http = { get: () => ({ data: CAISSE_DES_DEPOTS_DTO }) };
};

const insertData = async () => {
    // @ts-expect-error: DBO not fully mocked
    await dauphinGisproRepository.upsert(DAUPHIN_GISPRO_DBOS[0]);
    await osirisRequestRepository.add(OsirisRequestEntityFixture);
    await fonjepSubventionRepository.create(FonjepEntityFixture);
    await demarchesSimplifieesMapperRepository.upsert(DS_SCHEMAS[0]);
    await demarchesSimplifieesDataRepository.upsert(DS_DATA_ENTITIES[0]);
    await miscScdlProducersRepository.create(LOCAL_AUTHORITIES[0]);
    await miscScdlGrantRepository.createMany(SCDL_GRANT_DBOS);
};

describe("/association", () => {
    beforeEach(async () => {
        await insertData();
        mockExternalData();
    });

    describe("/{structure_identifier}/subventions", () => {
        it("should return a list of subventions", async () => {
            const response = await request(g.app)
                .get(`/association/${DEFAULT_ASSOCIATION.siret}/subventions`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);

            const subventions = response.body.subventions;
            // Sort subventions (OSIRIS first) to avoid race test failure
            subventions.sort(compareByValueBuilder("siret.provider"));

            // replace date in Démarches Simplifiees
            // avoid timezone date test failure
            // use siret.provider to check on provider name by default
            subventions.forEach(subvention => {
                if (subvention.siret.provider === demarchesSimplifieesService.provider.name) {
                    subvention.date_debut.value = expect.any(Date);
                    subvention.date_fin.value = expect.any(Date);
                }
            });

            expect(subventions).toMatchSnapshot();
        });
    });

    describe("/{structure_identifier}", () => {
        it("should return an association", async () => {
            const response = await request(g.app)
                .get(`/association/${OsirisRequestEntityFixture.legalInformations.siret}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });

        it("should add one visit on stats AssociationsVisit", async () => {
            const beforeRequestTime = new Date();
            await request(g.app)
                .get(`/association/${OsirisRequestEntityFixture.legalInformations.siret}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            const actual = await statsService.getTopAssociationsByPeriod(1, beforeRequestTime, new Date());
            const expected = [
                {
                    name: siretToSiren(OsirisRequestEntityFixture.legalInformations.siret),
                    visits: 1,
                },
            ];

            expect(actual).toEqual(expected);
        });

        it("should not add one visits on stats AssociationsVisit because user is admin", async () => {
            const beforeRequestTime = new Date();
            await request(g.app)
                .get(`/association/${OsirisRequestEntityFixture.legalInformations.siret}`)
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json");
            const actual = await statsService.getTopAssociationsByPeriod(1, beforeRequestTime, new Date());

            expect(actual).toHaveLength(0);
        });

        it("should not add one visits on stats AssociationsVisit because user is not authenticated", async () => {
            const beforeRequestTime = new Date();
            await request(g.app)
                .get(`/association/${OsirisRequestEntityFixture.legalInformations.siret}`)
                .set("Accept", "application/json");
            const actual = await statsService.getTopAssociationsByPeriod(1, beforeRequestTime, new Date());

            expect(actual).toHaveLength(0);
        });

        it("should not add one visits on stats AssociationsVisit because status is not 200", async () => {
            const beforeRequestTime = new Date();
            jest.spyOn(associationsService, "getAssociation").mockImplementationOnce(() => {
                throw new BadRequestError();
            });
            await request(g.app)
                .get(`/association/${OsirisRequestEntityFixture.legalInformations.siret}`)
                .set("Accept", "application/json");
            const actual = await statsService.getTopAssociationsByPeriod(1, beforeRequestTime, new Date());

            expect(actual).toHaveLength(0);
        });
    });

    describe("/{structure_identifier}/etablissements", () => {
        it("should return SimplifiedEtablissement[]", async () => {
            const response = await request(g.app)
                .get(`/association/${siretToSiren(OsirisRequestEntityFixture.legalInformations.siret)}/etablissements`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
    });

    describe("/{identifier}/raw-grants", () => {
        it("should return raw grants with siren", async () => {
            // SIREN must be from an association
            const SIREN = siretToSiren(OsirisRequestEntityFixture.legalInformations.siret);
            await rnaSirenPort.insert({ siren: SIREN, rna: OsirisRequestEntityFixture.legalInformations.rna as Rna });

            const response = await request(g.app)
                .get(`/association/${SIREN}/raw-grants`)
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);

            const expectAnyRawGrantId = (rawGrant: RawGrant) => ({
                ...rawGrant,
                data: { ...rawGrant.data, _id: expect.any(String) },
            });

            const withoutIdGrants = (response.body as JoinedRawGrant[]).map(joinedRawGrant => ({
                fullGrants: joinedRawGrant.fullGrants?.map(expectAnyRawGrantId),
                applications: joinedRawGrant.applications?.map(expectAnyRawGrantId),
                payments: joinedRawGrant.payments?.map(expectAnyRawGrantId),
            }));

            expect(withoutIdGrants).toMatchSnapshot();
        });

        it("should return raw grants with rna", async () => {
            const RNA = OsirisRequestEntityFixture.legalInformations.rna as Rna;

            const response = await request(g.app)
                .get(`/association/${RNA}/raw-grants`)
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
    });
});
