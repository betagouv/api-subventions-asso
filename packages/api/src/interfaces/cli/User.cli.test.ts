import userStatsService from "../../modules/user/services/stats/user.stats.service";
jest.mock("../../modules/user/services/stats/user.stats.service");
import UserCli from "./User.cli";

describe("User CLI", () => {
    let cli: UserCli;

    beforeEach(() => {
        cli = new UserCli();
    });

    describe("updateNbRequests", () => {
        it("should call userStatsService.updateNbRequests", () => {
            cli.updateNbRequests();
            expect(userStatsService.updateNbRequests).toHaveBeenCalledTimes(1);
        });
    });
});
