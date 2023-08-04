/* eslint-disable @typescript-eslint/no-explicit-any */
import passport = require("passport");
import { Express } from "express";
import passportLocal = require("passport-local");
import passportJwt = require("passport-jwt");
import userService from "../../src/modules/user/user.service";
import { authMocks } from "../../src/authentication/express.auth.hooks";
import { ObjectId } from "mongodb";

describe("express.auth.hooks", () => {
    let passportMock: jest.SpyInstance;
    const ERROR = { message: "ERROR", code: 1 };

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
            jest.spyOn(userService, "login").mockImplementation(email =>
                Promise.resolve({
                    _id: new ObjectId(),
                    email,
                    roles: [],
                    active: true,
                    signupAt: new Date(),
                    jwt: { token: "", expirateDate: new Date() },
                    stats: { searchCount: 0, lastSearchDate: null },
                    profileCompleted: true,
                }),
            );

            passportMock.mockImplementation(name => {
                if (name != "login") return;

                (obj.callback as (...args: unknown[]) => void)("test@beta.gouv.fr", "AAA", (...args: unknown[]) => {
                    expect(args[1]).toMatchObject({ email: "test@beta.gouv.fr" });
                    done();
                });
            });

            authMocks({ post: jest.fn(), use: jest.fn() } as unknown as Express);
        });

        it("Should not log user in", done => {
            const obj: { [key: string]: unknown } = {};

            function strat(data: unknown, call: unknown) {
                obj.data = data;
                obj.callback = call;
            }

            jest.spyOn(passportLocal, "Strategy").mockImplementation(strat as any);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            jest.spyOn(userService, "login").mockRejectedValue(ERROR);

            passportMock.mockImplementation(name => {
                if (name !== "login") return;
                (obj.callback as (...args: unknown[]) => void)("test@beta.gouv.fr", "AAA", (...args: unknown[]) => {
                    expect(args[0]).toMatchObject(ERROR);
                    done();
                });
            });
            authMocks({ post: jest.fn(), use: jest.fn() } as unknown as Express);
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
            jest.spyOn(userService, "authenticate").mockImplementation(async user => ({
                email: user.email,
                roles: [],
                active: true,
                signupAt: new Date(),
                jwt: { token: "", expirateDate: new Date() },
                stats: { searchCount: 0, lastSearchDate: null },
                profileCompleted: true,
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

            authMocks({ post: jest.fn(), use: jest.fn() } as unknown as Express);
        });

        it("Should not log user in", done => {
            const obj: { [key: string]: unknown } = {};

            function strat(data: unknown, call: unknown) {
                obj.data = data;
                obj.callback = call;
            }

            jest.spyOn(passportJwt, "Strategy").mockImplementation(strat as any);
            jest.spyOn(userService, "authenticate").mockRejectedValue(ERROR);

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
            authMocks({ post: jest.fn(), use: jest.fn() } as unknown as Express);
        });
    });
});
