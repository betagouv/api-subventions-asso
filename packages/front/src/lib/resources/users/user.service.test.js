import userService from "./user.service";
import userPort from "./user.port";
vi.mock("./user.port");

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
    });
});
