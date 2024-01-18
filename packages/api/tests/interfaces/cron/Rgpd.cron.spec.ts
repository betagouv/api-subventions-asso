import { RgpdCron } from "../../../src/interfaces/cron/Rgpd.cron";
import userRepository from "../../../src/modules/user/repositories/user.repository";
import { USER_DBO } from "../../../src/modules/user/__fixtures__/user.fixture";
import brevoContactNotifyPipe from "../../../src/modules/notify/outPipes/BrevoContactNotifyPipe";
import axios from "axios";
import brevoMailNotifyPipe from "../../../src/modules/notify/outPipes/BrevoMailNotifyPipe";

describe("Rgpd Cron", () => {
    const NOW = new Date();
    const NOW_STR = NOW.toString();
    let cron: RgpdCron;

    beforeEach(() => {
        cron = new RgpdCron();
    });

    describe("removeInactiveUsers()", () => {
        beforeEach(async () => {
            await Promise.all([
                userRepository.create({
                    ...USER_DBO,
                    email: "old-user1@mail.com",
                    lastActivityDate: new Date("2020-12-12"),
                }),
                userRepository.create({
                    ...USER_DBO,
                    email: "new-user@mail.com",
                    lastActivityDate: new Date(NOW),
                }),
                userRepository.create({
                    ...USER_DBO,
                    email: "old-user2@mail.com",
                    signupAt: new Date(NOW.getFullYear(), NOW.getMonth() - 6, -1),
                    lastActivityDate: null,
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
                    profileToComplete: false,
                    disable: true,
                },
                {
                    firstName: "Prénom",
                    lastName: "NOM",
                    active: true,
                    profileToComplete: false,
                },
                {
                    firstName: "",
                    lastName: "",
                    active: false,
                    profileToComplete: false,
                    disable: true,
                },
            ];
            expect(users).toMatchObject(expected);
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
});
