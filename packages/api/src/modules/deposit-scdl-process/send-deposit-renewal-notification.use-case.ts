import { DataLogPort } from "../../adapters/outputs/db/data-log/data-log.port";
import { UserPort } from "../../adapters/outputs/db/user/user.port";
import { NotificationType } from "../notify/@types/NotificationType";
import notifyService from "../notify/notify.service";

/**
 * Deposit Logs are removed after a success
 * We need to get the inputs from Data Log which keeps track of all data addition
 */
export default class SendDepositRenewalNotificationUseCase {
    constructor(
        private dataLogPort: DataLogPort,
        private userPort: UserPort,
    ) {}

    async execute() {
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        const start = new Date(year - 1, month, 1);
        const end = new Date(year - 1, month + 1, 1);
        const logs = await this.dataLogPort.findUserFileLogsFromPeriod(start, end);
        if (!logs) return;
        const users = await this.userPort.findByIds(logs.map(log => log.userId));
        if (!users) return;
        return notifyService.notify(NotificationType.BATCH_DEPOSIT_RENEWAL, { emails: users.map(user => user.email) });
    }
}
