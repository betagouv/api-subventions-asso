import userAuthService from "./user.auth.service";
import { UserDto } from "dto";
import { ObjectId } from "mongodb";

import bcrypt from "bcrypt";
jest.mock("bcrypt");

import userRepository from "../../repositories/user.repository";
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
});
