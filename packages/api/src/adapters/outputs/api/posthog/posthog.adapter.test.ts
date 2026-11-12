import axios from "axios";
import { ObjectId } from "mongodb";
import { PosthogAdapter } from "./posthog.adapter";
import { AnonymizedWinstonLog } from "../../../../@types/WinstonLog";

jest.mock("../../../../configurations/posthog.conf", () => ({
    POSTHOG_API_KEY: "project-key",
    POSTHOG_HOST: "https://eu.i.posthog.com/",
}));

const USER_ID = new ObjectId();
const LOG = {
    _id: new ObjectId("507f1f77bcf86cd799439011"),
    timestamp: new Date("2026-10-01"),
    level: "info",
    message: "IP address and other private data",
    meta: {
        req: {
            userId: USER_ID,
            method: "GET",
            url: "/association/123?email=private@example.com",
            body: { email: "private@example.com" },
            headers: { authorization: "secret" },
        },
        res: { statusCode: 200 },
        responseTime: 42,
    },
} as AnonymizedWinstonLog;

describe("PosthogAdapter", () => {
    const adapter = new PosthogAdapter();

    it("preserves time and identity while only exporting selected properties", async () => {
        await adapter.sendLogs([LOG]);
        expect(axios.post).toHaveBeenCalledWith(
            "https://eu.i.posthog.com/batch/",
            {
                api_key: "project-key",
                historical_migration: true,
                batch: [
                    {
                        // Independently computed using Python's uuid.uuid5.
                        uuid: "bdc1d88d-48bd-58ab-aa16-cd6e1d54f44b",
                        event: "api_log",
                        timestamp: "2026-10-01T00:00:00.000Z",
                        properties: {
                            distinct_id: USER_ID.toString(),
                            $process_person_profile: false,
                            level: "info",
                            method: "GET",
                            url: "/association/123",
                            status_code: 200,
                            response_time: 42,
                        },
                    },
                ],
            },
            { timeout: 30000 },
        );
    });

    it("gives anonymous logs a stable identity without grouping all anonymous visitors", async () => {
        await adapter.sendLogs([{ ...LOG, meta: { ...LOG.meta, req: {} } }]);
        const event = jest.mocked(axios.post).mock.calls[0][1].batch[0];
        expect(event.properties.distinct_id).toBe(`anonymous:${event.uuid}`);
    });

    it("reports HTTP failures without exposing request credentials or log data", async () => {
        jest.mocked(axios.isAxiosError).mockReturnValueOnce(true);
        jest.mocked(axios.post).mockRejectedValueOnce({
            isAxiosError: true,
            response: { status: 503 },
            config: { data: { api_key: "project-key", batch: [LOG] } },
        });
        await expect(adapter.sendLogs([LOG])).rejects.toEqual(new Error("PostHog log export failed (HTTP 503)"));
    });
});
