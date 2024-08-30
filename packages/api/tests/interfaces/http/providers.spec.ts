import { createAndGetAdminToken, createAndGetUserToken } from "../../__helpers__/tokenHelper";
import osirisRequestRepository from "../../../src/modules/providers/osiris/repositories/osiris.request.repository";
import fonjepSubventionRepository from "../../../src/modules/providers/fonjep/repositories/fonjep.subvention.repository";
import {
    SubventionEntity as FonjepSubventionFixture,
    PaymentEntity as FonjepPaymentFixture,
} from "../../modules/providers/fonjep/__fixtures__/entity";
import request from "supertest";
import OsirisRequestEntityFixture from "../../modules/providers/osiris/__fixtures__/entity";
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

import miscScdlGrantRepository from "../../../src/modules/providers/scdl/repositories/miscScdlGrant.repository";
import DEFAULT_ASSOCIATION, { LONELY_RNA } from "../../__fixtures__/association.fixture";
import dauphinGisproRepository from "../../../src/modules/providers/dauphin/repositories/dauphin-gispro.repository";
import { DAUPHIN_GISPRO_DBOS } from "../../dataProviders/db/__fixtures__/dauphinGispro.fixtures";
import rnaSirenService from "../../../src/modules/rna-siren/rnaSiren.service";
import FonjepEntityAdapter from "../../../src/modules/providers/fonjep/adapters/FonjepEntityAdapter";
import { SCDL_GRANT_DBOS } from "../../dataProviders/db/__fixtures__/scdl.fixtures";
import chorusLineRepository from "../../../src/modules/providers/chorus/repositories/chorus.line.repository";
import { ChorusFixtures } from "../../dataProviders/db/__fixtures__/chorus.fixtures";
import fonjepPaymentRepository from "../../../src/modules/providers/fonjep/repositories/fonjep.payment.repository";
import FonjepSubventionEntity from "../../../src/modules/providers/fonjep/entities/FonjepSubventionEntity";
import dataLogRepository from "../../../src/modules/data-log/repositories/dataLog.repository";

jest.mock("../../../src/modules/provider-request/providerRequest.service");

const g = global as unknown as { app: unknown };

const insertData = async () => {
    await dataLogRepository.insertMany([
        {
            editionDate: new Date("2022-01-01"),
            integrationDate: new Date("2022-01-01"),
            providerId: "prov1",
        },
        {
            editionDate: new Date("2023-01-01"),
            integrationDate: new Date("2023-01-01"),
            providerId: "prov1",
        },
        {
            editionDate: new Date("2022-05-01"),
            integrationDate: new Date("2022-05-01"),
            providerId: "prov2",
        },
    ]);
};

describe("/open-data/fournisseurs", () => {
    beforeEach(async () => {
        await insertData();
    });

    describe("/historique", () => {
        it("should return raw grants with rna", async () => {
            const response = await request(g.app)
                .get(`/open-data/fournisseurs/historique`)
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchSnapshot();
        });
    });
});
