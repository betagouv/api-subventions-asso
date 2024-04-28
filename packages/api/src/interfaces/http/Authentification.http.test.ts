import { AuthentificationHttp } from "./Authentification.http";
import { IdentifiedRequest } from "../../@types";
import userAgentConnectService from "../../modules/user/services/agentConnect/user.agentConnect.service";
import userAuthService from "../../modules/user/services/auth/user.auth.service";
import { BadRequestError } from "../../shared/errors/httpErrors";

jest.mock("../../modules/user/services/agentConnect/user.agentConnect.service");
jest.mock("../../modules/user/services/auth/user.auth.service");

describe("Authentication http", () => {
    let ctrl: AuthentificationHttp;

    beforeAll(() => {
        ctrl = new AuthentificationHttp();
    });

    describe("logout", () => {
        // @ts-expect-error -- force typing for test
        const REQUEST = { user: "someone" } as IdentifiedRequest;

        it("call agentConnect logout", async () => {
            await ctrl.logout(REQUEST);
            expect(userAgentConnectService.getLogoutUrl).toHaveBeenCalledWith(REQUEST.user);
        });

        it("return url from agentConnect logout", async () => {
            const URL = "some.where";
            const expected = URL;
            jest.mocked(userAgentConnectService.getLogoutUrl).mockResolvedValueOnce(URL);
            const actual = await ctrl.logout(REQUEST);
            expect(actual).toBe(expected);
        });

        describe("without agent connect", () => {
            let noAcCtrl: AuthentificationHttp;

            beforeAll(async () => {
                jest.resetModules();
                jest.doMock("../../configurations/agentConnect.conf", () => ({
                    AGENT_CONNECT_ENABLED: false,
                    __esModule: true,
                }));
                const { AuthentificationHttp: NoAcController } = await import("./Authentification.http");
                noAcCtrl = new NoAcController();
            });
            afterAll(() => {
                jest.resetModules();
            });

            it("does not call agentConnect logout because env var is off", async () => {
                await noAcCtrl.logout(REQUEST);
                expect(userAgentConnectService.getLogoutUrl).not.toHaveBeenCalled();
            });

            it("return null url if agentConnect is disabled", async () => {
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
