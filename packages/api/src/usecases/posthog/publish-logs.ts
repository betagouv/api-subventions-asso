import AsyncUseCase from "../../@types/use-case/AsyncUseCase";
import { ENV } from "../../configurations/env.conf";
import { AnonymizedWinstonLog } from "../../@types/WinstonLog";
import posthogAdapter, { type PosthogAdapter } from "../../adapters/outputs/api/posthog/posthog.adapter";
import configurationsService, { type ConfigurationsService } from "../../modules/configurations/configurations.service";
import statsService from "../../modules/stats/stats.service";

const BATCH_SIZE = 100;

export class PublishLogs implements AsyncUseCase<void, void> {
    constructor(
        private posthogAdapter: Pick<PosthogAdapter, "isConfigured" | "sendLogs">,
        private configurationsService: Pick<
            ConfigurationsService,
            "getLastPublishPosthogDate" | "setLastPublishPosthogDate"
        >,
        private stats: Pick<typeof statsService, "iterateAnonymizedLogsOnPeriod">,
    ) {}

    async execute(): Promise<void> {
        if ((ENV !== "prod" && ENV !== "preprod") || !this.posthogAdapter.isConfigured()) return;

        const start = await this.configurationsService.getLastPublishPosthogDate();
        const end = new Date();
        let batch: AnonymizedWinstonLog[] = [];

        for await (const log of this.stats.iterateAnonymizedLogsOnPeriod(start, end)) {
            batch.push(log);

            if (batch.length >= BATCH_SIZE) {
                await this.posthogAdapter.sendLogs(batch);
                batch = [];
            }
        }

        if (batch.length) await this.posthogAdapter.sendLogs(batch);

        await this.configurationsService.setLastPublishPosthogDate(end);
    }
}

export default new PublishLogs(posthogAdapter, configurationsService, statsService);
