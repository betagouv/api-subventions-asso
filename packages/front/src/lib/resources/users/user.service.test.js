import userService from "./user.service";
import userPort from "./user.port";
vi.mock("./user.port");
import { goToUrl } from "$lib/services/router.service";
vi.mock("$lib/services/router.service");

describe("UsersService", () => {
    describe("isUserActif", () => {
        it("should return true", () => {
            const user = {
                stats: {
                    lastSearchDate: new Date(),
                },
            };
            const expected = true;
            const actual = userService.isUserActif(user);

            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const user = {
                stats: {
                    lastSearchDate: new Date(2000),
                },
            };
            const expected = false;
            const actual = userService.isUserActif(user);

            expect(actual).toEqual(expected);
        });
    });

    describe("deleteCurrentUser", () => {
        it("should call UserPort.deleteSelfUser", () => {
            userService.deleteCurrentUser();
            expect(userPort.deleteSelfUser).toHaveBeenCalledTimes(1);
        });

        it("should call goToUrl()", async () => {
            await userService.deleteCurrentUser();
            expect(goToUrl).toHaveBeenCalledTimes(1);
        });
    });
});
