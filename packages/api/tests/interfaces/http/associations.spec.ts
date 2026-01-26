import { createAndGetAdminToken, createAndGetUserToken } from "../../__helpers__/tokenHelper";
import osirisRequestPort from "../../../src/dataProviders/db/providers/osiris/osiris.request.port";
import request from "supertest";
import {
    OSIRIS_REQUEST_ENTITY,
    OSIRIS_ACTION_ENTITY,
} from "../../modules/providers/osiris/__fixtures__/OsirisEntities";
import { BadRequestError } from "core";
import associationsService from "../../../src/modules/associations/associations.service";
import rnaSirenPort from "../../../src/dataProviders/db/rnaSiren/rnaSiren.port";
import { AnyRawGrant, JoinedRawGrant } from "../../../src/modules/grant/@types/rawGrant";
import demarchesSimplifieesDataPort from "../../../src/dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesData.port";
import {
    DATA_ENTITIES as DS_DATA_ENTITIES,
    SCHEMAS as DS_SCHEMAS,
} from "../../dataProviders/db/__fixtures__/demarchesSimplifiees.fixtures";
import demarchesSimplifieesSchemaPort from "../../../src/dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesSchema.port";

import miscScdlGrantPort from "../../../src/dataProviders/db/providers/scdl/miscScdlGrant.port";
import DEFAULT_ASSOCIATION, {
    API_ASSO_ASSOCIATION_FROM_SIREN,
    API_ASSO_ESTABLISHMENTS_FROM_SIREN,
    LONELY_RNA,
    RNA_STR,
    SIREN_STR,
    SIRET_STR,
} from "../../__fixtures__/association.fixture";
import dauphinPort from "../../../src/dataProviders/db/providers/dauphin/dauphin.port";
import { DAUPHIN_GISPRO_DBOS } from "../../dataProviders/db/__fixtures__/dauphinGispro.fixtures";
import { LOCAL_AUTHORITIES, SCDL_GRANT_DBOS } from "../../dataProviders/db/__fixtures__/scdl.fixtures";
import Rna from "../../../src/identifierObjects/Rna";
import miscScdlProducersPort from "../../../src/dataProviders/db/providers/scdl/miscScdlProducers.port";
import Siren from "../../../src/identifierObjects/Siren";
import statsAssociationsVisitPort from "../../../src/dataProviders/db/stats/statsAssociationsVisit.port";
import { App } from "supertest/types";
import paymentFlatPort from "../../../src/dataProviders/db/paymentFlat/paymentFlat.port";
import apiAssoService from "../../../src/modules/providers/apiAsso/apiAsso.service";
import applicationFlatPort from "../../../src/dataProviders/db/applicationFlat/applicationFlat.port";
import {
    APPLICATION_LINK_TO_CHORUS,
    APPLICATION_LINK_TO_FONJEP,
} from "../../../src/modules/applicationFlat/__fixtures__";
import {
    CHORUS_PAYMENT_FLAT_ENTITY,
    FONJEP_PAYMENT_FLAT_ENTITY,
} from "../../../src/modules/paymentFlat/__fixtures__/paymentFlatEntity.fixture";
import { osirisActionPort } from "../../../src/dataProviders/db/providers/osiris";
import fonjepPostesPort from "../../../src/dataProviders/db/providers/fonjep/fonjep.postes.port";
import {
    DISPOSITIF_ENTITIES,
    POSTE_ENTITIES,
    TIERS_ENTITIES,
    TYPE_POSTE_ENTITIES,
    VERSEMENT_ENTITIES,
} from "../../../src/modules/providers/fonjep/__fixtures__/fonjepEntities";
import fonjepDispositifPort from "../../../src/dataProviders/db/providers/fonjep/fonjep.dispositif.port";
import fonjepTiersPort from "../../../src/dataProviders/db/providers/fonjep/fonjep.tiers.port";
import fonjepVersementsPort from "../../../src/dataProviders/db/providers/fonjep/fonjep.versements.port";
import fonjepTypePostePort from "../../../src/dataProviders/db/providers/fonjep/fonjep.typePoste.port";
import AssociationIdentifier from "../../../src/identifierObjects/AssociationIdentifier";
import rechercheEntreprisesPort from "../../../src/dataProviders/api/rechercheEntreprises/rechercheEntreprises.port";
import { RECHERCHE_ENTREPRISES_DTO } from "../../../src/dataProviders/api/rechercheEntreprises/__fixtures__/RechercheEntreprises";

jest.mock("../../../src/modules/provider-request/providerRequest.service");

const g = global as unknown as { app: App };

const insertData = async (firstTest: boolean) => {
    // data
    await rnaSirenPort.insert({ siren: new Siren(SIREN_STR), rna: new Rna(RNA_STR) });

    // FONJEP
    await fonjepPostesPort.insertMany(POSTE_ENTITIES);
    await fonjepDispositifPort.insertMany(DISPOSITIF_ENTITIES);
    await fonjepTiersPort.insertMany(TIERS_ENTITIES);
    await fonjepVersementsPort.insertMany(VERSEMENT_ENTITIES);
    await fonjepTypePostePort.insertMany(TYPE_POSTE_ENTITIES);

    // APPLICATIONS
    // @ts-expect-error: DBO not fully mocked
    await dauphinPort.upsert(DAUPHIN_GISPRO_DBOS[0]);
    await osirisRequestPort.add(OSIRIS_REQUEST_ENTITY);
    await osirisActionPort.add(OSIRIS_ACTION_ENTITY);
    await demarchesSimplifieesSchemaPort.upsert(DS_SCHEMAS[0]);
    await demarchesSimplifieesDataPort.upsert(DS_DATA_ENTITIES[0]);

    // producer is define for the first test run (needed in config file to init app)
    if (!firstTest) {
        await miscScdlProducersPort.create(LOCAL_AUTHORITIES[0]);
    }

    await miscScdlGrantPort.createMany(SCDL_GRANT_DBOS);

    await applicationFlatPort.insertMany([APPLICATION_LINK_TO_CHORUS, APPLICATION_LINK_TO_FONJEP]);

    // PAYMENT FLAT
    await paymentFlatPort.insertMany([CHORUS_PAYMENT_FLAT_ENTITY, FONJEP_PAYMENT_FLAT_ENTITY]);
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

            const actual = (await statsAssociationsVisitPort.findOnPeriod(beforeRequestTime, new Date()))[0];

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

            const actual = await statsAssociationsVisitPort.findOnPeriod(beforeRequestTime, new Date());
            expect(actual).toHaveLength(0);
        });

        it("should not add one visits on stats AssociationsVisit because user is not authenticated", async () => {
            const beforeRequestTime = new Date();
            await request(g.app).get(`/associationresponse/${SIREN_STR}`).set("Accept", "application/json");
            // TODO test differently

            const actual = await statsAssociationsVisitPort.findOnPeriod(beforeRequestTime, new Date());
            expect(actual).toHaveLength(0);
        });

        it("should not add one visits on stats AssociationsVisit because status is not 200", async () => {
            const beforeRequestTime = new Date();
            const getAssoSpy = jest.spyOn(associationsService, "getAssociation").mockImplementationOnce(() => {
                throw new BadRequestError();
            });
            await request(g.app).get(`/association/${SIREN_STR}`).set("Accept", "application/json");

            const actual = await statsAssociationsVisitPort.findOnPeriod(beforeRequestTime, new Date());
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
            jest.spyOn(rechercheEntreprisesPort, "search").mockResolvedValue({
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
