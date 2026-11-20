import axios from "axios";
import { v5 as uuidv5 } from "uuid";
import { AnonymizedWinstonLog } from "../../../../@types/WinstonLog";
import { POSTHOG_API_KEY, POSTHOG_HOST } from "../../../../configurations/posthog.conf";

// Changing this namespace changes the UUID (v5) of every log
const LOG_NAMESPACE = "899c6eb8-05fb-49fb-a976-550d466f00d1";

export class PosthogAdapter {
    isConfigured(): boolean {
        return Boolean(POSTHOG_API_KEY && POSTHOG_HOST);
    }

    async sendLogs(logs: AnonymizedWinstonLog[]): Promise<void> {
        if (!logs.length) return;
        if (!POSTHOG_API_KEY || !POSTHOG_HOST) throw new Error("PostHog log export is not configured");

        const batch = logs.map(log => {
            const uuid = uuidv5(log._id.toString(), LOG_NAMESPACE);
            const req = log.meta?.req;
            return {
                uuid,
                event: "api_log",
                timestamp: log.timestamp.toISOString(),
                properties: {
                    distinct_id: req?.userId || `anonymous:${uuid}`,
                    $process_person_profile: false,
                    level: log.level,
                    method: req?.method,
                    url: req?.url?.split(/[?#]/)[0],
                    status_code: log.meta?.res?.statusCode,
                    response_time: log.meta?.responseTime,
                },
            };
        });
        try {
            await axios.post(
                `${POSTHOG_HOST.replace(/\/+$/, "")}/batch/`,
                { api_key: POSTHOG_API_KEY, historical_migration: true, batch },
                { timeout: 30000 },
            );
        } catch (error) {
            const status = axios.isAxiosError(error) ? error.response?.status : undefined;
            throw new Error(`PostHog log export failed${status ? ` (HTTP ${status})` : ""}`);
        }
    }
}

export default new PosthogAdapter();
