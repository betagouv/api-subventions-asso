import ChorusCli from "../../../src/interfaces/cli/Chorus.cli";
import path from "path";
import chorusAdapter from "../../../src/dataProviders/db/providers/chorus/chorus.adapter";
import paymentFlatAdapter from "../../../src/dataProviders/db/paymentFlat/paymentFlat.adapter";
import uniteLegalEntrepriseAdapter from "../../../src/dataProviders/db/uniteLegalEntreprise/uniteLegalEntreprise.adapter";
import sireneUniteLegaleDbAdapter from "../../../src/dataProviders/db/sirene/stockUniteLegale/sireneStockUniteLegale.adapter";
import { SireneStockUniteLegaleEntity } from "../../../src/entities/SireneStockUniteLegaleEntity";
import apiAssoService from "../../../src/modules/providers/apiAsso/apiAsso.service";
import { Association } from "dto";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../src/shared/LegalCategoriesAccepted";
import Siren from "../../../src/identifierObjects/Siren";
import chorusService from "../../../src/modules/providers/chorus/chorus.service";
import stateBudgetProgramAdapter from "../../../src/dataProviders/db/state-budget-program/stateBudgetProgram.adapter";
import PROGRAMS from "../../dataProviders/db/__fixtures__/stateBudgetProgram";
import chorusFseAdapter from "../../../src/dataProviders/db/providers/chorus/chorus.fse.adapter";
import dataLogAdapter from "../../../src/dataProviders/db/data-log/data-log.adapter";
import { CHORUS_ENTITIES } from "../../../src/modules/providers/chorus/__fixtures__/ChorusFixtures";

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
            console.log(actual);

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
            const actual = await chorusFseAdapter.findAll();
            expect(actual).toMatchSnapshot();
        });

        it("saves in paymentFlat", async () => {
            await chorusAdapter.createIndexes();
            const filePath = FILE_PATH;
            await controller.parse(filePath, EXPORT_DATE);
            const payments = await paymentFlatAdapter.findAll();
            // snapshot only 2 payments when we got 3 chorus documents
            // it merges 2 payments sharing the same uniqueId
            expect(payments.map(payment => ({ ...payment, updateDate: expect.any(Date) }))).toMatchSnapshot();
        });
    });

    describe("resyncPaymentFlatByExercise", () => {
        it("add payments flat for exercice", async () => {
            await chorusService.upsertMany(
                CHORUS_ENTITIES.map(entity => ({
                    ...entity,
                    exercice: 2025,
                })),
            );
            await controller.resyncPaymentFlatByExercise(2025);
            const actual = await paymentFlatAdapter.findAll();
            expect(actual).toMatchSnapshot();
        });
    });

    describe("resetPaymentFlat", () => {
        it("add payments flat", async () => {
            await chorusService.upsertMany([
                ...CHORUS_ENTITIES.map(entity => ({
                    ...entity,
                    exercice: 2024,
                })),
                ...CHORUS_ENTITIES.map(entity => ({
                    ...entity,
                    exercice: 2025,
                })),
            ]);

            await controller.resetPaymentFlat();
            const actual = await paymentFlatAdapter.findAll();
            expect(actual).toMatchSnapshot();
        });
    });
});
