import userAuthService from "./user.auth.service";
import { UserDto } from "dto";
import { ObjectId } from "mongodb";
import { JWT_EXPIRES_TIME } from "../../../../configurations/jwt.conf";
import bcrypt from "bcrypt";
jest.mock("bcrypt");
import jwt from "jsonwebtoken";
jest.mock("jwt");

import userRepository from "../../repositories/user.repository";
import { USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
jest.mock("../../repositories/user.repository");

describe("user auth service", () => {
    const USER_ID = new ObjectId();
    const PASSWORD = "PAssWoRD135!&";

    describe("getHashPassword", () => {
        it("should call bcrypt.hash", async () => {
            await userAuthService.getHashPassword(PASSWORD);
            expect(bcrypt.hash).toHaveBeenCalledWith(PASSWORD, 10);
        });
    });

    describe("findJwtByUser", () => {
        it("should call userRepository", async () => {
            await userAuthService.findJwtByUser({ _id: USER_ID } as UserDto);
            expect(userRepository.getUserWithSecretsById).toHaveBeenCalledWith(USER_ID);
        });
    });

    describe("buildJWTToken", () => {
        it("should set expiresIn", () => {
            const expected = {
                expiresIn: JWT_EXPIRES_TIME,
            };
            userAuthService.buildJWTToken(USER_WITHOUT_SECRET, { expiration: true });
            expect(jwt.sign).toHaveBeenCalledWith(
                { ...USER_WITHOUT_SECRET, now: new Date() },
                expect.any(String),
                expected,
            );
        });

        it("should not set expiresIn", () => {
            const expected = {};
            userAuthService.buildJWTToken(USER_WITHOUT_SECRET, { expiration: false });
            expect(jwt.sign).toHaveBeenCalledWith(
                { ...USER_WITHOUT_SECRET, now: new Date() },
                expect.any(String),
                expected,
            );
        });
    });
});
