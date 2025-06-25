import { createAndGetAdminToken, createAndGetUserToken } from "../../__helpers__/tokenHelper";
import osirisRequestPort from "../../../src/dataProviders/db/providers/osiris/osiris.request.port";
import fonjepSubventionPort from "../../../src/dataProviders/db/providers/fonjep/fonjep.subvention.port.old";
import {
    SubventionEntity as FonjepSubventionFixture,
    PaymentEntity as FonjepPaymentFixture,
} from "../../modules/providers/fonjep/__fixtures__/entity";
import request from "supertest";
import OsirisRequestEntityFixture from "../../modules/providers/osiris/__fixtures__/entity";
import { compareByValueBuilder } from "../../../src/shared/helpers/ArrayHelper";
import { BadRequestError } from "core";
import associationsService from "../../../src/modules/associations/associations.service";
import rnaSirenPort from "../../../src/dataProviders/db/rnaSiren/rnaSiren.port";
import { JoinedRawGrant, RawGrant } from "../../../src/modules/grant/@types/rawGrant";
import demarchesSimplifieesDataPort from "../../../src/dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesData.port";
import {
    DATA_ENTITIES as DS_DATA_ENTITIES,
    SCHEMAS as DS_SCHEMAS,
} from "../../dataProviders/db/__fixtures__/demarchesSimplifiees.fixtures";
import demarchesSimplifieesSchemaPort from "../../../src/dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesSchema.port";
import demarchesSimplifieesService from "../../../src/modules/providers/demarchesSimplifiees/demarchesSimplifiees.service";

import miscScdlGrantPort from "../../../src/dataProviders/db/providers/scdl/miscScdlGrant.port";
import DEFAULT_ASSOCIATION, {
    API_ASSO_ASSOCIATION_FROM_SIREN,
    API_ASSO_ETABLISSEMENTS_FROM_SIREN,
    LONELY_RNA,
    RNA_STR,
    SIREN_STR,
    SIRET_STR,
} from "../../__fixtures__/association.fixture";
import dauphinGisproPort from "../../../src/dataProviders/db/providers/dauphin/dauphin-gispro.port";
import { DAUPHIN_GISPRO_DBOS } from "../../dataProviders/db/__fixtures__/dauphinGispro.fixtures";
import { LOCAL_AUTHORITIES, SCDL_GRANT_DBOS } from "../../dataProviders/db/__fixtures__/scdl.fixtures";
import fonjepPaymentPort from "../../../src/dataProviders/db/providers/fonjep/fonjep.payment.port.old";
import Rna from "../../../src/identifierObjects/Rna";
import miscScdlProducersPort from "../../../src/dataProviders/db/providers/scdl/miscScdlProducers.port";
import Siren from "../../../src/identifierObjects/Siren";
import statsAssociationsVisitPort from "../../../src/dataProviders/db/stats/statsAssociationsVisit.port";
import { App } from "supertest/types";
import paymentFlatPort from "../../../src/dataProviders/db/paymentFlat/paymentFlat.port";
import { PAYMENT_FLAT_DBO } from "../../../src/dataProviders/db/paymentFlat/__fixtures__/paymentFlatDbo.fixture";
import PaymentFlatAdapter from "../../../src/modules/paymentFlat/paymentFlatAdapter";
import apiAssoService from "../../../src/modules/providers/apiAsso/apiAsso.service";

jest.mock("../../../src/modules/provider-request/providerRequest.service");

const g = global as unknown as { app: App };

const insertData = async () => {
    // data
    await rnaSirenPort.insert({ siren: new Siren(SIREN_STR), rna: new Rna(RNA_STR) });

    // PAYMENTS
    await fonjepPaymentPort.create(FonjepPaymentFixture);
    await paymentFlatPort.insertMany([PaymentFlatAdapter.dboToEntity(PAYMENT_FLAT_DBO)]);

    // APPLICATIONS
    // @ts-expect-error: DBO not fully mocked
    await dauphinGisproPort.upsert(DAUPHIN_GISPRO_DBOS[0]);
    await osirisRequestPort.add(OsirisRequestEntityFixture);
    await fonjepSubventionPort.create(FonjepSubventionFixture);
    await demarchesSimplifieesSchemaPort.upsert(DS_SCHEMAS[0]);
    await demarchesSimplifieesDataPort.upsert(DS_DATA_ENTITIES[0]);
    // jest integ setup insert producers on app launch and may be defined at this point
    //@ts-expect-error: only for test
    await miscScdlProducersPort.upsert(LOCAL_AUTHORITIES[0].slug, LOCAL_AUTHORITIES[0]);
    await miscScdlGrantPort.createMany(SCDL_GRANT_DBOS);
};

describe("/association", () => {
    // use to retrieve Association and Etablissements from API ASSO (most viable source of data)
    let mockGetAssociationBySiren: jest.SpyInstance;
    let mockGetEtablissementsBySiren: jest.SpyInstance;

    beforeEach(async () => {
        await insertData();
        mockGetAssociationBySiren = jest
            .spyOn(apiAssoService, "findAssociationBySiren")
            .mockResolvedValue(API_ASSO_ASSOCIATION_FROM_SIREN);
        mockGetEtablissementsBySiren = jest
            .spyOn(apiAssoService, "findEtablissementsBySiren")
            .mockResolvedValue(API_ASSO_ETABLISSEMENTS_FROM_SIREN);
    });

    afterAll(() => mockGetEtablissementsBySiren.mockRestore());

    afterEach(() => {
        mockGetAssociationBySiren.mockClear();
        mockGetEtablissementsBySiren.mockClear();
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
                associationIdentifier: OsirisRequestEntityFixture.legalInformations.siret.slice(0, 9),
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
            await request(g.app).get(`/association/${SIREN_STR}`).set("Accept", "application/json");
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

    describe("/{structure_identifier}/etablissements", () => {
        it("should return SimplifiedEtablissement[]", async () => {
            const response = await request(g.app)
                .get(`/association/${SIREN_STR}/etablissements`)
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
            const expectAnyRawGrantId = (rawGrant: RawGrant) => {
                // if FullGrant
                if (rawGrant.data.application && rawGrant.data.payments) {
                    return {
                        ...rawGrant,

                        // ...rawGrant.data, _id: expect.any(String) },
                        data: {
                            application: { ...rawGrant.data.application, _id: expect.any(String) },
                            // @ts-expect-error: better type payments
                            payments: rawGrant.data.payments.map(payment => ({ ...payment, _id: expect.any(String) })),
                        },
                    };
                }
                // if Application or Payment
                else
                    return {
                        ...rawGrant,
                        data: { ...rawGrant.data, _id: expect.any(String) },
                    };
            };

            const withoutIdGrants = data.map(joinedRawGrant => ({
                fullGrants: joinedRawGrant.fullGrants?.map(expectAnyRawGrantId),
                applications: joinedRawGrant.applications?.map(expectAnyRawGrantId),
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
            // expect(response.statusCode).toBe(200);
            const actual = response.text;
            expect(actual).toMatchSnapshot();
        });
    });
});
