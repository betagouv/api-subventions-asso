import axios from "axios";
import { NotificationType } from "../@types/NotificationType";
import { MattermostNotifyPipe } from "./MattermostNotifyPipe";

jest.mock("axios");
jest.mock("../../../configurations/env.conf", () => ({ ENV: "test" }));

describe("MattermostNotifyPipe", () => {
    let notifyPipe: MattermostNotifyPipe;
    const USER_DELETED_PAYLOAD = {
        email: "email",
        firstname: "Prénom",
        lastname: "NOM",
    };
    const MATTERMOST_MESSAGE = {
        text: "some text",
    };

    beforeAll(() => {
        notifyPipe = new MattermostNotifyPipe();
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
            const notifyPipeHere = new MattermostNotifyPipe();
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
                Object {
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
    });

    describe("userDeleted", () => {
        it("sends message with proper payload with false selfDeleted", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.userDeleted(USER_DELETED_PAYLOAD);
            // @ts-expect-error -- private method does not expect calls
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual).toMatchSnapshot();
        });

        it("sends message with proper payload with truthy selfDeleted", async () => {
            // @ts-expect-error -- private method
            const sendMessageSpy = jest.spyOn(notifyPipe, "sendMessage").mockResolvedValueOnce(true);
            // @ts-expect-error -- private method
            await notifyPipe.userDeleted({ ...USER_DELETED_PAYLOAD, selfDeleted: true });
            // @ts-expect-error -- private method does not expect calls
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
            // @ts-expect-error -- private method does not expect calls
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
            // @ts-expect-error -- private method does not expect calls
            const actual = sendMessageSpy.mock.calls[0][0];
            expect(actual).toMatchSnapshot();
        });
    });
});
