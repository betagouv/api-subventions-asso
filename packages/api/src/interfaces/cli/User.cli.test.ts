import userStatsService from "../../modules/user/services/stats/user.stats.service";
jest.mock("../../modules/user/services/stats/user.stats.service");
import UserCli from "./User.cli";
import userCrudService from "../../modules/user/services/crud/user.crud.service";
import userActivationService from "../../modules/user/services/activation/user.activation.service";
jest.mock("../../modules/user/services/crud/user.crud.service");
jest.mock("../../modules/user/services/activation/user.activation.service");
import { USER_WITHOUT_SECRET } from "../../modules/user/__fixtures__/user.fixture";

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

    describe("createAdmin", () => {
        const EMAIL = "superadmin@beta.gouv.fr";
        const USER = { ...USER_WITHOUT_SECRET, email: EMAIL };

        beforeAll(() => {
            jest.mocked(userCrudService.createUser).mockResolvedValue(USER);
        });
        afterAll(() => {
            jest.mocked(userCrudService.createUser).mockRestore();
        });

        it("calls createUser", async () => {
            await cli.createAdmin(EMAIL);
            expect(userCrudService.createUser).toHaveBeenCalledWith({ email: EMAIL, roles: ["admin", "user"] });
        });

        it("activates user", async () => {
            await cli.createAdmin(EMAIL);
            expect(userActivationService.setsPasswordAndActivate).toHaveBeenCalledWith(USER);
        });
    });
});
