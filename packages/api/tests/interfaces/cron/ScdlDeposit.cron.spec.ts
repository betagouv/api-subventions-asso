import depositLogPort from "../../../src/dataProviders/db/deposit-log/depositLog.port";
import userPort from "../../../src/dataProviders/db/user/user.port";
import { ScdlDepositCron } from "../../../src/interfaces/cron/ScdlDeposit.cron";
import { DEPOSIT_LOG_DBO } from "../../../src/modules/deposit-scdl-process/__fixtures__/depositLog.fixture";
import brevoMailNotifyPipe from "../../../src/modules/notify/outPipes/BrevoMailNotifyPipe";
import { USER_DBO, USER_NOT_PERSISTED } from "../../../src/modules/user/__fixtures__/user.fixture";
import { addDaysToDate } from "../../../src/shared/helpers/DateHelper";

describe("ScdlDeposit CRON", () => {
    let cron: ScdlDepositCron;

    beforeEach(() => {
        cron = new ScdlDepositCron();
    });

    describe("notifyUsers", () => {
        beforeEach(async () => {
            const TODAY = new Date();
            const twoDaysAgo = addDaysToDate(TODAY, -2);
            await userPort.create({ ...USER_DBO, signupAt: addDaysToDate(TODAY, -10) });
            await depositLogPort.insertOne({
                ...DEPOSIT_LOG_DBO,
                updateDate: twoDaysAgo,
                userId: USER_DBO._id.toString(),
            });
        });

        it.skip("send mail to users that started deposit 2 days ago", async () => {
            const now = new Date();

            const user = await userPort.create({
                ...USER_NOT_PERSISTED,
                signupAt: addDaysToDate(now, -10),
            });
            jest.useFakeTimers().setSystemTime(addDaysToDate(now, -2)); // mock updateDate from deposit date creation
            await depositLogPort.insertOne({
                ...DEPOSIT_LOG_DBO,
                userId: user._id.toString(),
            });
            jest.useRealTimers();
            await cron.notifyUsers();
            // @ts-expect-error: mocked
            const args = jest.mocked(brevoMailNotifyPipe.apiInstance.sendTransacEmail).mock.calls[0][0];
            expect(args).toMatchSnapshot();
        });
    });
});
