import ChorusCli from "../../../src/interfaces/cli/Chorus.cli";
import path from "path";
import chorusLinePort from "../../../src/dataProviders/db/providers/chorus/chorus.line.port";
import dataLogPort from "../../../src/dataProviders/db/data-log/dataLog.port";
import paymentFlatPort from "../../../src/dataProviders/db/paymentFlat/paymentFlat.port";
import uniteLegalEntreprisePort from "../../../src/dataProviders/db/uniteLegalEntreprise/uniteLegalEntreprise.port";
import { UniteLegalEntrepriseEntity } from "../../../src/entities/UniteLegalEntrepriseEntity";
import sireneUniteLegaleDbPort from "../../../src/dataProviders/db/sirene/stockUniteLegale/sireneStockUniteLegale.port";
import { SireneStockUniteLegaleEntity } from "../../../src/entities/SireneStockUniteLegaleEntity";
import apiAssoService from "../../../src/modules/providers/apiAsso/apiAsso.service";
import { Association } from "dto";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../src/shared/LegalCategoriesAccepted";
import Siren from "../../../src/identifierObjects/Siren";
import chorusService from "../../../src/modules/providers/chorus/chorus.service";
import { ENTITIES } from "../../../src/modules/providers/chorus/__fixtures__/ChorusFixtures";
import stateBudgetProgramPort from "../../../src/dataProviders/db/state-budget-program/stateBudgetProgram.port";
import PROGRAMS from "../../dataProviders/db/__fixtures__/stateBudgetProgram";

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
            stateBudgetProgramPort.replace(PROGRAMS),
            // make siren 325346542 belong to asso
            sireneUniteLegaleDbPort.insertOne({ siren: new Siren("325346542") } as SireneStockUniteLegaleEntity),
            // make siren 094130101 belong to an entreprise
            uniteLegalEntreprisePort.insertMany([new UniteLegalEntrepriseEntity(new Siren("094130101"))]),
        ]);
    });

    describe("_parse()", () => {
        beforeAll(async () => {
            jest.spyOn(apiAssoService, "findAssociationBySiren").mockImplementation((siren: Siren) => {
                if (siren.value === "775685779")
                    return Promise.resolve({
                        categorie_juridique: [{ value: LEGAL_CATEGORIES_ACCEPTED[0] }],
                    } as Association);
                else
                    return Promise.resolve({
                        categorie_juridique: [{ value: "random categorie juridique" }],
                    } as Association);
            });
        });

        // file should have 6 associations and 1 company's payments
        it("should save association but not companies' payments", async () => {
            const expected = NB_ASSOS_IN_FILES;
            const filePath = FILE_PATH;
            await controller.parse(filePath, EXPORT_DATE);
            const actual = (await chorusLinePort.cursorFind().toArray()).length;
            expect(actual).toEqual(expected);
        });

        // rerun above test twice
        it("should not save duplicates", async () => {
            const expected = NB_ASSOS_IN_FILES;
            await chorusLinePort.createIndexes();
            const filePath = FILE_PATH;
            await controller.parse(filePath, EXPORT_DATE);
            await controller.parse(filePath, EXPORT_DATE);
            const actual = (await chorusLinePort.cursorFind().toArray()).length;
            expect(actual).toEqual(expected);
        });

        it("should register new import", async () => {
            const filePath = FILE_PATH;
            await controller.parse(filePath, EXPORT_DATE);
            const actual = await dataLogPort.findAll();
            expect(actual?.[0]).toMatchObject({
                editionDate: new Date(EXPORT_DATE),
                fileName: "new-chorus-export.xlsx",
                integrationDate: expect.any(Date),
                providerId: "chorus",
            });
        });

        it("saves in paymentFlat", async () => {
            await chorusLinePort.createIndexes();
            const filePath = FILE_PATH;
            await controller.parse(filePath, EXPORT_DATE);
            const payments = await paymentFlatPort.findAll();
            // snapshot only 2 payments when we got 3 chorus documents
            // it merges 2 payments sharing the same uniqueId
            expect(payments.map(payment => ({ ...payment, updateDate: expect.any(Date) }))).toMatchSnapshot();
        });
    });

    describe("resyncPaymentFlatByExercise", () => {
        it("add payments flat for exercice", async () => {
            await chorusService.upsertMany(
                ENTITIES.map(entity => ({
                    ...entity,
                    indexedInformations: { ...entity.indexedInformations, exercice: 2025 },
                })),
            );
            await controller.resyncPaymentFlatByExercise(2025);
            const actual = await paymentFlatPort.findAll();
            expect(actual).toMatchSnapshot();
        });
    });

    describe("resetPaymentFlat", () => {
        it("add payments flat", async () => {
            await chorusService.upsertMany([
                ...ENTITIES.map(entity => ({
                    ...entity,
                    indexedInformations: { ...entity.indexedInformations, exercice: 2024 },
                })),
                ...ENTITIES.map(entity => ({
                    ...entity,
                    indexedInformations: { ...entity.indexedInformations, exercice: 2025 },
                })),
            ]);

            await controller.resetPaymentFlat();
            const actual = await paymentFlatPort.findAll();
            expect(actual).toMatchSnapshot();
        });
    });
});
