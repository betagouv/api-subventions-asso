import sireneEtablissementService from "../../../modules/providers/sirene/sirene-etablissement.service";
import sireneStockEtablissementFileService from "../../../modules/providers/sirene/sirene-stock-etablissement.service";
import SireneStockEtablissementCli from "./sirene-stock-etablissement.cli";

jest.mock("../../../modules/providers/sirene/sirene-etablissement.service", () => ({
    __esModule: true,
    default: {
        parse: jest.fn(),
    },
}));

jest.mock("../../../modules/providers/sirene/sirene-stock-etablissement.service", () => ({
    __esModule: true,
    default: {
        getAndParse: jest.fn(),
    },
}));

describe("SireneStockEtablissementCli", () => {
    describe("import", () => {
        it("calls service import without file path", async () => {
            await new SireneStockEtablissementCli().import();
            expect(sireneStockEtablissementFileService.getAndParse).toHaveBeenCalled();
        });

        it("parses local file when file path is provided", async () => {
            await new SireneStockEtablissementCli().import("file.parquet");
            expect(sireneEtablissementService.parse).toHaveBeenCalledWith("file.parquet");
        });
    });
});
