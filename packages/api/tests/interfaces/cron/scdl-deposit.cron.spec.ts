import userAdapter from "../../../src/adapters/outputs/db/user/user.adapter";
import { ScdlDepositCron } from "../../../src/adapters/inputs/cron/scdl-deposit.cron";
import { DEPOSIT_LOG_DBO } from "../../../src/modules/deposit-scdl-process/__fixtures__/deposit-log.fixture";
import { USER_DBO } from "../../../src/modules/user/__fixtures__/user.fixture";
import { addDaysToDate, sameDateLastYear } from "../../../src/shared/helpers/DateHelper";
import depositLogAdapter from "../../../src/adapters/outputs/db/deposit-log/deposit-log.adapter";
import { ENV as _ENV, EnvironmentEnum } from "../../../src/configurations/env.conf";
import brevoMailNotifyPipe from "../../../src/modules/notify/out-pipes/brevo-mail.pipe";

describe("ScdlDeposit CRON", () => {
    let cron: ScdlDepositCron;

    beforeEach(() => {
        // @ts-expect-error: override ENV to enable notification
        _ENV = EnvironmentEnum.PROD;
        cron = new ScdlDepositCron();
    });

    afterEach(() => {
        // @ts-expect-error: override ENV to enable notification
        _ENV = EnvironmentEnum.TEST;
    });

    describe("notifyUsers", () => {
        beforeEach(async () => {
            const TODAY = new Date();
            const twoDaysAgo = addDaysToDate(TODAY, -2);
            const user = await userAdapter.create({ ...USER_DBO, signupAt: addDaysToDate(TODAY, -10) });
            await depositLogAdapter.insertOne({
                ...DEPOSIT_LOG_DBO,
                updateDate: twoDaysAgo,
                userId: user._id.toString(),
            });
        });

        it("send mail to users that started deposit 2 days ago", async () => {
            await cron.notifyUsers();
            // @ts-expect-error: mocked
            const args = jest.mocked(brevoMailNotifyPipe.apiInstance.sendTransacEmail).mock.calls[0][0];
            expect(args).toMatchSnapshot();
        });
    });

    describe("notifyDepositRenewal", () => {
        const TODAY = new Date();
        const oneYearAgo = sameDateLastYear(TODAY);

        it("notify user", async () => {
            const user = await userAdapter.create({ ...USER_DBO, signupAt: oneYearAgo });
            await depositLogAdapter.insertOne({
                ...DEPOSIT_LOG_DBO,
                updateDate: addDaysToDate(oneYearAgo, 1),
                userId: user._id.toString(),
            });
            await cron.notifyDepositRenewal();
            // @ts-expect-error: access private property
            const args = jest.mocked(brevoMailNotifyPipe.apiInstance.sendTransacEmail).mock.calls[0][0];
            expect(args).toMatchSnapshot();
        });

        it("does not notify when no deposit were made during same month last year", async () => {
            await cron.notifyDepositRenewal();
            // @ts-expect-error: access private property
            const calls = jest.mocked(brevoMailNotifyPipe.apiInstance.sendTransacEmail).mock.calls;
            expect(calls.length).toEqual(0);
        });
    });
});
