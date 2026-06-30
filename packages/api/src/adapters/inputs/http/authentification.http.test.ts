import { AuthentificationHttp } from "./authentification.http";
import { IdentifiedRequest } from "../../../@types";
import userProConnectService from "../../../modules/user/services/pro-connect/user.pro-connect.service";
import userAuthService from "../../../modules/user/services/auth/user.auth.service";
import { BadRequestError } from "core";
import { USER_ENTITY } from "../../../modules/user/__fixtures__/user.fixture";
import { UserDto } from "dto";

jest.mock("../../../modules/user/services/pro-connect/user.pro-connect.service");
jest.mock("../../../modules/user/services/auth/user.auth.service");

describe("Authentication http", () => {
    let ctrl: AuthentificationHttp;
    const mockGetLogoutUrl = jest.spyOn(userProConnectService, "getLogoutUrl");
    beforeAll(() => {
        ctrl = new AuthentificationHttp();
    });

    beforeEach(() => {
        mockGetLogoutUrl.mockResolvedValue("/logout/url");
    });

    describe("logout", () => {
        beforeAll(() => {
            jest.spyOn(userProConnectService, "getLogoutUrl").mockResolvedValue("/logout/url");
        });

        const REQUEST = { user: USER_ENTITY as UserDto } as IdentifiedRequest;

        it("call proConnect logout", async () => {
            await ctrl.logout(REQUEST);
            expect(mockGetLogoutUrl).toHaveBeenCalledWith(REQUEST.user);
        });

        it("return url from proConnect logout", async () => {
            const URL = "some.where";
            const expected = URL;
            jest.mocked(mockGetLogoutUrl).mockResolvedValueOnce(URL);
            const actual = await ctrl.logout(REQUEST);
            expect(actual).toBe(expected);
        });

        it("return null url if proConnect is not initialized", async () => {
            mockGetLogoutUrl.mockImplementation().mockRejectedValue(new Error());
            const actual = await ctrl.logout(REQUEST);
            expect(actual).toBeNull();
        });

        it("call generic logout", async () => {
            await ctrl.logout(REQUEST);
            expect(userAuthService.logout).toHaveBeenCalledWith(REQUEST.user);
        });

        it("throws if no identified user", async () => {
            const ERROR = new BadRequestError();
            const test = ctrl.logout({} as IdentifiedRequest);
            expect(test).rejects.toEqual(ERROR);
        });
    });
});
