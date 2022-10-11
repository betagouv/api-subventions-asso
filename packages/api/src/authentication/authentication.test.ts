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
        findByEmailMock.mockImplementation((email) => Promise.resolve({ email, roles: ["user"], active: true, signupAt: new Date(), stats: { searchCount: 0, lastSearchDate: null } , _id: new ObjectId()}));
        findJwtByEmailMock.mockImplementation(() => Promise.resolve({ success: true, jwt: { token: DEFAULT_TOKEN, expirateDate: new Date() } }))
        findJwtMock.mockImplementation(() => Promise.resolve({ token: DEFAULT_TOKEN, expirateDate: new Date() }))
        updateMock.mockImplementation((user) => Promise.resolve({ email: user.email, roles: ["user", "admin"], active: true, signupAt: new Date(), stats: { searchCount: 0, lastSearchDate: null } , _id: new ObjectId() }))
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
        expect(expressAuthentication(req, SECURITY_NAME)).rejects.toThrowError("User not logged");
    });

    it("should throw an error when user role is not allowed", async () => {
        const req = Object.assign({}, DEFAULT_REQ, {user: { roles: ["user"]}})
        await expect(expressAuthentication(req, SECURITY_NAME, ["admin"])).rejects.toThrowError("JWT does not contain required scope.");
    });
});
