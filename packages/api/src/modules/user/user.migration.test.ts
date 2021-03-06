import { WithId } from "mongodb";
import { DefaultObject } from "../../@types";
import { UserWithoutSecret } from "./entities/User";
import UserReset from "./entities/UserReset";
import UserMigrations, { EmailToLowerCaseAction } from "./user.migrations";
import userService from "./user.service";

describe("UserMigration", () => {
    const userMigration = new UserMigrations();

    describe("migrationUserEmailToLowerCase", () => {
        const usersFindMock = jest.spyOn(userService, "find");
        // @ts-expect-error toLowerCaseUsers is private method
        const toLowerCaseUsersMock: jest.SpyInstance<UserWithoutSecret[]> = jest.spyOn(userMigration, "toLowerCaseUsers");
        // @ts-expect-error toLowerCaseUsers is private method
        const groupUsersByEmailMock: jest.SpyInstance<DefaultObject<UserWithoutSecret[]>> = jest.spyOn(userMigration, "groupUsersByEmail");
        // @ts-expect-error toLowerCaseUsers is private method
        const findUsersActionMock: jest.SpyInstance = jest.spyOn(userMigration, "findUsersAction");

        const userServiceUpdateMock = jest.spyOn(userService, "update");
        const userServiceDeleteMock = jest.spyOn(userService, "delete");

        it("should update user", async () => {
            userServiceUpdateMock.mockImplementationOnce((user) => Promise.resolve({user, success: true}))
            findUsersActionMock.mockImplementationOnce(async (users) => users.map((user: UserWithoutSecret) => ({ action: EmailToLowerCaseAction.UPDATE, user })))
            usersFindMock.mockImplementationOnce(async () => [{email: "test@datasubvention.beta.gou.fr"} as unknown as WithId<UserWithoutSecret>]);
            toLowerCaseUsersMock.mockImplementationOnce((a: UserWithoutSecret[]) => a);
            groupUsersByEmailMock.mockImplementationOnce((users) => {
                return {
                    [users[0].email]: [ users[0] as UserWithoutSecret ] 
                }
            })
        
            await userMigration.migrationUserEmailToLowerCase();

            const expected = "test@datasubvention.beta.gou.fr";

            expect(userServiceUpdateMock).toBeCalledWith(expect.objectContaining({email: expected}))
        })

        it("should delete user", async () => {
            userServiceDeleteMock.mockImplementationOnce((user) => Promise.resolve({user, success: true}))
            findUsersActionMock.mockImplementationOnce(async (users) => users.map((user: UserWithoutSecret) => ({ action: EmailToLowerCaseAction.DELETE, user })))
            usersFindMock.mockImplementationOnce(async () => [{email: "test@datasubvention.beta.gou.fr"} as unknown as WithId<UserWithoutSecret>]);
            toLowerCaseUsersMock.mockImplementationOnce((a: UserWithoutSecret[]) => a);
            groupUsersByEmailMock.mockImplementationOnce((users) => {
                return {
                    [users[0].email]: [ users[0] as UserWithoutSecret ] 
                }
            })
        
            await userMigration.migrationUserEmailToLowerCase();

            const expected = "test@datasubvention.beta.gou.fr";

            expect(userServiceDeleteMock).toBeCalledWith(expect.objectContaining({email: expected}))
        })
    })

    describe("groupUsersByEmail", () => {
        it('should be return grouped emails', () => {
            const users = [
                {
                    email: "test@beta"
                },
                {
                    email: "test@beta"
                },
                {
                    email: "test@beta"
                },
                {
                    email: "othertest@beta"
                }
            ];

            const expected = {
                "test@beta": [
                    users[0], users[1], users[2],
                ],
                "othertest@beta": [
                    users[3]
                ]
            }

            // @ts-expect-error groupUsersByEmail is private methods
            const actual = userMigration.groupUsersByEmail(users);

            expect(actual).toEqual(expected);
        });
    });

    describe("groupUsersByStatus", () => {
        it('should be return grouped emails', () => {
            const users = [
                {
                    email: "test@beta",
                    active: true,
                },
                {
                    email: "test@beta",
                    active: false,
                },
                {
                    email: "test@beta",
                    active: false,
                },
            ];

            const expected = {
                actived: [
                    users[0],
                ],
                unactived: [
                    users[1],
                    users[2],
                ]
            }

            // @ts-expect-error groupUsersByStatus is private methods
            const actual = userMigration.groupUsersByStatus(users);

            expect(actual).toEqual(expected);
        });
    });

    describe("toLowerCaseUsers", () => {
        
        it("should return users email in lower case", () => {
            const users = [
                {
                    email: "Test@beta",
                },
                {
                    email: "Test2@beta",
                },
                {
                    email: "test3@beta",
                },
            ];

            const expected = [
                {
                    email: "test@beta",
                },
                {
                    email: "test2@beta",
                },
                {
                    email: "test3@beta",
                },
            ];

            // @ts-expect-error toLowerCaseUsers is private methods
            const actual = userMigration.toLowerCaseUsers(users);

            expect(actual).toEqual(expected)
        });
    });

    describe("findUsersAction", () => {
        // @ts-expect-error groupUsersByStatus is private methods
        const groupUsersByStatusMock: jest.SpyInstance<DefaultObject<UserWithoutSecret[]>> = jest.spyOn(userMigration, "groupUsersByStatus");
        // @ts-expect-error findLastConnectedUser is private methods
        const findLastConnectedUserMock: jest.SpyInstance<UserWithoutSecret> = jest.spyOn(userMigration, "findLastConnectedUser");
        // @ts-expect-error findLastCreatedUser is private methods
        const findLastCreatedUserMock: jest.SpyInstance<UserWithoutSecret> = jest.spyOn(userMigration, "findLastCreatedUser");

        it("should return update user (because one user send)", async () => {
            const users = [{name: "TEST"} as unknown as UserWithoutSecret];

            const expected = [
                {
                    user: users[0],
                    action: EmailToLowerCaseAction.UPDATE
                }
            ]

            // @ts-expect-error findUsersAction is private methods
            const actual = await userMigration.findUsersAction(users);

            expect(actual).toEqual(expected);
        })

        it("should return one update user and one delete user (updated user active)", async () => {
            const users = [
                {
                    name: "USER A",
                },
                {
                    name: "USER B"
                }
            ];
            groupUsersByStatusMock.mockImplementationOnce((users: UserWithoutSecret[]) => ({ actived: [users[0]], unactived: [users[1]]}));
            findLastConnectedUserMock.mockImplementationOnce((users: UserWithoutSecret[]) => users[0]);

            const expected = [
                {
                    user: users[0],
                    action: EmailToLowerCaseAction.UPDATE
                },
                {
                    user: users[1],
                    action: EmailToLowerCaseAction.DELETE
                }
            ];

            // @ts-expect-error findUsersAction is private methods
            const actual = await userMigration.findUsersAction(users);

            expect(actual).toEqual(expected);
        })

        it("should return one update user and one delete user (no users actived)", async () => {
            const users = [
                {
                    name: "USER A",
                },
                {
                    name: "USER B"
                }
            ];
            groupUsersByStatusMock.mockImplementationOnce((users: UserWithoutSecret[]) => ({ actived: [], unactived: [users[0], users[1]]}));
            findLastCreatedUserMock.mockImplementationOnce((users: UserWithoutSecret[]) => users[0]);

            const expected = [
                {
                    user: users[0],
                    action: EmailToLowerCaseAction.UPDATE
                },
                {
                    user: users[1],
                    action: EmailToLowerCaseAction.DELETE
                }
            ];

            // @ts-expect-error findUsersAction is private methods
            const actual = await userMigration.findUsersAction(users);

            expect(actual).toEqual(expected);
        })
    })

    describe("findLastCreatedUser", () => {
        const findUserResetByUserIdMock = jest.spyOn(userService, "findUserResetByUserId");

        beforeEach(() => {
            findUserResetByUserIdMock.mockReset();
        })

        it("should return last reset user", async () => {
            const users = [
                {
                    _id: "userId1"
                },
                {
                    _id: "userId2"
                },
            ] as unknown as UserWithoutSecret[];
            const resets: DefaultObject = {
                [users[0]._id.toString()]: {
                    userId: users[0]._id,
                    createdAt: new Date(),
                },
                [users[1]._id.toString()]: {
                    userId: users[1]._id,
                    createdAt: new Date(2020,9,9),
                }
            };
            findUserResetByUserIdMock.mockImplementation(async (userId) => resets[userId.toString()] as unknown as WithId<UserReset>);

            const expected = users[0];
            // @ts-expect-error findLastCreatedUser is private methods
            const actual = await userMigration.findLastCreatedUser(users);

            expect(actual).toBe(expected);
        })
    })

    describe("findLastConnectedUser", () => {
        const findJwtByUserMock = jest.spyOn(userService, "findJwtByUser");

        beforeEach(() => {
            findJwtByUserMock.mockReset();
        })

        it("should return last reset user", async () => {
            const users = [
                {
                    _id: "userId1"
                },
                {
                    _id: "userId2"
                },
            ] as unknown as UserWithoutSecret[];
            const tokens: DefaultObject<{ token: string, expirateDate: Date}> = {
                [users[0]._id.toString()]: {
                    token: "",
                    expirateDate: new Date(),
                },
                [users[1]._id.toString()]: {
                    token: "",
                    expirateDate: new Date(2020,9,9),
                }
            };
            findJwtByUserMock.mockImplementation(async (user) => tokens[user._id.toString()]);

            const expected = users[0];
            // @ts-expect-error findLastConnectedUser is private methods
            const actual = await userMigration.findLastConnectedUser(users);

            expect(actual).toBe(expected);
        })
    })
});