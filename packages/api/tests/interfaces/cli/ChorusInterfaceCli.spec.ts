import ChorusCli from "../../../src/adapters/inputs/cli/Chorus.cli";
import path from "path";
import chorusAdapter from "../../../src/adapters/outputs/db/providers/chorus/chorus.adapter";
import paymentFlatAdapter from "../../../src/adapters/outputs/db/payment-flat/payment-flat.adapter";
import uniteLegalEntrepriseAdapter from "../../../src/adapters/outputs/db/unite-legale-entreprise/unite-legale-entreprise.adapter";
import sireneUniteLegaleDbAdapter from "../../../src/adapters/outputs/db/sirene/stock-unite-legale/sirene-stock-unite-legale.adapter";
import { SireneStockUniteLegaleEntity } from "../../../src/entities/SireneStockUniteLegaleEntity";
import apiAssoService from "../../../src/modules/providers/api-asso/api-asso.service";
import { Association } from "dto";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../src/shared/LegalCategoriesAccepted";
import Siren from "../../../src/identifier-objects/Siren";
import {
    CHORUS_FSE_ENTITIES,
    CHORUS_ENTITIES,
} from "../../../src/modules/providers/chorus/__fixtures__/ChorusFixtures";
import stateBudgetProgramAdapter from "../../../src/adapters/outputs/db/state-budget-program/state-budget-program.adapter";
import chorusFseAdapter from "../../../src/adapters/outputs/db/providers/chorus/chorus.fse.adapter";
import dataLogAdapter from "../../../src/adapters/outputs/db/data-log/data-log.adapter";
import { toArray } from "../../__helpers__/ayncIterableHelper";
import { PROGRAMS } from "../../dataProviders/db/__fixtures__/stateBudgetProgram";

describe("ChorusCli", () => {
    // it contains :
    // - 5 associations document with specificities : 2 with wrong siret, 2 linked (resulting in a merge in paymentFlat)
    // - 1 fondation document => filtered out
    // - 1 company document => filtered out
    const FILE_PATH = path.resolve(__dirname, "./__fixtures__/new-chorus-export.xlsx");
    // change this when you update the fixture
    const NB_ASSOS_IN_FILES = 5;

    const EXPORT_DATE = "2023-12-06";

    let controller: ChorusCli;

    beforeEach(async () => {
        controller = new ChorusCli();

        await Promise.all([
            stateBudgetProgramAdapter.replace(PROGRAMS),
            // make siren 100000000 belong to asso
            sireneUniteLegaleDbAdapter.insertOne({ siren: new Siren("100000000") } as SireneStockUniteLegaleEntity),
            // make siren 30000000 belong to an entreprise
            uniteLegalEntrepriseAdapter.insertMany([{ siren: new Siren("300000000") }]),
        ]);
    });

    describe("_parse()", () => {
        beforeAll(async () => {
            jest.spyOn(apiAssoService, "findAssociationBySiren").mockImplementation((siren: Siren) => {
                if (["200000000"].includes(siren.value))
                    // one for chorus and chorus FSE
                    return Promise.resolve({
                        categorie_juridique: [{ value: LEGAL_CATEGORIES_ACCEPTED[0] }],
                    } as Association);
                else
                    return Promise.resolve({
                        categorie_juridique: [{ value: "random categorie juridique" }],
                    } as Association);
            });
        });

        it("should save association but not companies' payments", async () => {
            const expected = NB_ASSOS_IN_FILES;
            const filePath = FILE_PATH;
            await controller.parse(filePath, EXPORT_DATE);
            const actual = await chorusAdapter.cursorFind().toArray();
            expect(actual.length).toEqual(expected);
        });

        // rerun above test twice
        it("should not save duplicates", async () => {
            const expected = NB_ASSOS_IN_FILES;
            await chorusAdapter.createIndexes();
            const filePath = FILE_PATH;
            await controller.parse(filePath, EXPORT_DATE);
            await controller.parse(filePath, EXPORT_DATE);
            const actual = (await chorusAdapter.cursorFind().toArray()).length;
            expect(actual).toEqual(expected);
        });

        it("should register new import", async () => {
            const filePath = FILE_PATH;
            await controller.parse(filePath, EXPORT_DATE);
            const actual = await dataLogAdapter.findAll();
            expect(actual?.[0]).toMatchObject({
                editionDate: new Date(EXPORT_DATE),
                fileName: "new-chorus-export.xlsx",
                integrationDate: expect.any(Date),
                providerId: "chorus",
            });
        });

        it("saves european chorus data", async () => {
            const filePath = FILE_PATH;
            await controller.parse(filePath, EXPORT_DATE);
            const actual = await toArray(chorusFseAdapter.getIterableFindAll());
            expect(actual.map(entity => ({ ...entity, updateDate: expect.any(Date) }))).toMatchSnapshot();
        });

        it("syncs payment flat with european data", async () => {
            const filePath = FILE_PATH;
            await controller.parse(filePath, EXPORT_DATE);
            const actual = await paymentFlatAdapter.findByProvider("chorus-fse");
            expect(actual.map(dbo => ({ ...dbo, updateDate: expect.any(Date) }))).toMatchSnapshot();
        });

        it("saves in paymentFlat", async () => {
            const filePath = FILE_PATH;
            await controller.parse(filePath, EXPORT_DATE);
            const payments = await paymentFlatAdapter.findByProvider("chorus");
            // snapshot only 2 payments when we got 3 chorus documents
            // it merges 2 payments sharing the same uniqueId
            expect(payments.map(payment => ({ ...payment, updateDate: expect.any(Date) }))).toMatchSnapshot();
        });
    });

    describe("resyncPaymentFlatByExercise", () => {
        it("add payments flat for exercice", async () => {
            await chorusAdapter.upsertMany(
                CHORUS_ENTITIES.map(entity => ({
                    ...entity,
                    exercice: 2025,
                })),
            );
            await chorusFseAdapter.upsertMany(CHORUS_FSE_ENTITIES.map(entity => ({ ...entity, budgetaryYear: 2025 })));

            await controller.resyncFlatByExercise(2025);
            const actual = await paymentFlatAdapter.findAll();
            expect(actual).toMatchSnapshot();
        });
    });

    describe("resetPaymentFlat", () => {
        it("add payments flat", async () => {
            await chorusAdapter.upsertMany([
                ...CHORUS_ENTITIES.map(entity => ({
                    ...entity,
                    exercice: 2024,
                })),
                ...CHORUS_ENTITIES.map(entity => ({
                    ...entity,
                    exercice: 2025,
                })),
            ]);
            await chorusFseAdapter.upsertMany(CHORUS_FSE_ENTITIES);
            await controller.resetFlat();
            const actual = await paymentFlatAdapter.findAll();
            expect(actual).toMatchSnapshot();
        });
    });
});
