import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";
import { SireneStockCron } from "./sirene-stock.cron";

describe("SireneStockCron", () => {
    const uniteLegalePipeline = { run: jest.fn() };
    const establishmentPipeline = { run: jest.fn() };

    const createCron = () =>
        new SireneStockCron(
            uniteLegalePipeline as unknown as DownloadAndImport,
            establishmentPipeline as unknown as DownloadAndImport,
        );

    describe("import", () => {
        it("imports unite legale then establishments", async () => {
            await createCron().import();

            expect({
                uniteLegaleCalls: uniteLegalePipeline.run.mock.calls,
                establishmentCalls: establishmentPipeline.run.mock.calls,
                ordered:
                    uniteLegalePipeline.run.mock.invocationCallOrder[0] <
                    establishmentPipeline.run.mock.invocationCallOrder[0],
            }).toEqual({
                uniteLegaleCalls: [[]],
                establishmentCalls: [[]],
                ordered: true,
            });
        });
    });

    describe("importUnitesLegale", () => {
        it("runs the unite legale download pipeline", async () => {
            await createCron().importUnitesLegale();

            expect(uniteLegalePipeline.run).toHaveBeenCalledWith();
        });
    });

    describe("importEstablishments", () => {
        it("runs the establishment download pipeline", async () => {
            await createCron().importEstablishments();

            expect(establishmentPipeline.run).toHaveBeenCalledWith();
        });
    });
});
