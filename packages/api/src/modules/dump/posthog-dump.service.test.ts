import { PosthogDumpService } from "./posthog-dump.service";
import posthogAdapter from "../../adapters/outputs/api/posthog/posthog.adapter";
import configurationsService from "../configurations/configurations.service";
import statsService from "../stats/stats.service";
import { AnonymizedWinstonLog } from "../../@types/WinstonLog";
import { ObjectId } from "mongodb";

jest.mock("../../modules/notify/notify.service", () => ({ notify: jest.fn() }));
jest.mock("../../adapters/outputs/api/posthog/posthog.adapter");
jest.mock("../configurations/configurations.service");
jest.mock("../stats/stats.service", () => ({
    iterateAnonymizedLogsOnPeriod: jest.fn(() => []),
}));
jest.mock("../../configurations/env.conf", () => ({
    ENV: "prod", // needed because else publishLogs does nothing
}));

describe("posthogDumpService", () => {
    let posthogDumpService: PosthogDumpService;

    beforeEach(() => {
        posthogDumpService = new PosthogDumpService();
    });

    describe("publishLogs", () => {
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
            await posthogDumpService.publishLogs();
            expect(jest.mocked(posthogAdapter.sendLogs).mock.calls.map(([batch]) => batch.length)).toEqual([
                100, 100, 1,
            ]);
        });

        it("updates last publish date", async () => {
            await posthogDumpService.publishLogs();
            expect(configurationsService.setLastPublishPosthogDate).toHaveBeenCalledWith(END);
        });

        it("does not update last publish date if a batch fails", async () => {
            jest.mocked(posthogAdapter.sendLogs)
                .mockResolvedValueOnce()
                .mockRejectedValueOnce(new Error("unavailable"));
            await posthogDumpService.publishLogs().catch(() => undefined);
            expect(configurationsService.setLastPublishPosthogDate).not.toHaveBeenCalled();
        });

        it("does not publish logs if PostHog is not configured", async () => {
            jest.mocked(posthogAdapter.isConfigured).mockReturnValue(false);
            await posthogDumpService.publishLogs();
            expect(statsService.iterateAnonymizedLogsOnPeriod).not.toHaveBeenCalled();
        });
    });
});
