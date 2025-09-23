import request from "supertest";
import { createAndGetAdminToken, createAndGetUserToken } from "../../__helpers__/tokenHelper";
import associationsService from "../../../src/modules/associations/associations.service";
import { BadRequestError } from "core";
import DEFAULT_ASSOCIATION, {
    API_ASSO_ESTABLISHMENTS_FROM_SIREN,
    LONELY_RNA,
    SIREN_STR,
    SIRET_STR,
} from "../../__fixtures__/association.fixture";
import rnaSirenPort from "../../../src/dataProviders/db/rnaSiren/rnaSiren.port";
import Rna from "../../../src/identifierObjects/Rna";
import RnaSirenEntity from "../../../src/entities/RnaSirenEntity";
import Siren from "../../../src/identifierObjects/Siren";
import statsAssociationsVisitPort from "../../../src/dataProviders/db/stats/statsAssociationsVisit.port";
import { App } from "supertest/types";
import apiAssoService from "../../../src/modules/providers/apiAsso/apiAsso.service";
import applicationFlatPort from "../../../src/dataProviders/db/applicationFlat/applicationFlat.port";
import paymentFlatPort from "../../../src/dataProviders/db/paymentFlat/paymentFlat.port";
import {
    APPLICATION_LINK_TO_CHORUS,
    APPLICATION_LINK_TO_FONJEP,
} from "../../../src/modules/applicationFlat/__fixtures__";
import {
    CHORUS_PAYMENT_FLAT_ENTITY,
    FONJEP_PAYMENT_FLAT_ENTITY,
    FONJEP_PAYMENT_FLAT_ENTITY_2,
} from "../../../src/modules/paymentFlat/__fixtures__/paymentFlatEntity.fixture";

const g = global as unknown as { app: App };

const ETABLISSEMENT_SIRET = SIRET_STR;

async function initData() {
    await applicationFlatPort.insertMany([APPLICATION_LINK_TO_CHORUS, APPLICATION_LINK_TO_FONJEP]);

    // PAYMENT FLAT
    await paymentFlatPort.insertMany([
        CHORUS_PAYMENT_FLAT_ENTITY,
        FONJEP_PAYMENT_FLAT_ENTITY,
        FONJEP_PAYMENT_FLAT_ENTITY_2,
    ]);
}

describe("/etablissement", () => {
    beforeAll(async () => {
        jest.spyOn(apiAssoService, "findEstablishmentsBySiren").mockResolvedValue(API_ASSO_ESTABLISHMENTS_FROM_SIREN);
    });

    beforeEach(async () => {
        await rnaSirenPort.insert(
            new RnaSirenEntity(new Rna(DEFAULT_ASSOCIATION.rna), new Siren(DEFAULT_ASSOCIATION.siren)),
        );
        await initData();
    });

    describe("/siret/subventions", () => {
        it("returns subventions", async () => {
            const response = await request(g.app)
                .get(`/etablissement/${ETABLISSEMENT_SIRET}/subventions`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
    });

    describe("/siret/grants", () => {
        it("returns grants", async () => {
            const response = await request(g.app)
                .get(`/etablissement/${ETABLISSEMENT_SIRET}/grants`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
    });

    describe("/siret", () => {
        it("should add one visits on stats AssociationsVisit", async () => {
            const beforeRequestTime = new Date();
            await rnaSirenPort.insert(new RnaSirenEntity(new Rna(LONELY_RNA), new Siren(SIREN_STR)));
            await request(g.app)
                .get(`/etablissement/${SIRET_STR}`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            const actual = (await statsAssociationsVisitPort.findOnPeriod(beforeRequestTime, new Date()))[0];
            expect(actual).toMatchObject({
                associationIdentifier: SIRET_STR.slice(0, 9),
            });
        });

        it("should not add one visits on stats AssociationsVisit beacause user is admin", async () => {
            const beforeRequestTime = new Date();
            await request(g.app)
                .get(`/etablissement/${SIRET_STR}`)
                .set("x-access-token", await createAndGetAdminToken())
                .set("Accept", "application/json");

            const actual = await statsAssociationsVisitPort.findOnPeriod(beforeRequestTime, new Date());
            expect(actual).toHaveLength(0);
        });

        it("should not add one visits on stats AssociationsVisit beacause user is not authentified", async () => {
            const beforeRequestTime = new Date();
            await request(g.app).get(`/etablissement/${SIRET_STR}`).set("Accept", "application/json");

            const actual = await statsAssociationsVisitPort.findOnPeriod(beforeRequestTime, new Date());
            expect(actual).toHaveLength(0);
        });

        it("should not add one visits on stats AssociationsVisit beacause status is not 200", async () => {
            const beforeRequestTime = new Date();
            jest.spyOn(associationsService, "getAssociation").mockImplementationOnce(() => {
                throw new BadRequestError();
            });
            await request(g.app).get(`/etablissement/${SIRET_STR}`).set("Accept", "application/json");

            const actual = await statsAssociationsVisitPort.findOnPeriod(beforeRequestTime, new Date());
            expect(actual).toHaveLength(0);
        });
    });
});
