import { createAndGetAdminToken, createAndGetUserToken } from "../../__helpers__/tokenHelper";
import osirisRequestAdapter from "../../../src/adapters/outputs/db/providers/osiris/osiris.request.adapter";
import request from "supertest";
import {
    OSIRIS_REQUEST_ENTITY,
    OSIRIS_ACTION_ENTITY,
} from "../../modules/providers/osiris/__fixtures__/OsirisEntities";
import { BadRequestError } from "core";
import associationsService from "../../../src/modules/associations/associations.service";
import rnaSirenAdapter from "../../../src/adapters/outputs/db/rna-siren/rna-siren.adapter";
import { AnyRawGrant, JoinedRawGrant } from "../../../src/modules/grant/@types/RawGrant";
import demarchesSimplifieesDataAdapter from "../../../src/adapters/outputs/db/providers/demarches-simplifiees/demarches-simplifiees-data.adapter";
import {
    DATA_ENTITIES as DS_DATA_ENTITIES,
    SCHEMAS as DS_SCHEMAS,
} from "../../dataProviders/db/__fixtures__/demarchesSimplifiees.fixtures";
import demarchesSimplifieesSchemaAdapter from "../../../src/adapters/outputs/db/providers/demarches-simplifiees/demarches-simplifiees-schema.adapter";

import miscScdlGrantAdapter from "../../../src/adapters/outputs/db/providers/scdl/misc-scdl-grant.adapter";
import DEFAULT_ASSOCIATION, {
    API_ASSO_ASSOCIATION_FROM_SIREN,
    API_ASSO_ESTABLISHMENTS_FROM_SIREN,
    LONELY_RNA,
    RNA_STR,
    SIREN_STR,
    SIRET_STR,
} from "../../__fixtures__/association.fixture";
import dauphinAdapter from "../../../src/adapters/outputs/db/providers/dauphin/dauphin.adapter";
import Rna from "../../../src/identifier-objects/Rna";
import miscScdlProducersAdapter from "../../../src/adapters/outputs/db/providers/scdl/misc-scdl-producers.adapter";
import Siren from "../../../src/identifier-objects/Siren";
import statsAssociationsVisitAdapter from "../../../src/adapters/outputs/db/stats/association-visit.adapter";
import { App } from "supertest/types";
import paymentFlatAdapter from "../../../src/adapters/outputs/db/payment-flat/payment-flat.adapter";
import apiAssoService from "../../../src/modules/providers/api-asso/api-asso.service";
import applicationFlatAdapter from "../../../src/adapters/outputs/db/application-flat/application-flat.adapter";
import {
    APPLICATION_LINK_TO_CHORUS,
    APPLICATION_LINK_TO_FONJEP,
} from "../../../src/modules/application-flat/__fixtures__/application-flat.fixture";
import {
    CHORUS_PAYMENT_FLAT_ENTITY,
    FONJEP_PAYMENT_FLAT_ENTITY,
} from "../../../src/modules/payment-flat/__fixtures__/payment-flat.fixture";
import { osirisActionAdapter } from "../../../src/adapters/outputs/db/providers/osiris";
import fonjepPostesAdapter from "../../../src/adapters/outputs/db/providers/fonjep/fonjep.postes.adapter";
import {
    DISPOSITIF_ENTITIES,
    POSTE_ENTITIES,
    TIERS_ENTITIES,
    TYPE_POSTE_ENTITIES,
    VERSEMENT_ENTITIES,
} from "../../../src/modules/providers/fonjep/__fixtures__/fonjepEntities";
import fonjepDispositifAdapter from "../../../src/adapters/outputs/db/providers/fonjep/fonjep.dispositif.adapter";
import fonjepTiersAdapter from "../../../src/adapters/outputs/db/providers/fonjep/fonjep.tiers.adapter";
import fonjepVersementsAdapter from "../../../src/adapters/outputs/db/providers/fonjep/fonjep.versements.adapter";
import fonjepTypePosteAdapter from "../../../src/adapters/outputs/db/providers/fonjep/fonjep.typePoste.adapter";
import AssociationIdentifier from "../../../src/identifier-objects/AssociationIdentifier";
import rechercheEntreprisesAdapter from "../../../src/adapters/outputs/api/recherche-entreprises/recherche-entreprises.adapter";
import { RECHERCHE_ENTREPRISES_DTO } from "../../../src/adapters/outputs/api/recherche-entreprises/__fixtures__/recherche-entreprise.fixture";
import { LOCAL_AUTHORITIES, SCDL_GRANT_DBOS } from "../../dataProviders/db/__fixtures__/scdl.fixtures";
import { DAUPHIN_GISPRO_DBOS } from "../../dataProviders/db/__fixtures__/dauphinGispro.fixtures";

jest.mock("../../../src/modules/provider-request/provider-request.service");

const g = global as unknown as { app: App };

const insertData = async (firstTest: boolean) => {
    // data
    await rnaSirenAdapter.insert({ siren: new Siren(SIREN_STR), rna: new Rna(RNA_STR) });

    // FONJEP
    await fonjepPostesAdapter.insertMany(POSTE_ENTITIES);
    await fonjepDispositifAdapter.insertMany(DISPOSITIF_ENTITIES);
    await fonjepTiersAdapter.insertMany(TIERS_ENTITIES);
    await fonjepVersementsAdapter.insertMany(VERSEMENT_ENTITIES);
    await fonjepTypePosteAdapter.insertMany(TYPE_POSTE_ENTITIES);

    // APPLICATIONS
    // @ts-expect-error: not fully mocked
    await dauphinAdapter.upsert(DAUPHIN_GISPRO_DBOS[0]);
    await osirisRequestAdapter.add(OSIRIS_REQUEST_ENTITY);
    await osirisActionAdapter.add(OSIRIS_ACTION_ENTITY);
    await demarchesSimplifieesSchemaAdapter.upsert(DS_SCHEMAS[0]);
    await demarchesSimplifieesDataAdapter.upsert(DS_DATA_ENTITIES[0]);

    // producer is define for the first test run (needed in config file to init app)
    if (!firstTest) {
        await miscScdlProducersAdapter.create(LOCAL_AUTHORITIES[0]);
    }

    await miscScdlGrantAdapter.createMany(SCDL_GRANT_DBOS);

    await applicationFlatAdapter.insertMany([APPLICATION_LINK_TO_CHORUS, APPLICATION_LINK_TO_FONJEP]);

    // PAYMENT FLAT
    await paymentFlatAdapter.insertMany([CHORUS_PAYMENT_FLAT_ENTITY, FONJEP_PAYMENT_FLAT_ENTITY]);
};

describe("/association", () => {
    // use to retrieve Association and Establishments from API ASSO (most viable source of data)
    let mockGetAssociationBySiren: jest.SpyInstance;
    let mockGetEstablishmentsBySiren: jest.SpyInstance;
    let firstTest = true;
    beforeEach(async () => {
        await insertData(firstTest);
        firstTest = false;
        mockGetAssociationBySiren = jest
            .spyOn(apiAssoService, "findAssociationBySiren")
            .mockResolvedValue(API_ASSO_ASSOCIATION_FROM_SIREN);
        mockGetEstablishmentsBySiren = jest
            .spyOn(apiAssoService, "findEstablishmentsBySiren")
            .mockResolvedValue(API_ASSO_ESTABLISHMENTS_FROM_SIREN);
    });

    afterAll(() => mockGetEstablishmentsBySiren.mockRestore());

    afterEach(() => {
        mockGetAssociationBySiren.mockClear();
        mockGetEstablishmentsBySiren.mockClear();
    });

    describe("/{structure_identifier}", () => {
        it("should return an association", async () => {
            const response = await request(g.app)
                .get(`/association/${SIREN_STR}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });

        it("should add one visit on stats AssociationsVisit", async () => {
            const beforeRequestTime = new Date();
            await request(g.app)
                .get(`/association/${SIREN_STR}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            const actual = (await statsAssociationsVisitAdapter.findOnPeriod(beforeRequestTime, new Date()))[0];

            expect(actual).toMatchObject({
                associationIdentifier: OSIRIS_REQUEST_ENTITY.legalInformations.siret.slice(0, 9),
            });
        });

        it("should not add one visits on stats AssociationsVisit because user is admin", async () => {
            const beforeRequestTime = new Date();
            await request(g.app)
                .get(`/association/${SIREN_STR}`)
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json");
            // TODO test differently

            const actual = await statsAssociationsVisitAdapter.findOnPeriod(beforeRequestTime, new Date());
            expect(actual).toHaveLength(0);
        });

        it("should not add one visits on stats AssociationsVisit because user is not authenticated", async () => {
            const beforeRequestTime = new Date();
            await request(g.app).get(`/associationresponse/${SIREN_STR}`).set("Accept", "application/json");
            // TODO test differently

            const actual = await statsAssociationsVisitAdapter.findOnPeriod(beforeRequestTime, new Date());
            expect(actual).toHaveLength(0);
        });

        it("should not add one visits on stats AssociationsVisit because status is not 200", async () => {
            const beforeRequestTime = new Date();
            const getAssoSpy = jest.spyOn(associationsService, "getAssociation").mockImplementationOnce(() => {
                throw new BadRequestError();
            });
            await request(g.app).get(`/association/${SIREN_STR}`).set("Accept", "application/json");

            const actual = await statsAssociationsVisitAdapter.findOnPeriod(beforeRequestTime, new Date());
            expect(actual).toHaveLength(0);
            getAssoSpy.mockRestore();
        });
    });

    describe("/{structure_identifier}/subventions", () => {
        it("should return a list of subventions", async () => {
            const response = await request(g.app)
                .get(`/association/${DEFAULT_ASSOCIATION.siret}/subventions`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);

            const subventions = response.body.subventions;

            expect(subventions).toMatchSnapshot();
        });

        it("should return empty array if RNA does not match a SIREN", async () => {
            const response = await request(g.app)
                .get(`/association/${LONELY_RNA}/subventions`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);

            const actual = response.body.subventions;
            expect(actual).toHaveLength(0);
        });
    });

    describe("/{identifier}/paiements", () => {
        it("returns a list of payments flat", async () => {
            const response = await request(g.app)
                .get(`/association/${DEFAULT_ASSOCIATION.siret}/paiements`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);

            const payments = response.body.paiements;

            expect(payments).toMatchSnapshot();
        });
    });

    describe("/{identifier}/applications", () => {
        it("returns a list of applications flat", async () => {
            const response = await request(g.app)
                .get(`/association/${DEFAULT_ASSOCIATION.siret}/applications`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);

            const applications = response.body.applications;

            expect(applications).toMatchSnapshot();
        });
    });

    describe("/{structure_identifier}/etablissements", () => {
        it("should return EstablishmentSimplified[]", async () => {
            const response = await request(g.app)
                .get(`/association/${SIREN_STR}/etablissements`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
    });

    describe("/{identifier}/grants/v2", () => {
        it("should return grants with rna", async () => {
            const response = await request(g.app)
                .get(`/association/${RNA_STR}/grants/v2`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);

            expect(response.body).toMatchSnapshot();
        });

        it("should return grants with siren", async () => {
            const response = await request(g.app)
                .get(`/association/${SIREN_STR}/grants/v2`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
    });

    describe("/{identifier}/grants", () => {
        // avoid test failure on date timezone
        function expectAnyApplicationDate(grants) {
            return grants.map(grant => {
                if (grant.application) {
                    if (grant.application.date_debut) grant.application.date_debut.value = expect.any(Date);
                    if (grant.application.date_fin) grant.application.date_fin.value = expect.any(Date);
                }
                return grant;
            });
        }

        it("should return grants with rna", async () => {
            const response = await request(g.app)
                .get(`/association/${RNA_STR}/grants`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);

            response.body.subventions = expectAnyApplicationDate(response.body.subventions);
            expect(response.body).toMatchSnapshot();
        });

        it("should return grants with siren", async () => {
            const response = await request(g.app)
                .get(`/association/${SIREN_STR}/grants`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            response.body.subventions = expectAnyApplicationDate(response.body.subventions);
            expect(response.body).toMatchSnapshot();
        });
    });

    describe("/{identifier}/raw-grants", () => {
        const anonymiseData = (data: JoinedRawGrant[] | null) => {
            if (!data) return null;
            const expectAnyRawGrantId = (rawGrant: AnyRawGrant) => {
                // if Application or Payment
                return {
                    ...rawGrant,
                    data: { ...rawGrant.data, _id: expect.any(String) },
                };
            };

            const withoutIdGrants = data.map(joinedRawGrant => ({
                application: joinedRawGrant.application ? expectAnyRawGrantId(joinedRawGrant.application) : null,
                payments: joinedRawGrant.payments?.map(expectAnyRawGrantId),
            }));

            return withoutIdGrants;
        };

        it("should return raw grants with siren", async () => {
            const response = await request(g.app)
                .get(`/association/${SIREN_STR}/raw-grants`)
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(anonymiseData(response.body)).toMatchSnapshot();
        });

        it("should return raw grants with rna", async () => {
            const response = await request(g.app)
                .get(`/association/${RNA_STR}/raw-grants`)
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(anonymiseData(response.body)).toMatchSnapshot();
        });

        it("should return empty array if identifier is RNA and no SIREN matched", async () => {
            const expected = [];
            const response = await request(g.app)
                .get(`/association/${LONELY_RNA}/raw-grants`)
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            const actual = response.body;
            expect(actual).toEqual(expected);
        });
    });

    // we assume that only testing one entrypoint is enough to test the middleware
    // @THOUGHTS: should we test this elsewhere, and maybe creating its own file ?
    describe("isAssoIdentifierFromAssoMiddleware", () => {
        const API_RE_SIREN = "900000000";
        let spyGetAssociation: jest.SpyInstance;
        beforeEach(() => {
            spyGetAssociation = jest.spyOn(associationsService, "getAssociation");
            // set Recherche Entreprise to only search for one page
            jest.spyOn(rechercheEntreprisesAdapter, "search").mockResolvedValue({
                ...RECHERCHE_ENTREPRISES_DTO,
                total_pages: 1,
                page: 1,
                total_results: 1,
            });
        });

        it("fills AssociationIdentifier with rna-siren collection", async () => {
            await request(g.app)
                .get(`/association/${SIREN_STR}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(spyGetAssociation).toHaveBeenCalledWith(
                AssociationIdentifier.fromSirenAndRna(new Siren(SIREN_STR), new Rna(RNA_STR)),
            );
        });

        it("calls API Recherche Entreprise when rna-siren does not contains a match", async () => {
            await request(g.app)
                .get(`/association/${LONELY_RNA}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(spyGetAssociation).toHaveBeenCalledWith(
                AssociationIdentifier.fromSirenAndRna(new Siren(API_RE_SIREN), new Rna(LONELY_RNA)),
            );
        });
    });

    describe("/{identifier}/grants/csv", () => {
        it.each`
            identifierType | identifier
            ${"siren"}     | ${SIREN_STR}
            ${"rna"}       | ${RNA_STR}
            ${"siret"}     | ${SIRET_STR}
        `("returns extract from $identifierType", async ({ identifier }) => {
            const response = await request(g.app)
                .get(`/association/${identifier}/grants/csv`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "text/csv");

            expect(response.statusCode).toBe(200);
            const actual = response.text;
            expect(actual).toMatchSnapshot();
        });
    });
});
