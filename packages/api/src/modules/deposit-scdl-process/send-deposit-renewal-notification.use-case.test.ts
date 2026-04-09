import SendDepositRenewalNotificationUseCase from "./send-deposit-renewal-notification.use-case";
import notifyService from "../notify/notify.service";
import { NotificationType } from "../notify/@types/NotificationType";

jest.mock("../notify/notify.service", () => ({
    __esModule: true,
    default: {
        notify: jest.fn(),
    },
}));

describe("SendDepositRenewalNotificationUseCase", () => {
    let dataLogPort;
    let userPort;
    let useCase: SendDepositRenewalNotificationUseCase;

    const DATA_LOGS = [{ userId: 1 }, { userId: 2 }];

    beforeEach(() => {
        dataLogPort = {
            findUserFileLogsFromPeriod: jest.fn(),
        };
        userPort = {
            findByIds: jest.fn(),
        };
        useCase = new SendDepositRenewalNotificationUseCase(dataLogPort, userPort);
    });

    it("should send notification with user emails", async () => {
        dataLogPort.findUserFileLogsFromPeriod.mockResolvedValue(DATA_LOGS);
        userPort.findByIds.mockResolvedValue([{ email: "a@test.com" }, { email: "b@test.com" }]);

        await useCase.execute();

        expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.BATCH_DEPOSIT_RENEWAL, {
            emails: ["a@test.com", "b@test.com"],
        });
    });

    it("should not call notify if no logs", async () => {
        dataLogPort.findUserFileLogsFromPeriod.mockResolvedValue(null);

        await useCase.execute();

        expect(notifyService.notify).not.toHaveBeenCalled();
    });

    it("should not call notify if no users", async () => {
        dataLogPort.findUserFileLogsFromPeriod.mockResolvedValue(DATA_LOGS);
        userPort.findByIds.mockResolvedValue(null);

        await useCase.execute();

        expect(notifyService.notify).not.toHaveBeenCalled();
    });
});
