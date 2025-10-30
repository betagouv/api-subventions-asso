import depositLogPort from "../../dataProviders/db/deposit-log/depositLog.port";
import { addDaysToDate } from "../../shared/helpers/DateHelper";
import { NotificationType } from "../notify/@types/NotificationType";
import notifyService from "../notify/notify.service";
import userCrudService from "../user/services/crud/user.crud.service";

class ScdlDepositCronService {
    // user that started a desposit 2 days ago
    async getUsersEmailToNotify() {
        const twoDaysAgo = addDaysToDate(new Date(), -2);
        const usersId = await this.getDepositsUserIdFromDate(twoDaysAgo);
        if (!usersId) return null;
        const users = await userCrudService.findUsersByIdList(usersId);
        if (!users) return null;
        return users?.map(user => user.email);
    }

    async getDepositsUserIdFromDate(date: Date) {
        const deposits = await depositLogPort.findAllFromFullDay(date);
        if (!deposits) return null;
        return deposits.map(deposit => deposit.userId);
    }

    // user that started a desposit 7 days ago
    async getUsersToMail() {
        const sevenDaysAgo = addDaysToDate(new Date(), -7);
        const usersId = await this.getDepositsUserIdFromDate(sevenDaysAgo);
        if (!usersId) return null;
        return await userCrudService.findUsersByIdList(usersId);
    }

    // notify team about users that did not continue their deposit process after 7 days
    async notifyTeam() {
        console.log("getting users to mail to notify team...");
        const users = await this.getUsersToMail();
        if (!users) return;
        return notifyService.notify(NotificationType.DEPOSIT_UNFINISHED, {
            users: users.map(user => ({ email: user.email, firstname: user.firstName, lastname: user.lastName })),
        });
    }

    // send mail to users to continue their deposit process
    async notifyUsers() {
        console.log("getting users to notify to resume deposit process...");
        const emails = await this.getUsersEmailToNotify();
        if (!emails) return;
        return;
        // TODO: uncomment when email template will be ready
        // return notifyService.notify(NotificationType.BATCH_DEPOSIT_RESUME, { emails });
    }
}

const scdlDespositCronService = new ScdlDepositCronService();
export default scdlDespositCronService;
