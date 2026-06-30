import { RgpdCron } from "../../../src/adapters/inputs/cron/rgpd.cron";
import userAdapter from "../../../src/adapters/outputs/db/user/user.adapter";
import brevoContactNotifyPipe from "../../../src/modules/notify/out-pipes/brevo-contact.pipe";
import axios from "axios";
import brevoMailNotifyPipe from "../../../src/modules/notify/out-pipes/brevo-mail.pipe";
import userResetAdapter from "../../../src/adapters/outputs/db/user/user-reset.adapter";
import configurationsService, { CONFIGURATION_NAMES } from "../../../src/modules/configurations/configurations.service";
import { ENV as _ENV, EnvironmentEnum } from "../../../src/configurations/env.conf";
import { USER_NOT_PERSISTED } from "../../../src/modules/user/__fixtures__/user.fixture";
import NewUserEntity from "../../../src/domain/users/NewUserEntity";

describe("Rgpd Cron", () => {
    const NOW = new Date();
    let cron: RgpdCron;

    beforeEach(() => {
        // @ts-expect-error: override jest config mock to test notifications pipes
        _ENV = EnvironmentEnum.PROD;
    });

    beforeEach(async () => {
        cron = new RgpdCron();
        // emulate first call
        configurationsService.updateConfigEntity(CONFIGURATION_NAMES.LAST_RGPD_WARNED_DATE, undefined);
        await Promise.all([
            // last activity more than two years ago
            userAdapter.create({
                ...USER_NOT_PERSISTED,
                active: true,
                email: "old-user1@mail.com",
                signupAt: new Date("2020-06-12"),
                lastActivityDate: new Date("2020-12-12"),
            } as NewUserEntity),
            // user just came to the solution
            userAdapter.create({
                ...USER_NOT_PERSISTED,
                active: true,
                email: "new-user@mail.com",
            } as NewUserEntity),
            // user never activated for 6 months
            userAdapter.create({
                ...USER_NOT_PERSISTED,
                active: false,
                email: "old-user2@mail.com",
                signupAt: new Date(NOW.getFullYear(), NOW.getMonth() - 6, -1),
                lastActivityDate: new Date(NOW.getFullYear(), NOW.getMonth() - 6, -1),
            } as NewUserEntity),
            // user activated account more than 6 months ago
            userAdapter.create({
                ...USER_NOT_PERSISTED,
                active: true,
                email: "normal-user@mail.com",
                signupAt: new Date(NOW.getFullYear(), NOW.getMonth() - 10),
                lastActivityDate: new Date(NOW),
            } as NewUserEntity),
        ]);
    });

    describe("removeInactiveUsers()", () => {
        it("should disable users that did not use the app for 2 years", async () => {
            await cron.removeInactiveUsers();
            const users = await userAdapter.find({ disable: true });

            expect(
                users.map(user => ({
                    ...user,
                    email: expect.stringMatching(/^[a-f0-9]+@deleted\.datasubvention\.beta\.gouv\.fr$/),
                    id: expect.any(String),
                    lastActivityDate: expect.any(Date),
                    signupAt: expect.any(Date),
                    jwt: { ...user.jwt, expirateDate: expect.any(Date) },
                })),
            ).toMatchSnapshot();
        });

        it("should delete the users on brevo", async () => {
            await cron.removeInactiveUsers();
            // @ts-expect-error -- test private instance
            expect(brevoContactNotifyPipe.apiInstance.deleteContact).toHaveBeenCalledTimes(2);
        });

        it("should notify through mattermost", async () => {
            await cron.removeInactiveUsers();
            const actual = jest.mocked(axios.post).mock.calls;
            expect(actual).toMatchSnapshot();
        });

        it("should notify users through brevo", async () => {
            await cron.removeInactiveUsers();
            // @ts-expect-error -- test private instance
            const actual = jest.mocked(brevoMailNotifyPipe.apiInstance.sendTransacEmail).mock.calls;
            expect(actual).toMatchSnapshot();
        });
    });

    describe("warnInactiveUsers()", () => {
        it("should notify users through brevo", async () => {
            await cron.warnInactiveUsers();
            // @ts-expect-error -- test private instance
            const actual = jest.mocked(brevoMailNotifyPipe.apiInstance.sendTransacEmail).mock.calls;
            // @ts-expect-error -- test private instance
            expect(brevoMailNotifyPipe.apiInstance.sendTransacEmail).toHaveBeenCalled();
            expect(actual).toMatchObject([
                [
                    {
                        templateId: 155,
                        sender: { name: "Data.Subvention", email: process.env.MAIL_USER },
                        params: {
                            email: "old-user2@mail.com",
                            activationLink: expect.any(String),
                        },
                        to: [{ email: "old-user2@mail.com" }],
                        bcc: [
                            {
                                name: "Data.Subvention Log",
                                email: "log@datasubvention.beta.gouv.fr",
                            },
                        ],
                    },
                    { headers: { "content-type": "application/json" } },
                ],
            ]);
            const actualLink = (actual[0][0].params as { email: string; activationLink: string }).activationLink;
            const actualLinkMatch = actualLink.match(
                /^http:\/\/localhost:5173\/auth\/reset-password\/(.*)/,
            ) as RegExpMatchArray; // we know that a link as been provided and that the match will find it
            const actualToken = actualLinkMatch[1];
            const foundReset = await userResetAdapter.findByToken(actualToken as string);
            expect(foundReset).not.toBeNull();
        });

        it("does not notify already notified users", async () => {
            await cron.warnInactiveUsers(); // first call inits last warned date
            // @ts-expect-error -- test private instance
            jest.mocked(brevoMailNotifyPipe.apiInstance.sendTransacEmail).mockClear();
            await cron.warnInactiveUsers();
            // @ts-expect-error -- test private instance
            const actual = jest.mocked(brevoMailNotifyPipe.apiInstance.sendTransacEmail).mock.calls.length;
            expect(actual).toBe(0);
        });
    });
});
