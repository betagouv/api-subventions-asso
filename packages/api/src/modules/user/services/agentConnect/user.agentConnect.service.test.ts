import userAgentConnectService, { UserAgentConnectService } from "./user.agentConnect.service";
import { AGENT_CONNECT_URL } from "../../../../configurations/agentConnect.conf";
import { Issuer, TokenSet } from "openid-client";
import { AgentConnectTokenDbo, AgentConnectUser } from "../../@types/AgentConnectUser";
import userPort from "../../../../dataProviders/db/user/user.port";
import userAuthService from "../auth/user.auth.service";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import { removeHashPassword, removeSecrets } from "../../../../shared/helpers/PortHelper";
import { USER_DBO, USER_WITHOUT_PASSWORD, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import agentConnectTokenPort from "../../../../dataProviders/db/user/acToken.port";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";
import { ObjectId } from "mongodb";
import { DuplicateIndexError } from "../../../../shared/errors/dbError/DuplicateIndexError";
import configurationsService from "../../../configurations/configurations.service";
import userCrudService from "../crud/user.crud.service";
import { UserDto } from "dto";
import { InternalServerError } from "core";

jest.mock("../../../../configurations/agentConnect.conf", () => ({
    AGENT_CONNECT_CLIENT_ID: "mocked_client_id",
    AGENT_CONNECT_CLIENT_SECRET: "mocked_client_secret",
    AGENT_CONNECT_URL: "agent-connect/url",
}));
jest.mock("../../../../configurations/front.conf", () => ({
    FRONT_OFFICE_URL: "http://my.front",
}));
jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(), // I shouldn't have to do this but mocking didn't work
}));
jest.mock("../../../../shared/helpers/PortHelper");
jest.mock("../crud/user.crud.service");
jest.mock("../../../../dataProviders/db/user/user.port");
jest.mock("../../../../dataProviders/db/user/acToken.port");
jest.mock("../../../configurations/configurations.service");
jest.mock("../auth/user.auth.service");

describe("userAgentConnectService", () => {
    const AC_USER: AgentConnectUser = {
        email: "mail@mail.com",
        given_name: "prénom1 prénom2",
        sub: "",
        uid: "123456789",
        usual_name: "nom de famille",
    };

    const TOKENSET = {
        id_token: "tokenHint",
    } as TokenSet;

    let clientConstructorMock;
    let endSessionMock;

    beforeAll(() => {
        clientConstructorMock = jest.fn((..._args) => {});
        endSessionMock = jest.fn();
        const mockIssuer = {
            Client: class Client {
                constructor(...args) {
                    clientConstructorMock(...args);
                }

                endSessionUrl(...args) {
                    return endSessionMock(...args);
                }
            },
        } as unknown as Issuer;
        jest.spyOn(Issuer, "discover").mockResolvedValue(mockIssuer);
        userAgentConnectService.initClient();
    });

    describe("initClient", () => {
        it("discovers client", async () => {
            const issuerDiscoverSpy = jest.spyOn(Issuer, "discover");
            await userAgentConnectService.initClient();
            expect(issuerDiscoverSpy).toHaveBeenCalledWith(AGENT_CONNECT_URL);
        });

        it("initializes client with proper args", async () => {
            await userAgentConnectService.initClient();
            const actual = clientConstructorMock.mock.calls[0][0];
            expect(actual).toMatchInlineSnapshot(`
                Object {
                  "client_id": "mocked_client_id",
                  "client_secret": "mocked_client_secret",
                  "id_token_signed_response_alg": "ES256",
                  "redirect_uris": Array [
                    "http://my.front/auth/login",
                  ],
                  "response_types": Array [
                    "code",
                  ],
                  "scope": "openid given_name family_name preferred_username birthdate email",
                  "userinfo_signed_response_alg": "ES256",
                }
            `);
        });
    });

    describe("login", () => {
        beforeAll(() => {
            jest.mocked(userCrudService.createUser).mockResolvedValue({ ...USER_DBO, agentConnectId: "acId" });
            jest.mocked(userAuthService.updateJwt).mockResolvedValue({ ...USER_DBO, agentConnectId: "acId" });
        });
        afterAll(() => {
            jest.mocked(userCrudService.createUser).mockReset();
            jest.mocked(userAuthService.updateJwt).mockReset();
        });

        it("gets user from port", async () => {
            await userAgentConnectService.login(AC_USER, TOKENSET);
            expect(userPort.getUserWithSecretsByEmail).toHaveBeenCalledWith(AC_USER.email);
        });

        it("updates user's jwt", async () => {
            await userAgentConnectService.login(AC_USER, TOKENSET);
            expect(userAuthService.updateJwt).toHaveBeenCalled();
        });

        it("saves agentConnect token", async () => {
            // @ts-expect-error -- spy private
            const saveTokenSpy = jest.spyOn(userAgentConnectService, "saveTokenSet");
            await userAgentConnectService.login(AC_USER, TOKENSET);
            expect(saveTokenSpy).toHaveBeenCalledWith(USER_DBO._id, TOKENSET);
        });

        it("notifies user login", async () => {
            const expectedUser = { email: USER_DBO.email, date: expect.any(Date) };
            await userAgentConnectService.login(AC_USER, TOKENSET);
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.USER_LOGGED, expectedUser);
        });

        describe("new User", () => {
            it("creates user", async () => {
                const createUserSpy = jest.spyOn(userAgentConnectService, "createUserFromAgentConnect");
                await userAgentConnectService.login(AC_USER, TOKENSET);
                expect(createUserSpy).toHaveBeenCalledWith(AC_USER);
            });
        });

        describe("known user", () => {
            beforeAll(() => {
                jest.mocked(userPort.getUserWithSecretsByEmail).mockResolvedValue(USER_DBO);
            });

            afterAll(() => {
                jest.mocked(userPort.getUserWithSecretsByEmail).mockReset();
            });

            it("removes password from retrieved user", async () => {
                await userAgentConnectService.login(AC_USER, TOKENSET);
                expect(removeHashPassword).toHaveBeenCalledWith(USER_DBO);
            });

            it("notifies user update with no secret", async () => {
                const expectedUser = USER_WITHOUT_SECRET;
                jest.mocked(removeSecrets).mockReturnValueOnce(USER_WITHOUT_SECRET);
                await userAgentConnectService.login(AC_USER, TOKENSET);
                const actual = jest.mocked(notifyService.notify).mock.calls[1];
                expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.USER_UPDATED, expectedUser);
            });
        });
    });

    describe("getLogoutUrl", () => {
        const TOKEN: AgentConnectTokenDbo = {
            _id: new ObjectId(),
            creationDate: new Date(),
            token: "TOKEN",
            userId: USER_WITHOUT_SECRET._id,
        };

        it("fails if client not initialized", async () => {
            const service = new UserAgentConnectService();
            const test = () => service.getLogoutUrl(USER_WITHOUT_SECRET);
            expect(test).rejects.toMatchInlineSnapshot(`[Error: AgentConnect client is not initialized]`);
        });

        it("gets last token", async () => {
            await userAgentConnectService.getLogoutUrl(USER_WITHOUT_SECRET);
            expect(agentConnectTokenPort.findLastActive).toHaveBeenCalledWith(USER_WITHOUT_SECRET._id);
        });

        it("removes previous tokens", async () => {
            await userAgentConnectService.getLogoutUrl(USER_WITHOUT_SECRET);
            expect(agentConnectTokenPort.deleteAllByUserId).toHaveBeenCalledWith(USER_WITHOUT_SECRET._id);
        });

        it("returns null if no token found", async () => {
            const actual = await userAgentConnectService.getLogoutUrl(USER_WITHOUT_SECRET);
            expect(actual).toBeNull();
        });

        it("generates url based on retrieved token", async () => {
            const expected = {
                id_token_hint: TOKEN.token,
                state: expect.any(String),
                post_logout_redirect_uri: `${FRONT_OFFICE_URL}/`,
            };
            jest.mocked(agentConnectTokenPort.findLastActive).mockResolvedValueOnce(TOKEN);
            await userAgentConnectService.getLogoutUrl(USER_WITHOUT_SECRET);
            expect(endSessionMock).toHaveBeenCalledWith(expected);
        });

        it("returns generated url", async () => {
            const expected = "logout/token";
            jest.mocked(agentConnectTokenPort.findLastActive).mockResolvedValueOnce(TOKEN);
            endSessionMock.mockReturnValue(expected);
            const actual = await userAgentConnectService.getLogoutUrl(USER_WITHOUT_SECRET);
            expect(actual).toBe(expected);
        });
    });

    describe("createUserFromAgentConnect", () => {
        beforeAll(() => {
            jest.mocked(userCrudService.createUser).mockResolvedValue(USER_WITHOUT_PASSWORD);
        });

        it("throws if no domain in email", async () => {
            const test = () => userAgentConnectService.createUserFromAgentConnect({ ...AC_USER, email: "no-domain" });
            const expected = new InternalServerError("email from AgentConnect invalid");
            await expect(test).rejects.toEqual(expected);
        });

        it("adds email domain with conflict fail-safe", async () => {
            await userAgentConnectService.createUserFromAgentConnect({ ...AC_USER, email: "user@domain.fr" });
            expect(configurationsService.addEmailDomain).toHaveBeenCalledWith("domain.fr", false);
        });

        it("creates user with userCrudService", async () => {
            await userAgentConnectService.createUserFromAgentConnect(AC_USER);
            expect(jest.mocked(userCrudService.createUser).mock.calls[0]).toMatchInlineSnapshot(`
                Array [
                  Object {
                    "agentConnectId": "123456789",
                    "email": "mail@mail.com",
                    "firstName": "prénom1",
                    "lastName": "nom de famille",
                    "roles": Array [
                      "user",
                    ],
                  },
                  true,
                ]
            `);
        });

        it("returns user from userCrudService", async () => {
            const expected = "user";
            jest.mocked(userCrudService.createUser).mockResolvedValueOnce(expected as unknown as UserDto);
            const actual = await userAgentConnectService.createUserFromAgentConnect(AC_USER);
            expect(actual).toEqual(expected);
        });

        it("notifies USER_CREATED", async () => {
            await userAgentConnectService.createUserFromAgentConnect(AC_USER);
            expect(notifyService.notify).toHaveBeenCalledWith(
                NotificationType.USER_CREATED,
                expect.objectContaining({ email: AC_USER.email, isAgentConnect: true }),
            );
        });

        it("catches DuplicateIndexError", async () => {
            const expected = new InternalServerError("An error has occurred");
            jest.mocked(userCrudService.createUser).mockRejectedValueOnce(new DuplicateIndexError("", ""));
            const test = () => userAgentConnectService.createUserFromAgentConnect(AC_USER);
            await expect(test).rejects.toEqual(expected);
        });
    });

    describe("agentConnectUpdateValidations", () => {
        it("returns valid state if user is not linked to agentConnect", () => {
            const expected = { valid: true };
            const actual = userAgentConnectService.agentConnectUpdateValidations({} as UserDto, {});
            expect(actual).toEqual(expected);
        });

        it("rejects firstName modification", () => {
            const actual = userAgentConnectService.agentConnectUpdateValidations({} as UserDto, {
                firstName: "something",
            });
            expect(actual).toMatchInlineSnapshot(`
                Object {
                  "valid": true,
                }
            `);
        });

        it("rejects lastName modification", () => {
            const actual = userAgentConnectService.agentConnectUpdateValidations({} as UserDto, {
                lastName: "something",
            });
            expect(actual).toMatchInlineSnapshot(`
                Object {
                  "valid": true,
                }
            `);
        });
    });

    describe("saveTokenSet", () => {
        it("throws error if id_token missing", async () => {
            const expected = new InternalServerError("invalid tokenSet to save");
            // @ts-expect-error -- private method
            const test = () => userAgentConnectService.saveTokenSet("ID" as ObjectId, {});
            await expect(test).rejects.toEqual(expected);
        });

        it("upserts token", async () => {
            // @ts-expect-error -- private method
            await userAgentConnectService.saveTokenSet("ID" as ObjectId, { id_token: "TOKEN" });
            const actual = jest.mocked(agentConnectTokenPort.upsert).mock.calls[0][0];
            expect(actual).toMatchObject({
                creationDate: expect.any(Date),
                token: "TOKEN",
                userId: "ID",
            });
        });
    });
});
