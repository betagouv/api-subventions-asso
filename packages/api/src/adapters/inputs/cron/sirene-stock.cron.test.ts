import { NotificationType } from "../../../modules/notify/@types/NotificationType";
import { NotifyService } from "../../../modules/notify/notify.service";
import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";
import { SireneStockCron } from "./sirene-stock.cron";

describe("SireneStockCron", () => {
    const uniteLegalePipeline = { run: jest.fn() } as unknown as jest.Mocked<DownloadAndImport>;
    const establishmentPipeline = { run: jest.fn() } as unknown as jest.Mocked<DownloadAndImport>;
    const mockNotifier = { notify: jest.fn() } as unknown as jest.Mocked<NotifyService>;
    const createCron = () => new SireneStockCron(uniteLegalePipeline, establishmentPipeline, mockNotifier);

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
        it("notify on failure", async () => {
            const cron = createCron();
            try {
                await cron.importUnitesLegale();
            } catch (e) {
                expect(mockNotifier.notify).toHaveBeenCalledWith(NotificationType.FAILED_CRON, {
                    cronName: cron.name,
                    error: e,
                });
            }
        });

        it("runs the unite legale download pipeline", async () => {
            await createCron().importUnitesLegale();

            expect(uniteLegalePipeline.run).toHaveBeenCalledWith();
        });
    });

    describe("importEstablishments", () => {
        it("notify on failure", async () => {
            const cron = createCron();
            try {
                await cron.importEstablishments();
            } catch (e) {
                expect(mockNotifier.notify).toHaveBeenCalledWith(NotificationType.FAILED_CRON, {
                    cronName: cron.name,
                    error: e,
                });
            }
        });
        it("runs the establishment download pipeline", async () => {
            await createCron().importEstablishments();

            expect(establishmentPipeline.run).toHaveBeenCalledWith();
        });
    });
});
