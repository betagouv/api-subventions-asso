import userProConnectService, { UserProConnectService } from "./user.pro-connect.service";
import {
    PRO_CONNECT_CLIENT_ID,
    PRO_CONNECT_CLIENT_SECRET,
    PRO_CONNECT_URL,
} from "../../../../configurations/pro-connect.conf";
import { ProConnectTokenDbo, ProConnectUser } from "../../@types/ProConnectUser";
import userAdapter from "../../../../adapters/outputs/db/user/user.adapter";
import userAuthService from "../auth/user.auth.service";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import { removeHashPassword, removeSecrets } from "../../../../shared/helpers/PortHelper";
import { USER_DBO, USER_WITHOUT_PASSWORD, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import proConnectTokenAdapter from "../../../../adapters/outputs/db/user/pro-connect.adapter";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";
import { ObjectId } from "mongodb";
import { DuplicateIndexError } from "../../../../shared/errors/dbError/DuplicateIndexError";
import configurationsService from "../../../configurations/configurations.service";
import userCrudService from "../crud/user.crud.service";
import { UserDto } from "dto";
import { InternalServerError } from "core";
import * as openidClient from "openid-client";

jest.mock("../../../../configurations/pro-connect.conf", () => ({
    PRO_CONNECT_CLIENT_ID: "mocked_client_id",
    PRO_CONNECT_CLIENT_SECRET: "mocked_client_secret",
    PRO_CONNECT_URL: "https://agent-connect/url",
}));
jest.mock("../../../../configurations/front.conf", () => ({
    FRONT_OFFICE_URL: "http://my.front",
}));
jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(), // I shouldn't have to do this but mocking didn't work
}));
jest.mock("../../../../shared/helpers/PortHelper");
jest.mock("../crud/user.crud.service");
jest.mock("../../../../adapters/outputs/db/user/user.adapter");
jest.mock("../../../../adapters/outputs/db/user/pro-connect.adapter");
jest.mock("../../../configurations/configurations.service");
jest.mock("../auth/user.auth.service");

describe("userProConnectService", () => {
    const AC_USER: ProConnectUser = {
        email: "mail@mail.com",
        given_name: "prénom1 prénom2",
        sub: "",
        uid: "123456789",
        usual_name: "nom de famille",
    };

    const TOKENSET = {
        id_token: "tokenHint",
    } as openidClient.TokenEndpointResponse;

    const CLIENT_SECRET_POST = () => "ClientAuth";
    const CONFIGURATION = { foo: "bar" };

    beforeEach(() => {
        jest.mocked(openidClient.ClientSecretPost).mockReturnValue(CLIENT_SECRET_POST);
        // @ts-expect-error: mock Configuration
        jest.mocked(openidClient.discovery).mockReturnValue(CONFIGURATION);
        userProConnectService.initClient();
    });

    describe("initClient", () => {
        it("discovers client", async () => {
            expect(openidClient.discovery).toHaveBeenCalledWith(
                new URL(PRO_CONNECT_URL),
                PRO_CONNECT_CLIENT_ID,
                {
                    client_secret: PRO_CONNECT_CLIENT_SECRET,
                    redirect_uris: [`${FRONT_OFFICE_URL}/auth/login`],
                    response_types: ["code"],
                    id_token_signed_response_alg: "ES256",
                    userinfo_signed_response_alg: "ES256",
                },
                CLIENT_SECRET_POST,
            );
        });

        it("initializes client", async () => {
            // @ts-expect-error: test private assignment
            expect(userProConnectService._client).toEqual(CONFIGURATION);
        });
    });

    describe("login", () => {
        beforeAll(() => {
            jest.mocked(userCrudService.createUser).mockResolvedValue({ ...USER_DBO, proConnectId: "acId" });
            jest.mocked(userAuthService.updateJwt).mockResolvedValue({ ...USER_DBO, proConnectId: "acId" });
        });
        afterAll(() => {
            jest.mocked(userCrudService.createUser).mockReset();
            jest.mocked(userAuthService.updateJwt).mockReset();
        });

        it("gets user from port", async () => {
            await userProConnectService.login(AC_USER, TOKENSET);
            expect(userAdapter.getUserWithSecretsByEmail).toHaveBeenCalledWith(AC_USER.email);
        });

        it("gets user from port with lowercase email", async () => {
            await userProConnectService.login({ ...AC_USER, email: AC_USER.email.toUpperCase() }, TOKENSET);
            expect(userAdapter.getUserWithSecretsByEmail).toHaveBeenCalledWith(AC_USER.email);
        });

        it("updates user's jwt", async () => {
            await userProConnectService.login(AC_USER, TOKENSET);
            expect(userAuthService.updateJwt).toHaveBeenCalled();
        });

        it("saves proConnect token", async () => {
            // @ts-expect-error -- spy private
            const saveTokenSpy = jest.spyOn(userProConnectService, "saveTokenSet");
            await userProConnectService.login(AC_USER, TOKENSET);
            expect(saveTokenSpy).toHaveBeenCalledWith(USER_DBO._id, TOKENSET);
        });

        it("notifies user login", async () => {
            const expectedUser = { email: USER_DBO.email, date: expect.any(Date) };
            await userProConnectService.login(AC_USER, TOKENSET);
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.USER_LOGGED, expectedUser);
        });

        describe("new User", () => {
            it("creates user", async () => {
                const createUserSpy = jest.spyOn(userProConnectService, "createUserFromProConnect");
                await userProConnectService.login(AC_USER, TOKENSET);
                expect(createUserSpy).toHaveBeenCalledWith(AC_USER);
            });
        });

        describe("known user", () => {
            beforeAll(() => {
                jest.mocked(userAdapter.getUserWithSecretsByEmail).mockResolvedValue(USER_DBO);
            });

            afterAll(() => {
                jest.mocked(userAdapter.getUserWithSecretsByEmail).mockReset();
            });

            it("removes password from retrieved user", async () => {
                await userProConnectService.login(AC_USER, TOKENSET);
                expect(removeHashPassword).toHaveBeenCalledWith(USER_DBO);
            });

            it("notifies user update with no secret", async () => {
                const expectedUser = USER_WITHOUT_SECRET;
                jest.mocked(removeSecrets).mockReturnValueOnce(USER_WITHOUT_SECRET);
                await userProConnectService.login(AC_USER, TOKENSET);
                expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.USER_UPDATED, expectedUser);
            });
        });
    });

    describe("getLogoutUrl", () => {
        const LOGOUT_URL = "https://app.auth/logout";
        // @ts-expect-error: mock URL
        beforeAll(() => jest.mocked(openidClient.buildEndSessionUrl).mockReturnValue(LOGOUT_URL));

        const TOKEN: ProConnectTokenDbo = {
            _id: new ObjectId(),
            creationDate: new Date(),
            token: "TOKEN",
            userId: USER_WITHOUT_SECRET._id,
        };

        const RANDOM_STRING = "RANDOM";

        it("fails if client not initialized", async () => {
            const service = new UserProConnectService();
            const test = () => service.getLogoutUrl(USER_WITHOUT_SECRET);
            expect(test).rejects.toMatchSnapshot();
        });

        it("gets last token", async () => {
            await userProConnectService.getLogoutUrl(USER_WITHOUT_SECRET);
            expect(proConnectTokenAdapter.findLastActive).toHaveBeenCalledWith(USER_WITHOUT_SECRET._id);
        });

        it("removes previous tokens", async () => {
            await userProConnectService.getLogoutUrl(USER_WITHOUT_SECRET);
            expect(proConnectTokenAdapter.deleteAllByUserId).toHaveBeenCalledWith(USER_WITHOUT_SECRET._id);
        });

        it("returns null if no token found", async () => {
            const actual = await userProConnectService.getLogoutUrl(USER_WITHOUT_SECRET);
            expect(actual).toBeNull();
        });

        it("generates url based on retrieved token", async () => {
            jest.mocked(proConnectTokenAdapter.findLastActive).mockResolvedValueOnce(TOKEN);
            jest.mocked(openidClient.randomState).mockReturnValue(RANDOM_STRING);
            await userProConnectService.getLogoutUrl(USER_WITHOUT_SECRET);
            expect(openidClient.buildEndSessionUrl).toHaveBeenCalledWith(CONFIGURATION, {
                id_token_hint: TOKEN.token,
                state: RANDOM_STRING,
                post_logout_redirect_uri: `${FRONT_OFFICE_URL}/`,
            });
        });

        it("returns generated url", async () => {
            const URL = { href: "logout/token" };
            const expected = URL.href;
            jest.mocked(proConnectTokenAdapter.findLastActive).mockResolvedValueOnce(TOKEN);
            // @ts-expect-error: mock URL
            jest.mocked(openidClient.buildEndSessionUrl).mockReturnValue(URL);
            const actual = await userProConnectService.getLogoutUrl(USER_WITHOUT_SECRET);
            expect(actual).toEqual(expected);
        });
    });

    describe("createUserFromProConnect", () => {
        beforeAll(() => {
            jest.mocked(userCrudService.createUser).mockResolvedValue(USER_WITHOUT_PASSWORD);
        });

        it("throws if no domain in email", async () => {
            const test = () => userProConnectService.createUserFromProConnect({ ...AC_USER, email: "no-domain" });
            const expected = new InternalServerError("email from ProConnect invalid");
            await expect(test).rejects.toEqual(expected);
        });

        it("do not add email domain", async () => {
            await userProConnectService.createUserFromProConnect({ ...AC_USER, email: "user@domain.fr" });
            expect(configurationsService.addEmailDomain).not.toHaveBeenCalled();
        });

        it("creates user with userCrudService", async () => {
            await userProConnectService.createUserFromProConnect(AC_USER);
            expect(jest.mocked(userCrudService.createUser).mock.calls[0]).toMatchSnapshot();
        });

        it("returns user from userCrudService", async () => {
            const expected = "user";
            jest.mocked(userCrudService.createUser).mockResolvedValueOnce(expected as unknown as UserDto);
            const actual = await userProConnectService.createUserFromProConnect(AC_USER);
            expect(actual).toEqual(expected);
        });

        it("notifies USER_CREATED", async () => {
            await userProConnectService.createUserFromProConnect(AC_USER);
            expect(notifyService.notify).toHaveBeenCalledWith(
                NotificationType.USER_CREATED,
                expect.objectContaining({ email: AC_USER.email, isProConnect: true }),
            );
        });

        it("catches DuplicateIndexError", async () => {
            const expected = new InternalServerError("An error has occurred");
            jest.mocked(userCrudService.createUser).mockRejectedValueOnce(new DuplicateIndexError("", ""));
            const test = () => userProConnectService.createUserFromProConnect(AC_USER);
            await expect(test).rejects.toEqual(expected);
        });
    });

    describe("proConnectUpdateValidations", () => {
        it("returns valid state if user is not linked to proConnect", () => {
            const expected = { valid: true };
            const actual = userProConnectService.proConnectUpdateValidations({} as UserDto, {});
            expect(actual).toEqual(expected);
        });

        it("rejects firstName modification", () => {
            const actual = userProConnectService.proConnectUpdateValidations({} as UserDto, {
                firstName: "something",
            });
            expect(actual).toMatchSnapshot();
        });

        it("rejects lastName modification", () => {
            const actual = userProConnectService.proConnectUpdateValidations({} as UserDto, {
                lastName: "something",
            });
            expect(actual).toMatchSnapshot();
        });
    });

    describe("saveTokenSet", () => {
        it("throws error if id_token missing", async () => {
            const expected = new InternalServerError("invalid tokenSet to save");
            // @ts-expect-error -- private method
            const test = () => userProConnectService.saveTokenSet("ID" as ObjectId, {});
            await expect(test).rejects.toEqual(expected);
        });

        it("upserts token", async () => {
            // @ts-expect-error -- private method
            await userProConnectService.saveTokenSet("ID" as ObjectId, { id_token: "TOKEN" });
            const actual = jest.mocked(proConnectTokenAdapter.upsert).mock.calls[0][0];
            expect(actual).toMatchObject({
                creationDate: expect.any(Date),
                token: "TOKEN",
                userId: "ID",
            });
        });
    });
});
