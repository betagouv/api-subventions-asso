/* eslint-disable @typescript-eslint/no-unused-vars */
import * as express from "express";

import { expressAuthentication } from "../../src/authentication/authentication";
import jwt from "jsonwebtoken";
import userService, { UserServiceError } from "../../src/modules/user/user.service";
import userRepository from "../../src/modules/user/repositoies/user.repository";
import { ObjectId } from "mongodb";

describe("expressAuthentication", () => {

    // Spys
    const verifyMock = jest.spyOn(jwt, "verify");
    const findByEmailMock = jest.spyOn(userService, "findByEmail");
    const findJwtByEmailMock = jest.spyOn(userService, "findJwtByEmail");
    const findJwtMock = jest.spyOn(userRepository, "findJwt");
    const updateMock = jest.spyOn(userRepository, "update");
    const SPYS = [verifyMock, findByEmailMock, findByEmailMock, findJwtMock, updateMock];

    const DEFAULT_REQ = {
        body: {},
        query: {},
        headers: {
            "x-access-token": "token"
        } as unknown
    } as express.Request;
    const SECURITY_NAME = "jwt";
    const VERIFY_DEFAULT_MOCK = (_, __, cb: (err: null, d: unknown) => void) => {
        cb(null, { email: "test@beta.gouv.fr" })
    };
    const DEFAULT_TOKEN = DEFAULT_REQ.headers["x-access-token"] as string;

    let warn: jest.SpyInstance;
    beforeAll(() => {
        warn = jest.spyOn(console, 'warn').mockImplementation();
        findByEmailMock.mockImplementation((email) => Promise.resolve({ email, roles: ["user"], active: true, _id: new ObjectId() }))
        findJwtByEmailMock.mockImplementation(() => Promise.resolve({ success: true, jwt: { token: DEFAULT_TOKEN, expirateDate: new Date() } }))
        findJwtMock.mockImplementation(() => Promise.resolve({ token: DEFAULT_TOKEN, expirateDate: new Date() }))
        updateMock.mockImplementation((user) => Promise.resolve({ email: user.email, roles: ["user", "admin"], active: true, _id: new ObjectId() }))
        // @ts-expect-error: mock
        verifyMock.mockImplementation(VERIFY_DEFAULT_MOCK);
    });


    afterAll(() => {
        warn.mockRestore();
        SPYS.forEach(spy => spy.mockRestore());
    })

    it("should throw an error when security do not use JWT", () => {
        const req = {} as express.Request;
        expect(expressAuthentication(req, "NO_JWT_SECURITY")).rejects.toThrowError("Internal server error");
    });

    it("should throw an error when token not provided", () => {
        const req = {
            body: {},
            query: {},
            headers: {}
        } as express.Request;
        expect(expressAuthentication(req, SECURITY_NAME)).rejects.toThrowError("No token provided");
    });

    it("should throw error when token parsing failed", () => {
        // @ts-expect-error: mock
        verifyMock.mockImplementationOnce((_, __, cb: (err: boolean, d: unknown) => void) => { cb(true, {}) });

        const REQ_WITH_WRONG_TOKEN = {
            body: {},
            query: {},
            headers: {
                "x-access-token": "WRONG_TOKEN"
            } as unknown
        } as express.Request;

        expect(expressAuthentication(REQ_WITH_WRONG_TOKEN, SECURITY_NAME)).rejects.toThrowError("JWT parse error");
    });

    it("should throw an error when user is not found", async () => {
        findByEmailMock.mockImplementationOnce(async () => null);
        await expect(expressAuthentication(DEFAULT_REQ, SECURITY_NAME)).rejects.toThrowError("User not found");
    });

    it("should throw an error when JWT is not found", async () => {
        findJwtByEmailMock.mockImplementationOnce(async () => ({ success: false } as UserServiceError));
        await expect(expressAuthentication(DEFAULT_REQ, SECURITY_NAME)).rejects.toThrowError("JWT is not valid anymore");
    });

    it("should throw an error when JWT is not corresponding", async () => {
        const TOKEN = "NOT_CORRESPONDING_TOKEN";
        findJwtByEmailMock.mockImplementationOnce(() => Promise.resolve({ success: true, jwt: { token: TOKEN, expirateDate: new Date() } }))
        await expect(expressAuthentication(DEFAULT_REQ, SECURITY_NAME)).rejects.toThrowError("JWT is not valid anymore");
    });

    it("should throw an error when JWT has expired", async () => {
        findJwtByEmailMock.mockImplementationOnce(async () => ({ success: true, jwt: { token: DEFAULT_TOKEN, expirateDate: new Date(Date.now() - 1000 * 60 * 60 * 24) } }));
        await expect(expressAuthentication(DEFAULT_REQ, SECURITY_NAME)).rejects.toThrowError("JWT has expired, please login try again");
    });

    it("should throw an error when user role is not allowed", async () => {
        await expect(expressAuthentication(DEFAULT_REQ, SECURITY_NAME, ["admin"])).rejects.toThrowError("JWT does not contain required scope.");
    });

    it("should throw an error when user is not active", async () => {
        findByEmailMock.mockImplementationOnce((email) => Promise.resolve({ email, roles: ["user"], active: false, _id: new ObjectId() }))
        await expect(expressAuthentication(DEFAULT_REQ, SECURITY_NAME, ["admin"])).rejects.toThrowError("User is not active");
    });

    it("should validate user", async () => {
        findByEmailMock.mockImplementationOnce((email) => Promise.resolve({ email, roles: ["user", "admin"], active: true, _id: new ObjectId() }))
        await expect(expressAuthentication(DEFAULT_REQ, SECURITY_NAME, ["admin"])).resolves.toMatchObject({ email: "test@beta.gouv.fr", roles: ["user", "admin"], active: true })
    });
});
