import { RgpdCron } from "../../../src/interfaces/cron/Rgpd.cron";
import userRepository from "../../../src/dataProviders/db/user/user.port";
import { USER_DBO } from "../../../src/modules/user/__fixtures__/user.fixture";
import brevoContactNotifyPipe from "../../../src/modules/notify/outPipes/BrevoContactNotifyPipe";
import axios from "axios";
import brevoMailNotifyPipe from "../../../src/modules/notify/outPipes/BrevoMailNotifyPipe";
import userResetRepository from "../../../src/dataProviders/db/user/user-reset.port";
import configurationsService, { CONFIGURATION_NAMES } from "../../../src/modules/configurations/configurations.service";

describe("Rgpd Cron", () => {
    const NOW = new Date();
    const NOW_STR = NOW.toString();
    let cron: RgpdCron;

    beforeEach(() => {
        cron = new RgpdCron();
        // emulate first call
        configurationsService.updateConfigEntity(CONFIGURATION_NAMES.LAST_RGPD_WARNED_DATE, undefined);
    });

    describe("removeInactiveUsers()", () => {
        beforeEach(async () => {
            await Promise.all([
                // last activity more than two years ago
                userRepository.create({
                    ...USER_DBO,
                    email: "old-user1@mail.com",
                    lastActivityDate: new Date("2020-12-12"),
                }),
                // user just came to the solution
                userRepository.create({
                    ...USER_DBO,
                    email: "new-user@mail.com",
                    lastActivityDate: new Date(NOW),
                }),
                // user never activated for 6 months
                userRepository.create({
                    ...USER_DBO,
                    email: "old-user2@mail.com",
                    signupAt: new Date(NOW.getFullYear(), NOW.getMonth() - 6, -1),
                    lastActivityDate: null,
                }),
                // user activated account more than 6 months ago
                userRepository.create({
                    ...USER_DBO,
                    email: "normal-user@mail.com",
                    signupAt: new Date(NOW.getFullYear(), NOW.getMonth() - 10),
                    lastActivityDate: new Date(NOW),
                }),
            ]);
        });

        it("should disable users that did not use the app for 2 years", async () => {
            await cron.removeInactiveUsers();
            const users = await userRepository.findAll();
            const expected = [
                {
                    firstName: "",
                    lastName: "",
                    active: false,
                    disable: true,
                },
                {
                    firstName: "",
                    lastName: "",
                    active: false,
                    disable: true,
                },
                {
                    firstName: "Prénom",
                    lastName: "NOM",
                    active: true,
                },
                {
                    firstName: "Prénom",
                    lastName: "NOM",
                    active: true,
                },
            ];
            (users as { firstName: string }[]).sort((u1, u2) => u1.firstName.localeCompare(u2.firstName));
            expect(users.sort()).toMatchObject(expected);
            users.map(user =>
                expect(!user.disable || user.email === `${user._id}@deleted.datasubvention.beta.gouv.fr`),
            );
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
        beforeEach(async () => {
            await Promise.all([
                // user just came to the solution
                userRepository.create({
                    ...USER_DBO,
                    email: "new-user@mail.com",
                    lastActivityDate: new Date(NOW),
                }),
                // user never activated for 5 months
                userRepository.create({
                    ...USER_DBO,
                    email: "old-user2@mail.com",
                    signupAt: new Date(NOW.getFullYear(), NOW.getMonth() - 5),
                    lastActivityDate: null,
                }),
                // user activated for 5 months that came
                userRepository.create({
                    ...USER_DBO,
                    email: "normal-user@mail.com",
                    lastActivityDate: new Date(NOW),
                    signupAt: new Date(NOW.getFullYear(), NOW.getMonth() - 5, NOW.getDate() - 1),
                }),
            ]);
        });

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
                        sender: { name: "Data.Subvention", email: "" },
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
            const actualLink = actual[0][0].params.activationLink;
            const actualToken = actualLink.match(/^http:\/\/dev\.local:5173\/auth\/reset-password\/(.*)/)[1];
            const foundReset = await userResetRepository.findByToken(actualToken);
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
