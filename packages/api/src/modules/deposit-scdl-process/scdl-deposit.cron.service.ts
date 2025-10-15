import depositLogPort from "../../dataProviders/db/deposit-log/depositLog.port";
import { NotificationType } from "../notify/@types/NotificationType";
import notifyService from "../notify/notify.service";
import userCrudService from "../user/services/crud/user.crud.service";

class ScdlDepositCronService {
    // user that started a desposit 2 days ago
    async getUsersToNotify() {
        const today = new Date();
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);
        // setHours use local time and could be wrong
        twoDaysAgo.setUTCHours(0, 0, 0, 0);
        const deposits = await depositLogPort.findByDate(twoDaysAgo);
        return userCrudService.find({ userId: { $in: deposits?.map(deposit => deposit.userId) } });
    }

    // send mail to users to continue their deposit process
    async notifyUsers() {
        const users = await this.getUsersToNotify();
        return notifyService.notify(NotificationType.BATCH_DEPOSIT_RESUME, { emails: users.map(u => u.email) });
    }
}

const scdlDespositCronService = new ScdlDepositCronService();
export default scdlDespositCronService;
