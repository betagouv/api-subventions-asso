import axios from "axios";
import { createHash } from "node:crypto";
import { AnonymizedWinstonLog } from "../../../../@types/WinstonLog";
import { POSTHOG_API_KEY, POSTHOG_HOST } from "../../../../configurations/posthog.conf";

// Changing this namespace changes the UUID (v5) of every log
const LOG_NAMESPACE = Buffer.from("899c6eb805fb49fba976550d466f00d1", "hex");

export class PosthogAdapter {
    isConfigured(): boolean {
        return Boolean(POSTHOG_API_KEY && POSTHOG_HOST);
    }

    private getLogUuidV5(logId: string): string {
        const bytes = createHash("sha1").update(LOG_NAMESPACE).update(logId).digest().subarray(0, 16);

        bytes[6] = (bytes[6] & 0x0f) | 0x50;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;

        const hex = bytes.toString("hex");
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }

    async sendLogs(logs: AnonymizedWinstonLog[]): Promise<void> {
        if (!logs.length) return;
        if (!POSTHOG_API_KEY || !POSTHOG_HOST) throw new Error("PostHog log export is not configured");

        const batch = logs.map(log => {
            const uuid = this.getLogUuidV5(log._id.toString());
            const req = log.meta?.req;
            return {
                uuid,
                event: "api_log",
                timestamp: log.timestamp.toISOString(),
                properties: {
                    distinct_id: req?.userId?.toString() || `anonymous:${uuid}`,
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
