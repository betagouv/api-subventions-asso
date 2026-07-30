import { DataLogAdapter } from "../../../../outputs/db/data-log/data-log.adapter";
import { SIRENE_ESTABLISHMENT_DTO } from "./sirene-establishment.fixture";
import { SireneEstablishmentPipeline } from "./sirene-establishment.pipeline";

describe("SireneEstablishmentPipeline", () => {
    const parser = { parse: jest.fn() };
    const establishmentPort = { upsertMany: jest.fn() };
    const sireneUniteLegale = { filterExistingSirens: jest.fn() };
    const dataLog = { getLastEditionDateByProvider: jest.fn() } as unknown as DataLogAdapter;

    beforeEach(() => {
        jest.clearAllMocks();
        parser.parse.mockImplementation(async (_filePath, onBatch) => onBatch([SIRENE_ESTABLISHMENT_DTO]));
        establishmentPort.upsertMany.mockResolvedValue(1);
        sireneUniteLegale.filterExistingSirens.mockResolvedValue([SIRENE_ESTABLISHMENT_DTO.siren]);
        jest.mocked(dataLog.getLastEditionDateByProvider).mockResolvedValue(null);
    });

    it("filters establishments with existing association sirens", async () => {
        await new SireneEstablishmentPipeline(
            parser as never,
            establishmentPort as never,
            sireneUniteLegale as never,
            dataLog,
        ).run("file.parquet");
        expect(establishmentPort.upsertMany).toHaveBeenCalledWith([SIRENE_ESTABLISHMENT_DTO]);
    });

    it("filters establishments older than previous import edition date", async () => {
        jest.mocked(dataLog.getLastEditionDateByProvider).mockResolvedValueOnce(new Date("2026-07-09"));
        await new SireneEstablishmentPipeline(
            parser as never,
            establishmentPort as never,
            sireneUniteLegale as never,
            dataLog,
        ).run("file.parquet");
        expect(establishmentPort.upsertMany).toHaveBeenCalledWith([]);
    });

    it("returns import report", async () => {
        const actual = await new SireneEstablishmentPipeline(
            parser as never,
            establishmentPort as never,
            sireneUniteLegale as never,
            dataLog,
        ).run("file.parquet");
        expect(actual).toEqual({ parsedCount: 1, importedCount: 1, errorCount: 0 });
    });
});
