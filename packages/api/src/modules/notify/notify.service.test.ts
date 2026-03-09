import { NotificationType } from "./@types/NotificationType";
import { NotifyOutPipe } from "./@types/NotifyOutPipe";
import { NotifyService } from "./notify.service";
import { ENV as _ENV, EnvironmentEnum } from "../../../src/configurations/env.conf";

describe("NotifyService", () => {
    let notifyService: NotifyService;
    const initialEnv = _ENV;

    beforeEach(() => {
        notifyService = new NotifyService();
    });

    afterEach(() => {
        // @ts-expect-error: restore initial env
        _ENV = initialEnv;
    });

    describe("notify", () => {
        it("should call outPipe notify", async () => {
            const fakeOutPipe: NotifyOutPipe = {
                notify: jest.fn(() => Promise.resolve(true)),
            };

            // @ts-expect-error shouldSkipNotification is private method
            jest.spyOn(notifyService, "shouldSkipNotification").mockReturnValue(false);

            // @ts-expect-error outPipes is private attributes
            notifyService.outPipes = [fakeOutPipe];

            const expected = { email: "Fake email", templateId: 0 };

            await notifyService.notify(NotificationType.TEST_EMAIL, expected);

            expect(fakeOutPipe.notify).toHaveBeenCalledWith(NotificationType.TEST_EMAIL, expected);
        });

        it("should not call outPipe notify", async () => {
            const fakeOutPipe: NotifyOutPipe = {
                notify: jest.fn(() => Promise.resolve(true)),
            };

            // @ts-expect-error shouldSkipNotification is private method
            jest.spyOn(notifyService, "shouldSkipNotification").mockReturnValue(true);

            // @ts-expect-error outPipes is private attributes
            notifyService.outPipes = [fakeOutPipe];

            const datas = { email: "Fake email", templateId: 0 };

            await notifyService.notify(NotificationType.TEST_EMAIL, datas);

            expect(fakeOutPipe.notify).not.toHaveBeenCalled();
        });
    });

    describe("shouldSkipNotification", () => {
        it("should return false when environment is allowed", async () => {
            // @ts-expect-error: override jest config mock to test notifications pipes
            _ENV = EnvironmentEnum.PROD;
            // @ts-expect-error - private method
            const result = notifyService.shouldSkipNotification(NotificationType.TEST_EMAIL);

            expect(result).toBe(false);
        });

        it("should return true when environment is not allowed", async () => {
            // @ts-expect-error: override jest config mock to test notifications pipes
            _ENV = EnvironmentEnum.TEST;
            // @ts-expect-error - private method
            const result = notifyService.shouldSkipNotification(NotificationType.TEST_EMAIL);

            expect(result).toBe(true);
        });

        it("should return true when environment is not defined", async () => {
            // @ts-expect-error: override jest config mock to test notifications pipes
            _ENV = EnvironmentEnum.PROD;
            // @ts-expect-error - private method
            const result = notifyService.shouldSkipNotification("not defined type");

            expect(result).toBe(true);
        });
    });
});
