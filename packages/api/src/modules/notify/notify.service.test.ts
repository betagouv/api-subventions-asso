import { NotificationType } from "./@types/NotificationType";
import { NotifyOutPipe } from "./@types/NotifyOutPipe";
import { NotifyService } from "./notify.service"

describe("NotifyService", () => {
    describe("notify", () => {
        let notifyService: NotifyService;
        let getterOutPipesSpy: jest.SpyInstance;

        const fakeOutPipe: NotifyOutPipe = {
            accepts: [NotificationType.TEST_EMAIL],
            notify: jest.fn()
        };

        beforeEach(() => {
            notifyService = new NotifyService();
        })

        it("should call outPipe", async () => {
            // @ts-expect-error outPipes is private attributes
            notifyService.outPipes = [
                fakeOutPipe
            ];

            const expected = { email: "Fake email", templateId: 0 };

            await notifyService.notify(NotificationType.TEST_EMAIL, expected);

            expect(fakeOutPipe.notify).toHaveBeenCalledWith(NotificationType.TEST_EMAIL, expected);
        })

        it("should call only good outPipe", async () => {
            const outPipe: NotifyOutPipe =  {
                accepts: [],
                notify: jest.fn()
            };

            // @ts-expect-error outPipes is private attributes
            notifyService.outPipes = [
                outPipe
            ];


            await notifyService.notify(NotificationType.TEST_EMAIL,  { email: "Fake email", templateId: 0 });

            expect(outPipe.notify).not.toHaveBeenCalled();
        })
    })
})