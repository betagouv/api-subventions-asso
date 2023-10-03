/* eslint-disable @typescript-eslint/no-unused-vars */
import * as express from "express";

import { expressAuthentication } from "../../src/authentication/authentication";
import jwt from "jsonwebtoken";
import userService from "../../src/modules/user/user.service";
import userRepository from "../modules/user/repositories/user.repository";
import { ObjectId } from "mongodb";
import { LoginRequest } from "../@types";
import { RoleEnum } from "../@enums/Roles";
import { AgentTypeEnum } from "dto";
import userAuthService from "../modules/user/services/auth/user.auth.service";
jest.mock("../modules/user/services/auth/user.auth.service");
const mockedUserAuthService = jest.mocked(userAuthService, true);

describe("expressAuthentication", () => {
    // Spys
    const verifyMock = jest.spyOn(jwt, "verify");
    const refreshExpirationTokenMock = jest.spyOn(userService, "refreshExpirationToken");
    const findByEmailMock = jest.spyOn(userService, "findByEmail");
    const updateMock = jest.spyOn(userRepository, "update");
    const SPYS = [verifyMock, findByEmailMock, findByEmailMock, refreshExpirationTokenMock, updateMock];

    const DEFAULT_REQ = {
        body: {},
        query: {},
        headers: {
            "x-access-token": "token",
        } as unknown,
    } as express.Request;
    const SECURITY_NAME = "jwt";
    const VERIFY_DEFAULT_MOCK = (_, __, cb: (err: null, d: unknown) => void) => {
        cb(null, { email: "test@beta.gouv.fr" });
    };
    const DEFAULT_TOKEN = DEFAULT_REQ.headers["x-access-token"] as string;

    let warn: jest.SpyInstance;
    beforeAll(() => {
        warn = jest.spyOn(console, "warn").mockImplementation();
        refreshExpirationTokenMock.mockImplementation(jest.fn());
        findByEmailMock.mockImplementation(email =>
            Promise.resolve({
                email,
                roles: ["user"],
                active: true,
                signupAt: new Date(),
                _id: new ObjectId(),
                profileToComplete: false,
                agentType: AgentTypeEnum.CENTRAL_ADMIN,
                service: "",
                phoneNumber: "",
                jobType: [],
            }),
        );
        mockedUserAuthService.findJwtByEmail.mockImplementation(() =>
            Promise.resolve({
                jwt: { token: DEFAULT_TOKEN, expirateDate: new Date() },
            }),
        );
        updateMock.mockImplementation(user =>
            Promise.resolve({
                email: user.email || "email.domain.fr",
                roles: ["user", "admin"],
                active: true,
                signupAt: new Date(),
                _id: new ObjectId(),
                profileToComplete: false,
                agentType: AgentTypeEnum.CENTRAL_ADMIN,
                service: "",
                phoneNumber: "",
                jobType: [],
                hashPassword: "fqskfyqfdkq",
                jwt: { token: "dsdsgfd", expirateDate: new Date() },
            }),
        );
        // @ts-expect-error: mock
        verifyMock.mockImplementation(VERIFY_DEFAULT_MOCK);
    });

    afterAll(() => {
        warn.mockRestore();
        SPYS.forEach(spy => spy.mockRestore());
    });

    it("should throw an error when security do not use JWT", () => {
        const req = {} as LoginRequest;
        expect(expressAuthentication(req, "NO_JWT_SECURITY")).rejects.toThrowError("Internal server error");
    });

    it("should throw an error when token not provided", () => {
        const req = {
            body: {},
            query: {},
            headers: {},
        } as LoginRequest;
        expect(expressAuthentication(req, SECURITY_NAME)).rejects.toThrowError("User not logged");
    });

    it("should throw an error when user role is not allowed", async () => {
        const req = Object.assign({}, DEFAULT_REQ, {
            user: { roles: [RoleEnum.user] },
        }) as LoginRequest;
        await expect(expressAuthentication(req, SECURITY_NAME, [RoleEnum.admin])).rejects.toThrowError(
            "JWT does not contain required scope.",
        );
    });
});
