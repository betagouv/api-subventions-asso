import { NotificationType } from "./@types/NotificationType";
import { NotifyOutPipe } from "./@types/NotifyOutPipe";
import { NotifyService } from "./notify.service";

describe("NotifyService", () => {
    describe("notify", () => {
        let notifyService: NotifyService;

        beforeEach(() => {
            notifyService = new NotifyService();
        });

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

            const expected = { email: "Fake email", templateId: 0 };

            await notifyService.notify(NotificationType.TEST_EMAIL, expected);

            expect(fakeOutPipe.notify).not.toHaveBeenCalled();
        });
    });
});
