import { PublishLogs } from "./publish-logs";
import { AnonymizedWinstonLog } from "../../@types/WinstonLog";
import { ObjectId } from "mongodb";

jest.mock("../../modules/notify/notify.service", () => ({ notify: jest.fn() }));
jest.mock("../../adapters/outputs/api/posthog/posthog.adapter");
jest.mock("../../modules/configurations/configurations.service");
jest.mock("../../modules/stats/stats.service", () => ({
    iterateAnonymizedLogsOnPeriod: jest.fn(() => []),
}));
jest.mock("../../configurations/env.conf", () => ({
    ENV: "prod", // needed because else publishLogs does nothing
}));

describe("PublishLogs", () => {
    const posthogAdapter = { isConfigured: jest.fn(), sendLogs: jest.fn() };
    const configurationsService = {
        getLastPublishPosthogDate: jest.fn(),
        setLastPublishPosthogDate: jest.fn(),
    };
    const statsService = { iterateAnonymizedLogsOnPeriod: jest.fn() };
    const publishLogs = new PublishLogs(posthogAdapter, configurationsService, statsService);

    describe("execute", () => {
        const LOG = { _id: new ObjectId(), timestamp: new Date() } as AnonymizedWinstonLog;
        const LOGS = Array.from({ length: 201 }, () => LOG);
        const START = new Date("2026-01-01");
        const END = new Date("2026-01-08");

        beforeEach(() => {
            jest.useFakeTimers().setSystemTime(END);
            jest.mocked(posthogAdapter.isConfigured).mockReturnValue(true);
            jest.mocked(configurationsService.getLastPublishPosthogDate).mockResolvedValue(START);
            jest.mocked(statsService.iterateAnonymizedLogsOnPeriod).mockReturnValue(
                (async function* () {
                    yield* LOGS;
                })(),
            );
        });

        afterEach(() => {
            jest.restoreAllMocks();
            jest.useRealTimers();
        });

        it.each(["prod", "preprod"])("publishes logs in batches of 100 in %s", async env => {
            jest.replaceProperty(jest.requireMock("../../configurations/env.conf"), "ENV", env);
            await publishLogs.execute();
            expect(jest.mocked(posthogAdapter.sendLogs).mock.calls.map(([batch]) => batch.length)).toEqual([
                100, 100, 1,
            ]);
        });

        it("updates last publish date", async () => {
            await publishLogs.execute();
            expect(configurationsService.setLastPublishPosthogDate).toHaveBeenCalledWith(END);
        });

        it("does not update last publish date if a batch fails", async () => {
            jest.mocked(posthogAdapter.sendLogs)
                .mockResolvedValueOnce()
                .mockRejectedValueOnce(new Error("unavailable"));
            await publishLogs.execute().catch(() => undefined);
            expect(configurationsService.setLastPublishPosthogDate).not.toHaveBeenCalled();
        });

        it("does not publish logs if PostHog is not configured", async () => {
            jest.mocked(posthogAdapter.isConfigured).mockReturnValue(false);
            await publishLogs.execute();
            expect(statsService.iterateAnonymizedLogsOnPeriod).not.toHaveBeenCalled();
        });
    });
});
