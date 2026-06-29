import axios from "axios";
import { NotificationType } from "../@types/NotificationType";
import { MattermostPipe } from "./mattermost.pipe";

jest.mock("axios");
jest.mock("../../../configurations/env.conf", () => ({ ENV: "test" }));

const WEBHOOK_URL = "https://mattermost.example.com/hooks/test";

describe("MattermostPipe", () => {
    let notifyPipe: MattermostPipe;
    const USER_DELETED_PAYLOAD = {
        email: "email",
        firstname: "Prénom",
        lastname: "NOM",
    };
    const MATTERMOST_MESSAGE = {
        text: "some text",
    };

    beforeAll(() => {
        process.env.MATTERMOST_WEBHOOK_URL = WEBHOOK_URL;
        notifyPipe = new MattermostPipe();
    });

    afterAll(() => {
        delete process.env.MATTERMOST_WEBHOOK_URL;
    });

    describe("constructor", () => {
        it("warns if MATTERMOST_WEBHOOK_URL is not defined", () => {
            const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
            const originalUrl = process.env.MATTERMOST_WEBHOOK_URL;
            delete process.env.MATTERMOST_WEBHOOK_URL;
            new MattermostPipe();
            expect(consoleSpy).toHaveBeenCalledWith("MATTERMOST_WEBHOOK_URL is not defined in environment variables");
            process.env.MATTERMOST_WEBHOOK_URL = originalUrl;
            consoleSpy.mockRestore();
        });

        it("sets apiUrl from env variable", () => {
            const pipe = new MattermostPipe();
            // @ts-expect-error -- private attribute
            expect(pipe.apiUrl).toBe(WEBHOOK_URL);
        });
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
        it("calls axios post with apiUrl from service", async () => {
            const notifyPipeHere = new MattermostPipe();
            const URL = "URL";
            // @ts-expect-error -- private attribute
            notifyPipeHere.apiUrl = URL;
            // @ts-expect-error -- private method
            await notifyPipeHere.sendMessage(MATTERMOST_MESSAGE);
            const expected = URL;
            const actual = jest.mocked(axios.post).mock.calls[0][0];
            expect(actual).toBe(expected);
        });

        it("calls axios post with payload with updated text payload", async () => {
            // @ts-expect-error -- private method
            await notifyPipe.sendMessage({ text: "something", somethingElse: "value" });
            const actual = jest.mocked(axios.post).mock.calls[0][1];
            expect(actual).toMatchInlineSnapshot(`
                {
                  "somethingElse": "value",
                  "text": "[test] something",
                }
            `);
        });

        it("returns true if axios succeeds", async () => {
            jest.mocked(axios.post).mockResolvedValue(true);
            const expected = true;
            // @ts-expect-error -- private method
            const actual = await notifyPipe.sendMessage(MATTERMOST_MESSAGE);
            expect(actual).toBe(expected);
        });

        it("returns false if error in axios", async () => {
            jest.mocked(axios.post).mockRejectedValueOnce("error");
            const expected = false;
            // @ts-expect-error -- private method
            const actual = await notifyPipe.sendMessage(MATTERMOST_MESSAGE);
            expect(actual).toBe(expected);
        });

        it("returns false when apiUrl is empty", async () => {
            const pipe = new MattermostPipe();
            // @ts-expect-error -- private attribute
            pipe.apiUrl = "";
            // @ts-expect-error -- private method
            const actual = await pipe.sendMessage(MATTERMOST_MESSAGE);
            expect(actual).toBe(false);
        });

        it("does not call axios when apiUrl is empty", async () => {
            const pipe = new MattermostPipe();
            // @ts-expect-error -- private attribute
            pipe.apiUrl = "";
            jest.mocked(axios.post).mockClear();
            // @ts-expect-error -- private method
            await pipe.sendMessage(MATTERMOST_MESSAGE);
            expect(axios.post).not.toHaveBeenCalled();
        });
    });

    describe("userDeleted", () => {
        it("sends message with proper payload with false selfDeleted", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.userDeleted(USER_DELETED_PAYLOAD);
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual).toMatchSnapshot();
        });

        it("sends message with proper payload with truthy selfDeleted", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.userDeleted({ ...USER_DELETED_PAYLOAD, selfDeleted: true });
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual).toMatchSnapshot();
        });
    });

    describe("badEmailDomain", () => {
        it("sends message with proper payload", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.badEmailDomain({ email: "some@email.fr" });
            const actual = sendMessageSpy.mock.calls[0][0];
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
            const actual = sendMessageSpy.mock.calls[0][0];
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
            const actual = sendMessageSpy.mock.calls[0][0];
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
            const actual = sendMessageSpy.mock.calls[0][0];
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
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual.text).toContain("**Batch** : `helios-data` (4 fichiers)");
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
            const actual = sendMessageSpy.mock.calls[0][0];
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
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual.text).toContain("- Données importées : 122892 (49.57%)");
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
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual.text).toContain("- Erreurs : 125039 (50.43%)");
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
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual.text).not.toContain("%");
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
            const actual = sendMessageSpy.mock.calls[0][0];
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
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual.text).not.toContain("export du");
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
            const actual = sendMessageSpy.mock.calls[0][0];
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
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual.text).toContain("**Counts partiels**");
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
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual.text).toContain("- Lignes parsées : 50");
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
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual.text).toContain("- Données importées : 30");
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
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual.text).toContain("- Erreurs : 20");
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
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual.text).not.toContain("**Counts partiels**");
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
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual.text).not.toContain("**Année**");
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
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual).toMatchSnapshot();
        });
    });
});
