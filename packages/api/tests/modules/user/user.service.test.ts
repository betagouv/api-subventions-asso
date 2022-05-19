import { ObjectId } from "mongodb";
import { UserWithoutSecret } from "../../../src/modules/user/entities/User";
import UserReset from "../../../src/modules/user/entities/UserReset";
import userResetRepository from "../../../src/modules/user/repositoies/user-reset.repository";
import userRepository from "../../../src/modules/user/repositoies/user.repository";
import userService, { UserServiceErrors } from "../../../src/modules/user/user.service";

describe("user.service.ts", () => {
    describe("login", () => {
        beforeEach(async () => {
            await userService.createUser("test@beta.gouv.fr")
        });

        it("should be reject because user not found", async () => {
            await expect(userService.login("testAA@beta.gouv.fr", "")).resolves.toMatchObject({ success: false, message: "User not found", code: UserServiceErrors.USER_NOT_FOUND})
        });

        it("should be reject because password dont match", async () => {
            await userService.activeUser("test@beta.gouv.fr");
            await expect(userService.login("test@beta.gouv.fr", "")).resolves.toMatchObject({ success: false, message: "Password does not match", code: UserServiceErrors.LOGIN_WRONG_PASSWORD_MATCH})
        });

        it("should be reject because user is not active", async () => {
            await expect(userService.login("test@beta.gouv.fr", "TMP_PASSWOrd;12345678")).resolves.toMatchObject({ success: false, message:"User is not active", code: UserServiceErrors.USER_NOT_ACTIVE});
        });

        it("should be reject because user dont have jwt", async () => {
            jest.spyOn(userRepository, "findJwt").mockImplementationOnce(() => Promise.resolve(null))
            await expect(userService.login("test@beta.gouv.fr", "TMP_PASSWOrd;12345678")).resolves.toMatchObject({ success: false, message:"User is not active", code: UserServiceErrors.USER_NOT_ACTIVE});
        });

        it("should be retrun user", async () => {
            await userService.activeUser("test@beta.gouv.fr");
            await expect(userService.login("test@beta.gouv.fr", "TMP_PASSWOrd;12345678")).resolves.toMatchObject({ success: true, user: { email: "test@beta.gouv.fr", active: true}});
        });

        it("should be update token", async () => {
            await userService.activeUser("test@beta.gouv.fr");

            const jwt = { token: "", expirateDate: new Date(Date.now() - 1000* 60*60*24)};
            jest.spyOn(userRepository, "findJwt").mockImplementationOnce(() => Promise.resolve(jwt))
            const mock = jest.spyOn(userRepository, "update");

            await expect(userService.login("test@beta.gouv.fr", "TMP_PASSWOrd;12345678")).resolves.toMatchObject({ success: true, user: { email: "test@beta.gouv.fr", active: true}});
            expect(mock).not.toHaveBeenCalledWith(expect.objectContaining({jwt}))
        });
    });

    describe("findByEmail", () => {
        beforeEach(async () => {
            await userService.createUser("test@beta.gouv.fr")
        });

        it("should be return user", async () => {
            await expect(userService.findByEmail("test@beta.gouv.fr")).resolves.toMatchObject({ email: "test@beta.gouv.fr" });
        });
        it("should be return null", async () => {
            await expect(userService.findByEmail("testAA@beta.gouv.fr")).resolves.toBe(null);
        });
    });

    describe("createUser", () => {

        it("should reject because email is not valid", async () => {
            await expect(userService.createUser("test[at]beta.gouv.fr")).resolves.toMatchObject({ success: false, message: "Email is not valid", code: UserServiceErrors.CREATE_INVALID_EMAIL });
        });
        it("should be reject because user already exist", async () => {
            await userService.createUser("test@beta.gouv.fr")
            await expect(userService.createUser("test@beta.gouv.fr")).resolves.toMatchObject({ success: false, message: "User is already exist", code: UserServiceErrors.CREATE_USER_ALREADY_EXIST });
        });
        it("should be reject because password is not valid", async () => {
            await expect(userService.createUser("test@beta.gouv.fr", "aa")).resolves.toMatchObject(
                {
                    success: false, 
                    message: 
                    `Password is not hard, please use this rules:
    At least one digit [0-9]
    At least one lowercase character [a-z]
    At least one uppercase character [A-Z]
    At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\\]
    At least 8 characters in length, but no more than 32.
                    `,
                    code: UserServiceErrors.FORMAT_PASSWORD_INVALID
                }
            );
        });

        it("should be return created user", async () => {
            await expect(userService.createUser("test@beta.gouv.fr")).resolves.toMatchObject({ success: true, user: { email: "test@beta.gouv.fr", active: false, roles: ["user"] } });
        });
    });

    describe("addUsersByCsv", () => {
        const csv = `test@beta.gouv.fr;\ntest2@beta.gouv.fr;`;
        const buffer = Buffer.from(csv);

        it("should call createUsersByList with 2 email", async() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const mock = jest.spyOn(userService, "createUsersByList").mockImplementationOnce(() => null);

            await userService.addUsersByCsv(buffer);

            expect(mock).toHaveBeenCalledWith(["test@beta.gouv.fr", "test2@beta.gouv.fr"]);
            mock.mockClear();
        })
    })

    describe("createUsersByList", () => {

        it("should create two users", async() => {

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const result = await userService.createUsersByList(["test@beta.gouv.fr", "test2@beta.gouv.fr"]);
            expect(result).toHaveLength(2);
            expect(result.every(r => r.success)).toBe(true);
        });

        it("should create one user and reject one other user", async() => {

            await userService.createUser("test@beta.gouv.fr");
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const result = await userService.createUsersByList(["test@beta.gouv.fr", "test2@beta.gouv.fr"]);
            expect(result).toHaveLength(2);
            expect(result.filter(r => r.success)).toHaveLength(1);
            expect(result.filter(r => !r.success)).toHaveLength(1);
        });
    });

    describe("addRolesToUser", () => {
        beforeEach(async () => {
            await userService.createUser("test@beta.gouv.fr")
        });

        it("should be reject because user email not found", async () => {
            await expect(userService.addRolesToUser("wrong@email.fr", ["admin"])).resolves.toMatchObject({ success: false, message: "User email does not correspond to a user", code: UserServiceErrors.USER_NOT_FOUND})
        })

        it("should be reject because role not found", async () => {
            await expect(userService.addRolesToUser("test@beta.gouv.fr", ["CHEF"])).resolves.toMatchObject({ success: false, message: `The role "CHEF" does not exist`, code: UserServiceErrors.ROLE_NOT_FOUND })
        })

        it("should be update user (called with email)", async () => {
            await expect(userService.addRolesToUser("test@beta.gouv.fr", ["admin"])).resolves.toMatchObject({ success: true, user: { roles: ['user', "admin"]}});
        })

        it("should be update user (called with user)", async () => {
            const user = await userService.findByEmail("test@beta.gouv.fr") as UserWithoutSecret;
            await expect(userService.addRolesToUser(user, ["admin"])).resolves.toMatchObject({ success: true, user: { roles: ['user', "admin"]}});
        })
    })

    describe("activeUser", () => {
        beforeEach(async () => {
            await userService.createUser("test@beta.gouv.fr")
        });

        it("should be reject because user email not found", async () => {
            await expect(userService.activeUser("wrong@email.fr")).resolves.toMatchObject({ success: false, message: "User email does not correspond to a user", code: UserServiceErrors.USER_NOT_FOUND})
        })

        it("should be update user (called with email)", async () => {
            await expect(userService.activeUser("test@beta.gouv.fr")).resolves.toMatchObject({ success: true, user: { active: true}});
        })

        it("should be update user (called with user)", async () => {
            const user = await userService.findByEmail("test@beta.gouv.fr") as UserWithoutSecret;
            await expect(userService.activeUser(user)).resolves.toMatchObject({ success: true, user: { active: true}});
        })
    })

    describe("refrechExpirationToken", () => {
        beforeEach(async () => {
            await userService.createUser("test@beta.gouv.fr")
        });

        it("should be update user (called with user)", async () => {
            const user = await userService.findByEmail("test@beta.gouv.fr") as UserWithoutSecret;
            const mock = jest.spyOn(userRepository, "update")
            await userService.refrechExpirationToken(user);

            expect(mock).toHaveBeenCalled();
        })
    })

    describe("resetPassword", () => {
        let userId: ObjectId;
        beforeEach(async () => {
            const result = await userService.createUser("test@beta.gouv.fr");

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (!result.success) throw new Error(result.message);
            userId = result.user._id
            await userResetRepository.create(new UserReset(userId, "token", new Date()));
        });

        it("should reject because resetToken not found", async () => {
            await expect(userService.resetPassword("", "FAKE_TOKEN")).resolves.toMatchObject({ success: false, message: "Reset token not found", code: UserServiceErrors.RESET_TOKEN_NOT_FOUND });
        })

        it("should reject because resetToken not found", async () => {
            await userResetRepository.removeAllByUserId(userId);
            await userResetRepository.create(new UserReset(userId, "token", new Date(Date.now() - 1000* 60*60 * 24 * 11)));

            await expect(userService.resetPassword("", "token")).resolves.toMatchObject({ success: false, message: "Reset token has expired, please retry forget password", code: UserServiceErrors.RESET_TOKEN_EXPIRED });
        })


        it("should reject because user not found", async () => {
            await userResetRepository.removeAllByUserId(userId);
            await userResetRepository.create(new UserReset(new ObjectId(), "token", new Date()));

            await expect(userService.resetPassword("", "token")).resolves.toMatchObject({ success: false, message: "User not found", code: UserServiceErrors.USER_NOT_FOUND});
        })

        it("should reject because password not valid", async () => {

            await expect(userService.resetPassword("", "token")).resolves.toMatchObject({
                success: false, 
                message: `Password is not hard, please use this rules:
                        At least one digit [0-9]
                        At least one lowercase character [a-z]
                        At least one uppercase character [A-Z]
                        At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\\]
                        At least 8 characters in length, but no more than 32.
                    `,
                code: UserServiceErrors.FORMAT_PASSWORD_INVALID
            }
            );
        })

        it("should change password", async () => {
            await expect(userService.resetPassword("newPass;word789", "token")).resolves.toMatchObject({success: true, user: {email: "test@beta.gouv.fr", active: true}});
        })

        it("should remove resetUser", async () => {
            const mock = jest.spyOn(userResetRepository, "remove");
            await userService.resetPassword("newPass;word789", "token");
            expect(mock).toHaveBeenCalledWith(expect.objectContaining({ userId: expect.any(ObjectId)}))
        })
    });

    describe("forgetPassword", () => {

        let userId: ObjectId;
        beforeEach(async () => {
            const result = await userService.createUser("test@beta.gouv.fr");

            if (!result.success) throw new Error("User create faild");

            userId = result.user._id;
        });

        it("should be reject because user email not found", async () => {
            await expect(userService.forgetPassword("wrong@email.fr")).resolves.toMatchObject({ success: false, message: "User not found", code: UserServiceErrors.USER_NOT_FOUND})
        })


        it("should be update user (called with user)", async () => {
            await expect(userService.forgetPassword("test@beta.gouv.fr")).resolves.toMatchObject({ success: true, reset: { userId: userId }});
        })
    })

    describe("resetUser", () => {
        let user: UserWithoutSecret;
        beforeEach(async () => {
            const result = await userService.createUser("test@beta.gouv.fr");
            if (!result.success) throw new Error("USER is not created");
            user = result.user
        });

        it("should be create a reset user", async () => {
            const mockRemoveAll = jest.spyOn(userResetRepository, "removeAllByUserId");
            const mockCreate = jest.spyOn(userResetRepository, "create");
            const mockUpdate = jest.spyOn(userRepository, "update");

            await expect(userService.resetUser(user)).resolves.toMatchObject({ success: true, reset: { userId: user._id }});
            expect(mockRemoveAll).toHaveBeenCalledWith(user._id);
            expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({userId: user._id}));
            expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ active: false}));
        });
    });

    describe("findJwtByEmail", () => {
        beforeEach(async () => {
            await userService.createUser("test@beta.gouv.fr")
        });

        it("should be reject because user email not found", async () => {
            await expect(userService.findJwtByEmail("wrong@email.fr")).resolves.toMatchObject({ success: false, message: "User not found", code: UserServiceErrors.USER_NOT_FOUND})
        })
        it("should be reject because jwt not found", async () => {
            jest.spyOn(userRepository, "findJwt").mockImplementationOnce(() => Promise.resolve(null))
            await expect(userService.findJwtByEmail("test@beta.gouv.fr")).resolves.toMatchObject({ success: false, message: "User is not active", code: UserServiceErrors.USER_NOT_ACTIVE });
        })

        it("should be return jwt", async () => {
            await expect(userService.findJwtByEmail("test@beta.gouv.fr")).resolves.toMatchObject({ success: true, jwt: { token: expect.stringContaining(''), expirateDate: expect.any(Date)}})
        });
    });

    describe('passwordValidator', () => {
        it("should be reject beause no number in password", () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(userService.passwordValidator('AAAAAAAaaaaaa;;;;')).toBe(false);
        });

        it("should be reject beause no char (Uppercase) in password", () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(userService.passwordValidator('11111aaaaaa;;;;')).toBe(false);
        });

        it("should be reject beause no char (Lowercase) in password", () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(userService.passwordValidator('11111AAAAA;;;;')).toBe(false);
        });

        it("should be reject beause no special char in password", () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(userService.passwordValidator('11111AAAAAaaaaaa')).toBe(false);
        });

        it("should be reject beause length is to short in password", () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(userService.passwordValidator('Aa1;')).toBe(false);
        });

        it("should be reject beause length is to big in password", () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(userService.passwordValidator('Aa1;aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')).toBe(false);
        });

        it("should be accept", () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(userService.passwordValidator('SUPER;test::12345678')).toBe(true);
        });
    });
});