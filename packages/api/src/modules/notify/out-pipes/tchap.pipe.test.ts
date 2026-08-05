import { MatrixClient } from "matrix-bot-sdk";
import { NotificationType } from "../@types/NotificationType";
import { TchapPipe } from "./tchap.pipe";

const mockSendHtmlText = jest.fn();

jest.mock("matrix-bot-sdk", () => ({
    MatrixClient: jest.fn().mockImplementation(() => ({
        sendHtmlText: mockSendHtmlText,
    })),
}));
jest.mock("../../../configurations/env.conf", () => ({ ENV: "test" }));

const HOMESERVER_URL = "https://tchap.example.test";
const ACCESS_TOKEN = "access-token";
const ROOM_ID_ACCOUNTS = "!accounts-room:tchap.example.test";
const ROOM_ID_PRODUCT = "!product-room:tchap.example.test";
const ROOM_ID_DEV = "!dev-room:tchap.example.test";

describe("TchapPipe", () => {
    let notifyPipe: TchapPipe;
    const USER_DELETED_PAYLOAD = {
        email: "email",
        firstname: "Prénom",
        lastname: "NOM",
    };

    beforeEach(() => {
        process.env.TCHAP_HOMESERVER_URL = HOMESERVER_URL;
        process.env.TCHAP_ACCESS_TOKEN = ACCESS_TOKEN;
        process.env.TCHAP_ROOM_ID_ACCOUNTS = ROOM_ID_ACCOUNTS;
        process.env.TCHAP_ROOM_ID_PRODUCT = ROOM_ID_PRODUCT;
        process.env.TCHAP_ROOM_ID_DEV = ROOM_ID_DEV;

        jest.clearAllMocks();
        mockSendHtmlText.mockResolvedValue("event-id");
        notifyPipe = new TchapPipe();
    });

    afterEach(() => {
        delete process.env.TCHAP_HOMESERVER_URL;
        delete process.env.TCHAP_ACCESS_TOKEN;
        delete process.env.TCHAP_ROOM_ID_ACCOUNTS;
        delete process.env.TCHAP_ROOM_ID_PRODUCT;
        delete process.env.TCHAP_ROOM_ID_DEV;
        jest.restoreAllMocks();
    });

    describe("notify", () => {
        it("calls userDeleted if called with this type", async () => {
            // @ts-expect-error -- private method
            const userDeletedSpy = jest.spyOn(notifyPipe, "userDeleted").mockResolvedValueOnce(true);
            await notifyPipe.notify(NotificationType.USER_DELETED, USER_DELETED_PAYLOAD);
            expect(userDeletedSpy).toHaveBeenCalledWith(USER_DELETED_PAYLOAD);
        });

        it("resolves to false in other cases", async () => {
            const expected = false;
            const actual = await notifyPipe.notify(NotificationType.USER_CREATED, USER_DELETED_PAYLOAD);
            expect(actual).toBe(expected);
        });
    });

    describe("sendMessage", () => {
        it("creates a Matrix client with Tchap env variables", async () => {
            // @ts-expect-error -- private method
            await notifyPipe.sendMessage("accounts", "Title", "✅", "message");
            expect(MatrixClient).toHaveBeenCalledWith(HOMESERVER_URL, ACCESS_TOKEN);
        });

        it("calls sendHtmlText with room id and html text", async () => {
            // @ts-expect-error -- private method
            await notifyPipe.sendMessage("accounts", "Title", "✅", "message");
            const actual = mockSendHtmlText.mock.calls[0];
            expect(actual).toMatchInlineSnapshot(`
                [
                  "!accounts-room:tchap.example.test",
                  "[test] ✅ <strong>Title</strong><br><br>message",
                ]
            `);
        });

        it("returns true if sendHtmlText succeeds", async () => {
            const expected = true;
            // @ts-expect-error -- private method
            const actual = await notifyPipe.sendMessage("accounts", "Title", "✅", "message");
            expect(actual).toBe(expected);
        });

        it("returns false if error in sendHtmlText", async () => {
            jest.spyOn(console, "error").mockImplementation(() => undefined);
            mockSendHtmlText.mockRejectedValueOnce("error");
            const expected = false;
            // @ts-expect-error -- private method
            const actual = await notifyPipe.sendMessage("accounts", "Title", "✅", "message");
            expect(actual).toBe(expected);
        });

        it("returns false when credentials are missing", async () => {
            delete process.env.TCHAP_HOMESERVER_URL;
            delete process.env.TCHAP_ACCESS_TOKEN;
            jest.spyOn(console, "warn").mockImplementation(() => undefined);
            const expected = false;
            // @ts-expect-error -- private method
            const actual = await notifyPipe.sendMessage("accounts", "Title", "✅", "message");
            expect(actual).toBe(expected);
        });

        it("does not create Matrix client when credentials are missing", async () => {
            delete process.env.TCHAP_ACCESS_TOKEN;
            jest.spyOn(console, "warn").mockImplementation(() => undefined);
            jest.clearAllMocks();
            // @ts-expect-error -- private method
            await notifyPipe.sendMessage("accounts", "Title", "✅", "message");
            expect(MatrixClient).not.toHaveBeenCalled();
        });

        it("warns when credentials are missing", async () => {
            delete process.env.TCHAP_HOMESERVER_URL;
            delete process.env.TCHAP_ACCESS_TOKEN;
            const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
            // @ts-expect-error -- private method
            await notifyPipe.sendMessage("accounts", "Title", "✅", "message");
            expect(consoleSpy).toHaveBeenCalledWith("Missing Tchap environment configuration");
        });

        it("returns false when room id is missing", async () => {
            delete process.env.TCHAP_ROOM_ID_PRODUCT;
            jest.spyOn(console, "warn").mockImplementation(() => undefined);
            const expected = false;
            // @ts-expect-error -- private method
            const actual = await notifyPipe.sendMessage("product", "Title", "✅", "message");
            expect(actual).toBe(expected);
        });

        it("does not send message when room id is missing", async () => {
            delete process.env.TCHAP_ROOM_ID_PRODUCT;
            jest.spyOn(console, "warn").mockImplementation(() => undefined);
            // @ts-expect-error -- private method
            await notifyPipe.sendMessage("product", "Title", "✅", "message");
            expect(mockSendHtmlText).not.toHaveBeenCalled();
        });
    });

    describe("userDeleted", () => {
        it("sends message with proper payload with false selfDeleted", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.userDeleted(USER_DELETED_PAYLOAD);
            const actual = sendMessageSpy.mock.calls[0];
            expect(actual).toMatchSnapshot();
        });

        it("sends message with proper payload with truthy selfDeleted", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.userDeleted({ ...USER_DELETED_PAYLOAD, selfDeleted: true });
            const actual = sendMessageSpy.mock.calls[0];
            expect(actual).toMatchSnapshot();
        });
    });

    describe("badEmailDomain", () => {
        it("sends message with proper payload", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.badEmailDomain({ email: "some@email.fr" });
            const actual = sendMessageSpy.mock.calls[0];
            expect(actual).toMatchSnapshot();
        });
    });

    describe("batchUsersDeleted", () => {
        it("sends message with proper payload", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.batchUsersDeleted({
                users: [
                    { email: "some@email.fr", firstname: "Prénom" },
                    { email: "some-other@email.fr", lastname: "Nom" },
                ],
            });
            const actual = sendMessageSpy.mock.calls[0];
            expect(actual).toMatchSnapshot();
        });
    });

    describe("depositUnfinished", () => {
        it("sends message with proper payload", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.depositUnfinished({
                users: [
                    { email: "some@email.fr", firstname: "John", lastname: "Doe" },
                    {
                        email: "griffin@email.fr",
                        firstname: "Petter",
                        lastname: "Griffin",
                    },
                ],
            });
            const actual = sendMessageSpy.mock.calls[0];
            expect(actual).toMatchSnapshot();
        });
    });

    describe("dataImportSuccess", () => {
        it("sends message for single file", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportSuccess({
                providerName: "Ville de Rennes",
                providerSiret: "12345678900012",
                exportDate: new Date("2025-09-03"),
                details: {
                    fileName: "SCDL.csv",
                    fileCount: 1,
                    parsedCount: 100,
                    importedCount: 99,
                    errorCount: 1,
                    durationMs: 1234,
                },
            });
            const actual = sendMessageSpy.mock.calls[0];
            expect(actual).toMatchSnapshot();
        });

        it("shows batch label when fileCount > 1", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportSuccess({
                providerName: "Helios",
                details: {
                    fileName: "helios-data",
                    fileCount: 4,
                    parsedCount: 400,
                    importedCount: 380,
                    errorCount: 20,
                    durationMs: 5000,
                },
            });
            const actual = sendMessageSpy.mock.calls[0][3];
            expect(actual).toContain("<strong>Batch</strong> : <code>helios-data</code> (4 fichiers)");
        });

        it("shows exerciseYear when provided", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportSuccess({
                providerName: "Osiris",
                details: {
                    fileName: "SuiviDossiers",
                    fileCount: 1,
                    parsedCount: 247931,
                    importedCount: 122892,
                    errorCount: 125039,
                    durationMs: 60000,
                    exerciseYear: 2023,
                },
            });
            const actual = sendMessageSpy.mock.calls[0];
            expect(actual).toMatchSnapshot();
        });

        it("shows imported count with percentage", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportSuccess({
                providerName: "Osiris",
                details: {
                    fileName: "SuiviDossiers",
                    fileCount: 1,
                    parsedCount: 247931,
                    importedCount: 122892,
                    errorCount: 125039,
                    durationMs: 60000,
                },
            });
            const actual = sendMessageSpy.mock.calls[0][3];
            expect(actual).toContain("<li>Données importées : 122892 (49.57%)</li>");
        });

        it("shows error count with percentage", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportSuccess({
                providerName: "Osiris",
                details: {
                    fileName: "SuiviDossiers",
                    fileCount: 1,
                    parsedCount: 247931,
                    importedCount: 122892,
                    errorCount: 125039,
                    durationMs: 60000,
                },
            });
            const actual = sendMessageSpy.mock.calls[0][3];
            expect(actual).toContain("<li>Erreurs : 125039 (50.43%)</li>");
        });

        it("does not show percentages when parsedCount is 0", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportSuccess({
                providerName: "Osiris",
                details: {
                    fileName: "SuiviDossiers",
                    fileCount: 1,
                    parsedCount: 0,
                    importedCount: 0,
                    errorCount: 0,
                    durationMs: 1000,
                },
            });
            const actual = sendMessageSpy.mock.calls[0][3];
            expect(actual).not.toContain("%");
        });
    });

    describe("dataImportFailure", () => {
        it("sends failure message", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportFailure({
                providerName: "Chorus",
                exportDate: new Date("2025-09-03"),
                error: "File could not be parsed",
                details: { fileName: "chorus-data.csv", durationMs: 3500 },
            });
            const actual = sendMessageSpy.mock.calls[0];
            expect(actual).toMatchSnapshot();
        });

        it("sends failure message without export date", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportFailure({
                providerName: "Chorus",
                error: "File could not be parsed",
                details: { fileName: "chorus-data.csv", durationMs: 3500 },
            });
            const actual = sendMessageSpy.mock.calls[0][3];
            expect(actual).not.toContain("export du");
        });

        it("sends failure message with all details fields", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportFailure({
                providerName: "Osiris",
                exportDate: new Date("2025-09-03"),
                error: "Parse error on line 42",
                details: {
                    fileName: "SuiviDossiers.csv",
                    exerciseYear: 2023,
                    durationMs: 5000,
                    fileCount: 2,
                    parsedCount: 100,
                    importedCount: 80,
                    errorCount: 20,
                },
            });
            const actual = sendMessageSpy.mock.calls[0];
            expect(actual).toMatchSnapshot();
        });

        it("shows counts partiels header when partial counts are provided", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportFailure({
                providerName: "Chorus",
                error: "partial failure",
                details: {
                    fileName: "chorus-data.csv",
                    durationMs: 3500,
                    parsedCount: 50,
                    importedCount: 30,
                    errorCount: 20,
                },
            });
            const actual = sendMessageSpy.mock.calls[0][3];
            expect(actual).toContain("<strong>Counts partiels</strong>");
        });

        it("shows parsed count in counts partiels section", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportFailure({
                providerName: "Chorus",
                error: "partial failure",
                details: {
                    fileName: "chorus-data.csv",
                    durationMs: 3500,
                    parsedCount: 50,
                    importedCount: 30,
                    errorCount: 20,
                },
            });
            const actual = sendMessageSpy.mock.calls[0][3];
            expect(actual).toContain("<li>Lignes parsées : 50</li>");
        });

        it("shows imported count in counts partiels section", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportFailure({
                providerName: "Chorus",
                error: "partial failure",
                details: {
                    fileName: "chorus-data.csv",
                    durationMs: 3500,
                    parsedCount: 50,
                    importedCount: 30,
                    errorCount: 20,
                },
            });
            const actual = sendMessageSpy.mock.calls[0][3];
            expect(actual).toContain("<li>Données importées : 30</li>");
        });

        it("shows error count in counts partiels section", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportFailure({
                providerName: "Chorus",
                error: "partial failure",
                details: {
                    fileName: "chorus-data.csv",
                    durationMs: 3500,
                    parsedCount: 50,
                    importedCount: 30,
                    errorCount: 20,
                },
            });
            const actual = sendMessageSpy.mock.calls[0][3];
            expect(actual).toContain("<li>Erreurs : 20</li>");
        });

        it("omits partial counts section when no count fields are provided", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportFailure({
                providerName: "Chorus",
                error: "File could not be parsed",
                details: { fileName: "chorus-data.csv", durationMs: 3500 },
            });
            const actual = sendMessageSpy.mock.calls[0][3];
            expect(actual).not.toContain("<strong>Counts partiels</strong>");
        });

        it("omits année line when exerciseYear is absent", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.dataImportFailure({
                providerName: "Chorus",
                error: "File could not be parsed",
                details: { fileName: "chorus-data.csv", durationMs: 3500 },
            });
            const actual = sendMessageSpy.mock.calls[0][3];
            expect(actual).not.toContain("<strong>Année</strong>");
        });
    });

    describe("depositScdlSuccess", () => {
        it("sends message", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.depositScdlSuccess({
                providerName: "Ville d'Angers",
                providerSiret: "12345678900013",
                parsedLines: 123,
                grantCoverageYears: [2023],
            });
            const actual = sendMessageSpy.mock.calls[0];
            expect(actual).toMatchSnapshot();
        });
    });

    describe("failedCron", () => {
        it("sends message", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.failedCron({ cronName: "daily-job", error: "boom" });
            const actual = [
                ...sendMessageSpy.mock.calls[0].slice(0, 3),
                sendMessageSpy.mock.calls[0][3].replace(/Error: boom[\s\S]*/, "Error: boom</code></pre>"),
            ];
            expect(actual).toMatchSnapshot();
        });
    });

    describe("connectionLost", () => {
        it("sends message", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.connectionLost({ eventName: "connectionClosed" });
            const actual = sendMessageSpy.mock.calls[0];
            expect(actual).toMatchSnapshot();
        });
    });

    describe("externalApiError", () => {
        it("sends message", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.externalApiError({
                message: "API unavailable",
                details: {
                    apiName: "api-entreprise",
                    pathParams: ["siret", "12345678900012"],
                    queryParams: [{ name: "recipient", value: "Data.Subvention" }],
                    examples: [{ status: 500, message: "Internal error" }],
                },
            });
            const actual = sendMessageSpy.mock.calls[0];
            expect(actual).toMatchSnapshot();
        });
    });
});
