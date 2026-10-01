import { NotificationType } from "../../../modules/notify/@types/NotificationType";
import { NotifyService } from "../../../modules/notify/notify.service";
import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";
import { NoSireneImportError } from "../pipeline/import/errors/no-sirene-import.error";
import { RnaCron } from "./rna.cron";

describe("Rna CRON", () => {
    const mockPipeline = { run: jest.fn() } as unknown as jest.Mocked<DownloadAndImport>;
    const mockNotifier = { notify: jest.fn() } as unknown as jest.Mocked<NotifyService>;

    const cron = new RnaCron(mockPipeline, mockNotifier) as unknown as RnaCron;

    describe("import", () => {
        beforeEach(() => {
            mockPipeline.run.mockImplementation().mockResolvedValue();
        });

        it("notify on NoSireneImport", async () => {
            try {
                await mockPipeline.run.mockImplementation().mockRejectedValue(new NoSireneImportError());
            } catch {
                expect(mockNotifier.notify).toHaveBeenCalledWith(NotificationType.CRON_BLOCKED, {
                    message: "Sirene must be updated before updating Rna",
                });
            }
        });

        it("notify on cron failure", async () => {
            try {
                await mockPipeline.run.mockImplementation().mockRejectedValue(new Error());
            } catch (e) {
                expect(mockNotifier.notify).toHaveBeenCalledWith(NotificationType.FAILED_CRON, {
                    cronName: cron.name,
                    error: e,
                });
            }
        });

        it("runs download and import pipeline", async () => {
            await cron.import();
            expect(mockPipeline.run).toHaveBeenCalled();
        });
    });
});
