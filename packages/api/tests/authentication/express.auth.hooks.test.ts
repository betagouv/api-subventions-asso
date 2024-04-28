import passport = require("passport");
import { Express } from "express";
import passportLocal = require("passport-local");
import passportJwt = require("passport-jwt");
import { registerAuthMiddlewares } from "../../src/authentication/express.auth.hooks";
import { ObjectId } from "mongodb";
import userAuthService from "../../src/modules/user/services/auth/user.auth.service";

describe("express.auth.hooks", () => {
    let passportMock: jest.SpyInstance;
    const ERROR = { message: "ERROR", code: 1 };
    const APP = { post: jest.fn(), use: jest.fn(), get: jest.fn() } as unknown as Express;

    beforeEach(() => {
        passportMock = jest.spyOn(passport, "use");
        jest.resetModules();

        Object.keys(require.cache).forEach(function (key) {
            delete require.cache[key];
        });
    });

    afterEach(() => {
        passportMock.mockReset();
    });

    describe("local", () => {
        it("Should log in user", done => {
            const obj: { [key: string]: unknown } = {};

            function strat(data: unknown, call: unknown) {
                obj.data = data;
                obj.callback = call;
            }

            jest.spyOn(passportLocal, "Strategy").mockImplementation(strat as any);
            // @ts-expect-error: mock user
            jest.spyOn(userAuthService, "login").mockImplementation(email =>
                Promise.resolve({
                    _id: new ObjectId(),
                    email,
                    roles: [],
                    active: true,
                    signupAt: new Date(),
                    jwt: { token: "", expirateDate: new Date() },
                    stats: { searchCount: 0, lastSearchDate: null },
                    profileToComplete: false,
                }),
            );

            passportMock.mockImplementation(name => {
                if (name != "login") return;

                (obj.callback as (...args: unknown[]) => void)("test@beta.gouv.fr", "AAA", (...args: unknown[]) => {
                    expect(args[1]).toMatchObject({ email: "test@beta.gouv.fr" });
                    done();
                });
            });

            registerAuthMiddlewares(APP);
        });

        it("Should not log user in", done => {
            const obj: { [key: string]: unknown } = {};

            function strat(data: unknown, call: unknown) {
                obj.data = data;
                obj.callback = call;
            }

            jest.spyOn(passportLocal, "Strategy").mockImplementation(strat as any);
            jest.spyOn(userAuthService, "login").mockRejectedValue(ERROR);

            passportMock.mockImplementation(name => {
                if (name !== "login") return;
                (obj.callback as (...args: unknown[]) => void)("test@beta.gouv.fr", "AAA", (...args: unknown[]) => {
                    expect(args[0]).toMatchObject(ERROR);
                    done();
                });
            });
            registerAuthMiddlewares(APP);
        });
    });

    describe("jwt", () => {
        it("Should log user in", done => {
            const obj: { [key: string]: unknown } = {};

            function strat(data: unknown, call: unknown) {
                obj.data = data;
                obj.callback = call;
            }

            jest.spyOn(passportJwt, "Strategy").mockImplementation(strat as any);
            // @ts-expect-error
            jest.spyOn(userAuthService, "authenticate").mockImplementation(async user => ({
                email: user.email,
                roles: [],
                active: true,
                signupAt: new Date(),
                jwt: { token: "", expirateDate: new Date() },
                stats: { searchCount: 0, lastSearchDate: null },
                profileToComplete: false,
                _id: new ObjectId(),
            }));

            passportMock.mockImplementation(name => {
                if (name === "login") return;

                (obj.callback as (...args: unknown[]) => void)(
                    { headers: { "x-access-token": "TOKEN" } },
                    { email: "test@beta.gouv.fr" },
                    (...args: unknown[]) => {
                        expect(args[1]).toMatchObject({ email: "test@beta.gouv.fr" });
                        done();
                    },
                );
            });

            registerAuthMiddlewares(APP);
        });

        it("Should not log user in", done => {
            const obj: { [key: string]: unknown } = {};

            function strat(data: unknown, call: unknown) {
                obj.data = data;
                obj.callback = call;
            }

            jest.spyOn(passportJwt, "Strategy").mockImplementation(strat as any);
            jest.spyOn(userAuthService, "authenticate").mockRejectedValue(ERROR);

            passportMock.mockImplementation(name => {
                if (name === "login") return;
                (obj.callback as (...args: unknown[]) => void)(
                    { headers: { "x-access-token": "TOKEN" } },
                    { email: "test@beta.gouv.fr" },
                    (...args: unknown[]) => {
                        expect(args[0]).toMatchObject(ERROR);
                        done();
                    },
                );
            });
            registerAuthMiddlewares(APP);
        });
    });
});
