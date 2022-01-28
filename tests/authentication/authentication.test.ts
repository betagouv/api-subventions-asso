/* eslint-disable @typescript-eslint/no-unused-vars */
import * as express from "express";

import { expressAuthentication } from "../../src/authentication/authentication";
import jwt from "jsonwebtoken";
import userService, {UserServiceError} from "../../src/modules/user/user.service";
import userRepository from "../../src/modules/user/repositoies/user.repository";

describe("expressAuthentication", () => {

    let warn: jest.SpyInstance;
    beforeEach(() => {
        warn = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
        warn.mockClear();
    })

    it("Should be reject because security not available", () => {
        const req = {} as express.Request;
        expect(expressAuthentication(req, "FAKE")).rejects.toThrowError("No security found");
    });

    it("Should be reject because no token provided", () => {
        const req = {
            body: {},
            query: {},
            headers: {}
        } as express.Request;
        expect(expressAuthentication(req, "jwt")).rejects.toThrowError("No token provided");
    });

    it("Should be reject because parse token error", () => {
        const req = {
            body: {},
            query: {},
            headers: {
                "x-access-token": "wrong token"
            } as unknown
        } as express.Request;
        expect(expressAuthentication(req, "jwt")).rejects.toThrowError("JWT parse error");
    });

    it("Should be reject because user not found", async () => {
        const req = {
            body: {},
            query: {},
            headers: {
                "x-access-token": "token"
            } as unknown
        } as express.Request;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(jwt, "verify").mockImplementationOnce((_, __, cb: (err: null, d: unknown) => void ) => {cb(null, { email: "<f<df"})})

        await expect(expressAuthentication(req, "jwt")).rejects.toThrowError("User not found");
    });

    it("Should be reject because JWT not found", async () => {
        const req = {
            body: {},
            query: {},
            headers: {
                "x-access-token": "token"
            } as unknown
        } as express.Request;

        jest.spyOn(userService, "findByEmail").mockImplementation((email) => Promise.resolve({email, roles: ["user"], active: true}))
        jest.spyOn(userService, "findJwtByEmail").mockImplementation((email) => Promise.resolve({success: false} as UserServiceError))

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(jwt, "verify").mockImplementationOnce((_, __, cb: (err: null, d: unknown) => void ) => {cb(null, { email: "test@beta.gouv.fr"})})

        await expect(expressAuthentication(req, "jwt")).rejects.toThrowError("JWT is not valid anymore");
    });

    it("Should be reject because JWT not corresponding", async () => {
        const req = {
            body: {},
            query: {},
            headers: {
                "x-access-token": "token"
            } as unknown
        } as express.Request;

        jest.spyOn(userService, "findByEmail").mockImplementation((email) => Promise.resolve({email, roles: ["user"], active: true}))
        jest.spyOn(userService, "findJwtByEmail").mockImplementation((email) => Promise.resolve({success: true, jwt: { token: "Wrong token", expirateDate: new Date()}}))

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(jwt, "verify").mockImplementationOnce((_, __, cb: (err: null, d: unknown) => void ) => {cb(null, { email: "test@beta.gouv.fr"})})

        await expect(expressAuthentication(req, "jwt")).rejects.toThrowError("JWT is not valid anymore");
    });

    it("Should be reject because JWT have expired", async () => {
        const req = {
            body: {},
            query: {},
            headers: {
                "x-access-token": "token"
            } as unknown
        } as express.Request;

        jest.spyOn(userService, "findByEmail").mockImplementation((email) => Promise.resolve({email, roles: ["user"], active: true}))
        jest.spyOn(userService, "findJwtByEmail").mockImplementation((email) => Promise.resolve({success: true, jwt: { token: "token", expirateDate: new Date(Date.now() - 1000* 60*60*24)}}))

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(jwt, "verify").mockImplementationOnce((_, __, cb: (err: null, d: unknown) => void ) => {cb(null, { email: "test@beta.gouv.fr"})})

        await expect(expressAuthentication(req, "jwt")).rejects.toThrowError("JWT has expired, please login try again");
    });

    it("Should be reject because user don't have a good roles", async () => {
        const req = {
            body: {},
            query: {},
            headers: {
                "x-access-token": "token"
            } as unknown
        } as express.Request;

        jest.spyOn(userService, "findByEmail").mockImplementation((email) => Promise.resolve({email, roles: ["user"], active: true}))
        jest.spyOn(userService, "findJwtByEmail").mockImplementation((email) => Promise.resolve({success: true, jwt: { token: "token", expirateDate: new Date()}}))

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(jwt, "verify").mockImplementationOnce((_, __, cb: (err: null, d: unknown) => void ) => {cb(null, { email: "test@beta.gouv.fr"})})

        await expect(expressAuthentication(req, "jwt", ["admin"])).rejects.toThrowError("JWT does not contain required scope.");
    });

    it("Should be reject because user is not active", async () => {
        const req = {
            body: {},
            query: {},
            headers: {
                "x-access-token": "token"
            } as unknown
        } as express.Request;

        jest.spyOn(userService, "findByEmail").mockImplementation((email) => Promise.resolve({email, roles: ["user"], active: false}))
        jest.spyOn(userService, "findJwtByEmail").mockImplementation((email) => Promise.resolve({success: true, jwt: { token: "token", expirateDate: new Date()}}))

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(jwt, "verify").mockImplementationOnce((_, __, cb: (err: null, d: unknown) => void ) => {cb(null, { email: "test@beta.gouv.fr"})})

        await expect(expressAuthentication(req, "jwt", ["admin"])).rejects.toThrowError("User is not active");
    });

    it("Should be validate user", async () => {
        const req = {
            body: {},
            query: {},
            headers: {
                "x-access-token": "token"
            } as unknown
        } as express.Request;

        jest.spyOn(userService, "findByEmail").mockImplementation((email) => Promise.resolve({email, roles: ["user", "admin"], active: true}))
        jest.spyOn(userService, "findJwtByEmail").mockImplementation((email) => Promise.resolve({success: true, jwt: { token: "token", expirateDate: new Date()}}))
        jest.spyOn(userRepository, "findJwt").mockImplementation(() => Promise.resolve({ token: "token", expirateDate: new Date()}))
        jest.spyOn(userRepository, "update").mockImplementation((user) => Promise.resolve({email: user.email, roles: ["user", "admin"], active: true}))

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(jwt, "verify").mockImplementationOnce((_, __, cb: (err: null, d: unknown) => void ) => {cb(null, { email: "test@beta.gouv.fr"})})

        await expect(expressAuthentication(req, "jwt", ["admin"])).resolves.toMatchObject({email: "test@beta.gouv.fr", roles: ["user", "admin"], active: true})
    });
});
