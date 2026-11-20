import AsyncUseCase from "../../@types/use-case/AsyncUseCase";
import { ENV } from "../../configurations/env.conf";
import { AnonymizedWinstonLog } from "../../@types/WinstonLog";
import posthogAdapter from "../../adapters/outputs/api/posthog/posthog.adapter";
import configurationsService from "../../modules/configurations/configurations.service";
import statsService from "../../modules/stats/stats.service";

const BATCH_SIZE = 100;

export class PublishLogs implements AsyncUseCase<void, void> {
    async execute(): Promise<void> {
        if ((ENV !== "prod" && ENV !== "preprod") || !posthogAdapter.isConfigured()) return;

        const start = await configurationsService.getLastPublishPosthogDate();
        const end = new Date();
        let batch: AnonymizedWinstonLog[] = [];

        for await (const log of statsService.iterateAnonymizedLogsOnPeriod(start, end)) {
            batch.push(log);

            if (batch.length >= BATCH_SIZE) {
                await posthogAdapter.sendLogs(batch);
                batch = [];
            }
        }

        if (batch.length) await posthogAdapter.sendLogs(batch);

        await configurationsService.setLastPublishPosthogDate(end);
    }
}

export default new PublishLogs();
