import depositLogPort from "../../../src/dataProviders/db/deposit-log/depositLog.port";
import userPort from "../../../src/dataProviders/db/user/user.port";
import { ScdlDepositCron } from "../../../src/interfaces/cron/ScdlDeposit.cron";
import { DEPOSIT_LOG_DBO } from "../../../src/modules/deposit-scdl-process/__fixtures__/depositLog.fixture";
import brevoMailNotifyPipe from "../../../src/modules/notify/outPipes/BrevoMailNotifyPipe";
import { USER_DBO } from "../../../src/modules/user/__fixtures__/user.fixture";
import { addDaysToDate } from "../../../src/shared/helpers/DateHelper";

describe("ScdlDeposit CRON", () => {
    let cron: ScdlDepositCron;

    beforeEach(() => {
        cron = new ScdlDepositCron();
    });

    describe("notifyUsers", () => {
        beforeEach(async () => {
            const twoDaysAgo = addDaysToDate(-2);
            await userPort.create({ ...USER_DBO, signupAt: addDaysToDate(-10) });
            await depositLogPort.insertOne({
                ...DEPOSIT_LOG_DBO,
                updateDate: twoDaysAgo,
                userId: USER_DBO._id.toString(),
            });
        });

        it("send mail to users that started deposit 2 days ago", async () => {
            await cron.notifyUsers();
            // @ts-expect-error -- test private instance
            expect(jest.mocked(brevoMailNotifyPipe.apiInstance.sendTransacEmail)).toHaveBeenCalledWith(
                USER_DBO.email,
                {},
                262, // TemplateEnum.resumeDeposit
            );
        });
    });
});
