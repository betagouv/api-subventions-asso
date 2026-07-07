import Siret from "../../../identifier-objects/Siret";
import { SIRENE_ETABLISSEMENT_ENTITY } from "./__fixtures__/sirene-etablissement.fixture";
import sireneEtablissementAdapter from "../../../adapters/outputs/db/sirene/sirene-etablissement.adapter";
import SireneStockEtablissementParser from "./parser/sirene-stock-etablissement.parser";
import sireneEtablissementService from "./sirene-etablissement.service";
import sireneUniteLegaleService from "./sirene-unite-legale.service";

jest.mock("../../../adapters/outputs/db/sirene/sirene-etablissement.adapter");
jest.mock("./parser/sirene-stock-etablissement.parser", () => ({
    __esModule: true,
    default: {
        parseParquetAndInsert: jest.fn(),
    },
}));
jest.mock("./sirene-unite-legale.service");

describe("SireneEtablissementService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(sireneUniteLegaleService.findAll).mockResolvedValue([{}]);
    });

    describe("parse", () => {
        it("calls parser", async () => {
            await sireneEtablissementService.parse("file.parquet");
            expect(SireneStockEtablissementParser.parseParquetAndInsert).toHaveBeenCalledWith(
                "file.parquet",
                expect.any(Function),
                expect.any(Function),
            );
        });

        it("throws when sirene collection is empty", async () => {
            jest.mocked(sireneUniteLegaleService.findAll).mockResolvedValueOnce([]);
            await expect(sireneEtablissementService.parse("file.parquet")).rejects.toThrow(
                "Sirene unite legale collection must be imported before sirene etablissements",
            );
        });

        it("does not call parser when sirene collection is empty", async () => {
            jest.mocked(sireneUniteLegaleService.findAll).mockResolvedValueOnce([]);
            await sireneEtablissementService.parse("file.parquet").catch(() => undefined);
            expect(SireneStockEtablissementParser.parseParquetAndInsert).not.toHaveBeenCalled();
        });
    });

    describe("_saveBatchData", () => {
        it("calls upsertMany", async () => {
            await sireneEtablissementService._saveBatchData([SIRENE_ETABLISSEMENT_ENTITY]);
            expect(sireneEtablissementAdapter.upsertMany).toHaveBeenCalledWith([SIRENE_ETABLISSEMENT_ENTITY]);
        });
    });

    describe("_findExistingAssociationSirens", () => {
        it("calls sirene service", async () => {
            await sireneEtablissementService._findExistingAssociationSirens(["123456789"]);
            expect(sireneUniteLegaleService.findSirens).toHaveBeenCalledWith(["123456789"]);
        });
    });

    describe("findOneBySiret", () => {
        it("calls adapter", async () => {
            const siret = new Siret("12345678900012");
            await sireneEtablissementService.findOneBySiret(siret);
            expect(sireneEtablissementAdapter.findOneBySiret).toHaveBeenCalledWith(siret);
        });
    });
});
