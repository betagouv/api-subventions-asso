import depositLogPort from "../../dataProviders/db/deposit-log/depositLog.port";
import { addDaysToDate } from "../../shared/helpers/DateHelper";
import { NotificationType } from "../notify/@types/NotificationType";
import notifyService from "../notify/notify.service";
import userCrudService from "../user/services/crud/user.crud.service";

class ScdlDepositCronService {
    // user that started a desposit 2 days ago
    async getUsersToNotify() {
        const twoDaysAgo = addDaysToDate(new Date(), -2);
        twoDaysAgo.setUTCHours(0, 0, 0, 0);
        const deposits = await depositLogPort.findByDate(twoDaysAgo);
        if (deposits) return userCrudService.findUsersByIdList(deposits?.map(deposit => deposit.userId));
        return null;
    }

    // send mail to users to continue their deposit process
    async notifyUsers() {
        console.log("getting users to notify to resume deposit process...");
        const users = await this.getUsersToNotify();
        if (!users) return;
        console.log("fires notification to send emails...");
        return notifyService.notify(NotificationType.BATCH_DEPOSIT_RESUME, { emails: users.map(u => u.email) });
    }
}

const scdlDespositCronService = new ScdlDepositCronService();
export default scdlDespositCronService;
