import { AuthentificationHttp } from "./authentification.http";
import { IdentifiedRequest } from "../../../@types";
import userProConnectService from "../../../modules/user/services/pro-connect/user.pro-connect.service";
import userAuthService from "../../../modules/user/services/auth/user.auth.service";
import { BadRequestError } from "core";

jest.mock("../../../modules/user/services/pro-connect/user.pro-connect.service");
jest.mock("../../../modules/user/services/auth/user.auth.service");

describe("Authentication http", () => {
    let ctrl: AuthentificationHttp;

    beforeAll(() => {
        ctrl = new AuthentificationHttp();
    });

    describe("logout", () => {
        // @ts-expect-error -- force typing for test
        const REQUEST = { user: "someone" } as IdentifiedRequest;

        it("call proConnect logout", async () => {
            await ctrl.logout(REQUEST);
            expect(userProConnectService.getLogoutUrl).toHaveBeenCalledWith(REQUEST.user);
        });

        it("return url from proConnect logout", async () => {
            const URL = "some.where";
            const expected = URL;
            jest.mocked(userProConnectService.getLogoutUrl).mockResolvedValueOnce(URL);
            const actual = await ctrl.logout(REQUEST);
            expect(actual).toBe(expected);
        });

        describe("without agent connect", () => {
            let noAcCtrl: AuthentificationHttp;

            beforeAll(async () => {
                jest.resetModules();
                const { AuthentificationHttp: NoAcController } = await import("./authentification.http");
                noAcCtrl = new NoAcController();
            });
            afterAll(() => {
                jest.resetModules();
            });

            it("does not call proConnect logout because env var is off", async () => {
                await noAcCtrl.logout(REQUEST);
                expect(userProConnectService.getLogoutUrl).not.toHaveBeenCalled();
            });

            it("return null url if proConnect is disabled", async () => {
                const actual = await noAcCtrl.logout(REQUEST);
                expect(actual).toBeNull();
            });
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
