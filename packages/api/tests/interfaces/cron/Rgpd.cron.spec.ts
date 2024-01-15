import { RgpdCron } from "../../../src/interfaces/cron/Rgpd.cron";
import userRepository from "../../../src/modules/user/repositories/user.repository";
import { USER_DBO } from "../../../src/modules/user/__fixtures__/user.fixture";
import brevoContactNotifyPipe from "../../../src/modules/notify/outPipes/BrevoContactNotifyPipe";
import axios from "axios";

describe("Rgpd Cron", () => {
    const NOW = new Date(new Date().getFullYear(), 0, 1);
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
                    signupAt: new Date("2020-12-12"),
                    jwt: null,
                }),
                userRepository.create({
                    ...USER_DBO,
                    email: "old-user2@mail.com",
                    signupAt: NOW,
                    jwt: { ...USER_DBO.jwt, expirateDate: new Date("2020-12-12") },
                }),
                userRepository.create({
                    ...USER_DBO,
                    email: "new-user@mail.com",
                    jwt: null,
                    signupAt: NOW,
                }),
            ]);
        });

        it("should disable users that did not use the app for 2 years", async () => {
            await cron.removeInactiveUsers();
            const users = await userRepository.findAll();
            users.map(user =>
                expect(user).toMatchSnapshot({
                    _id: expect.anything(),
                    email: expect.any(String),
                    signupAt: expect.any(Date),
                }),
            );
            users.map(user =>
                expect(!user.disable || user.email === `${user._id}@deleted.datasubvention.beta.gouv.fr`),
            );
        });

        it("should delete the users on brevo", async () => {
            await cron.removeInactiveUsers();
            // @ts-ignore
            expect(brevoContactNotifyPipe.apiInstance.deleteContact).toHaveBeenCalledTimes(2);
        });

        it.only("should notify through mattermost", async () => {
            await cron.removeInactiveUsers();
            const actual = jest.mocked(axios.post).mock.calls;
            expect(actual).toMatchSnapshot();
        });
    });
});
