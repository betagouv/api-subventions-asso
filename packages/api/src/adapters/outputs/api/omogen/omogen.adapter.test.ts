import {
    OMOGEN_CLIENT,
    OMOGEN_API_KEY,
    OMOGEN_AUTH_URL,
    OMOGEN_SECRET,
    OMOGEN_URL,
} from "../../../../../jest.config.env";
import { ProviderRequestService } from "../../../../modules/provider-request/provider-request.service";
import { OmogenAdapter } from "./omogen.adapter";
import { OMOGEN_FILES } from "./omogen.fixtures";

describe("Omogen Adapter", () => {
    let adapter: OmogenAdapter;
    const ACCESS_TOKEN = "adndn24T;qd|";
    const TOKEN = "foo@bar";
    const mockPost = jest.fn().mockResolvedValue({ data: { access_token: ACCESS_TOKEN } });
    const mockGet = jest.fn().mockResolvedValue(OMOGEN_FILES);

    beforeEach(() => {
        adapter = new OmogenAdapter();
        // @ts-expect-error: set private
        adapter.token = TOKEN;
        // @ts-expect-error: mock
        adapter.http = {
            post: mockPost,
            get: mockGet,
        } as unknown as jest.Mocked<ProviderRequestService>;
    });

    describe("authHeader", () => {
        it("return Bearer Authorization header", () => {
            const expected = { Authorization: `Bearer ${TOKEN}` };
            // @ts-expect-error: test private method
            const actual = adapter.authHeader;
            expect(actual).toEqual(expected);
        });
    });

    describe("auth", () => {
        it("call omogen server through POST", async () => {
            // @ts-expect-error: test private method
            await adapter.auth();
            // @ts-expect-error: test protected field
            expect(adapter.http.post).toHaveBeenCalledWith(
                OMOGEN_AUTH_URL,
                new URLSearchParams({
                    grant_type: "client_credentials",
                    client_id: OMOGEN_CLIENT,
                    client_secret: OMOGEN_SECRET,
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "X-omogen-api-key": OMOGEN_API_KEY,
                    },
                },
            );
        });

        it("set token", async () => {
            // @ts-expect-error: test private method
            await adapter.auth();
            // @ts-expect-error: affect private property
            expect(adapter.token).toEqual(ACCESS_TOKEN);
        });
    });

    describe("ensureAuth", () => {
        const DATA = { foo: "bar" };
        const mockAuth = jest.fn();
        const mockCallback = jest.fn().mockResolvedValue({ data: DATA });
        beforeEach(() => {
            // @ts-expect-error: mock private method
            adapter.auth = mockAuth;
        });

        it("call auth() if token is not set", async () => {
            // @ts-expect-error: set private field
            adapter.token = undefined;
            // @ts-expect-error: test private method
            await adapter.ensureAuth(mockCallback);
            expect(mockAuth).toHaveBeenCalled();
        });

        it("calls callback if token is set", async () => {
            // @ts-expect-error: test private method
            await adapter.ensureAuth(mockCallback);
            expect(mockCallback).toHaveBeenCalled();
        });

        it("returns data", async () => {
            const expected = DATA;
            // @ts-expect-error: test private method
            const actual = await adapter.ensureAuth(mockCallback);
            expect(actual).toEqual(expected);
        });

        it("proceed to auth if callback returns 401", async () => {
            // @ts-expect-error: test private method
            await adapter.ensureAuth(
                jest
                    .fn()
                    .mockRejectedValueOnce({ response: { status: 401 } })
                    .mockResolvedValueOnce(DATA),
            );
            expect(mockAuth).toHaveBeenCalled();
        });
    });

    describe("list", () => {
        let mockEnsureAuth: jest.SpyInstance;
        beforeEach(() => {
            // @ts-expect-error: mock private getter
            jest.spyOn(adapter, "authHeader", "get").mockReturnValue({ Authorization: `Bearer TOKEN` });
            // @ts-expect-error: mock private method
            mockEnsureAuth = jest.spyOn(adapter, "ensureAuth").mockImplementation(fn => fn());
        });

        it("ensures authentication", async () => {
            await adapter.list();
            expect(mockEnsureAuth).toHaveBeenCalled();
        });

        it("calls omogen to list files", async () => {
            await adapter.list();
            expect(mockGet).toHaveBeenCalledWith(`${OMOGEN_URL}/flux`, {
                headers: {
                    // @ts-expect-error: access private getter
                    ...adapter.authHeader,
                    consommateur: "DATA-SUBVENTION",
                },
            });
        });
    });

    describe("get", () => {
        const ID = "A13GD";
        let mockEnsureAuth: jest.SpyInstance;
        beforeEach(() => {
            // @ts-expect-error: mock private getter
            jest.spyOn(adapter, "authHeader", "get").mockReturnValue({ Authorization: `Bearer TOKEN` });
            // @ts-expect-error: mock private method
            mockEnsureAuth = jest.spyOn(adapter, "ensureAuth").mockImplementation(fn => fn());
        });

        it("ensures authentication", async () => {
            await adapter.get(ID);
            expect(mockEnsureAuth).toHaveBeenCalled();
        });

        it("calls omogen to list files", async () => {
            await adapter.get(ID);
            expect(mockGet).toHaveBeenCalledWith(`${OMOGEN_URL}/flux/${ID}`, {
                responseType: "arraybuffer",
                headers: {
                    // @ts-expect-error: access private getter
                    ...adapter.authHeader,
                    consommateur: "DATA-SUBVENTION",
                },
            });
        });
    });
});
