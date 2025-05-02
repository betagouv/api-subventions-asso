import { UserDto } from "dto";
import { ObjectId, WithId } from "mongodb";
import { DefaultObject } from "../../@types";
import UserReset from "./entities/UserReset";
import UserMigrations, { EmailToLowerCaseAction } from "./user.migrations";
import userAuthService from "./services/auth/user.auth.service";
import userActivationService from "./services/activation/user.activation.service";
jest.mock("./services/auth/user.auth.service");
const mockedUserAuthService = jest.mocked(userAuthService, { shallow: true });
import userCrudService from "./services/crud/user.crud.service";
jest.mock("./services/crud/user.crud.service");
const mockedUserCrudService = jest.mocked(userCrudService);

describe("UserMigration", () => {
    const userMigration = new UserMigrations();

    describe("migrationUserEmailToLowerCase", () => {
        // @ts-expect-error toLowerCaseUsers is private method
        const toLowerCaseUsersMock: jest.SpyInstance<UserDto[]> = jest.spyOn(userMigration, "toLowerCaseUsers");
        const groupUsersByEmailMock: jest.SpyInstance<DefaultObject<UserDto[]>> = jest.spyOn(
            userMigration,
            // @ts-expect-error toLowerCaseUsers is private method
            "groupUsersByEmail",
        );
        // @ts-expect-error toLowerCaseUsers is private method
        const findUsersActionMock: jest.SpyInstance = jest.spyOn(userMigration, "findUsersAction");

        it("should update user", async () => {
            // @ts-expect-error -- mock
            mockedUserCrudService.update.mockImplementationOnce(user => Promise.resolve(user));
            findUsersActionMock.mockImplementationOnce(async users =>
                users.map((user: UserDto) => ({
                    action: EmailToLowerCaseAction.UPDATE,
                    user,
                })),
            );
            mockedUserCrudService.find.mockImplementationOnce(async () => [
                {
                    email: "test@datasubvention.beta.gou.fr",
                } as unknown as WithId<UserDto>,
            ]);
            toLowerCaseUsersMock.mockImplementationOnce((a: UserDto[]) => a);
            groupUsersByEmailMock.mockImplementationOnce(users => {
                return {
                    [users[0].email]: [users[0] as UserDto],
                };
            });

            await userMigration.migrationUserEmailToLowerCase();

            const expected = "test@datasubvention.beta.gou.fr";

            expect(mockedUserCrudService.update).toBeCalledWith(expect.objectContaining({ email: expected }));
        });

        it("should delete user", async () => {
            const user = {
                email: "test@datasubvention.beta.gou.fr",
                _id: new ObjectId(),
            } as unknown as WithId<UserDto>;
            mockedUserCrudService.delete.mockImplementationOnce(() => Promise.resolve(true));
            findUsersActionMock.mockImplementationOnce(async users =>
                users.map((user: UserDto) => ({
                    action: EmailToLowerCaseAction.DELETE,
                    user,
                })),
            );
            mockedUserCrudService.find.mockImplementationOnce(async () => [user]);
            toLowerCaseUsersMock.mockImplementationOnce((a: UserDto[]) => a);
            groupUsersByEmailMock.mockImplementationOnce(users => {
                return {
                    [users[0].email]: [users[0] as UserDto],
                };
            });

            await userMigration.migrationUserEmailToLowerCase();

            expect(mockedUserCrudService.delete).toBeCalledWith(user._id.toString());
        });
    });

    describe("groupUsersByEmail", () => {
        it("should return grouped emails", () => {
            const users = [
                {
                    email: "test@beta",
                },
                {
                    email: "test@beta",
                },
                {
                    email: "test@beta",
                },
                {
                    email: "othertest@beta",
                },
            ];

            const expected = {
                "test@beta": [users[0], users[1], users[2]],
                "othertest@beta": [users[3]],
            };

            // @ts-expect-error groupUsersByEmail is private methods
            const actual = userMigration.groupUsersByEmail(users);

            expect(actual).toEqual(expected);
        });
    });

    describe("groupUsersByStatus", () => {
        it("should return grouped emails", () => {
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
                actived: [users[0]],
                unactived: [users[1], users[2]],
            };

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

            expect(actual).toEqual(expected);
        });
    });

    describe("findUsersAction", () => {
        const groupUsersByStatusMock: jest.SpyInstance<DefaultObject<UserDto[]>> = jest.spyOn(
            userMigration,
            // @ts-expect-error groupUsersByStatus is private methods
            "groupUsersByStatus",
        );
        // @ts-expect-error findLastConnectedUser is private methods
        const findLastConnectedUserMock: jest.SpyInstance<UserDto> = jest.spyOn(userMigration, "findLastConnectedUser");
        // @ts-expect-error findLastCreatedUser is private methods
        const findLastCreatedUserMock: jest.SpyInstance<UserDto> = jest.spyOn(userMigration, "findLastCreatedUser");

        it("should return update user (because one user send)", async () => {
            const users = [{ name: "TEST" } as unknown as UserDto];

            const expected = [
                {
                    user: users[0],
                    action: EmailToLowerCaseAction.UPDATE,
                },
            ];

            // @ts-expect-error findUsersAction is private methods
            const actual = await userMigration.findUsersAction(users);

            expect(actual).toEqual(expected);
        });

        it("should return one update user and one delete user (updated user active)", async () => {
            const users = [
                {
                    name: "USER A",
                },
                {
                    name: "USER B",
                },
            ];
            groupUsersByStatusMock.mockImplementationOnce((users: UserDto[]) => ({
                actived: [users[0]],
                unactived: [users[1]],
            }));
            findLastConnectedUserMock.mockImplementationOnce((users: UserDto[]) => users[0]);

            const expected = [
                {
                    user: users[0],
                    action: EmailToLowerCaseAction.UPDATE,
                },
                {
                    user: users[1],
                    action: EmailToLowerCaseAction.DELETE,
                },
            ];

            // @ts-expect-error findUsersAction is private methods
            const actual = await userMigration.findUsersAction(users);

            expect(actual).toEqual(expected);
        });

        it("should return one update user and one delete user (no users actived)", async () => {
            const users = [
                {
                    name: "USER A",
                },
                {
                    name: "USER B",
                },
            ];
            groupUsersByStatusMock.mockImplementationOnce((users: UserDto[]) => ({
                actived: [],
                unactived: [users[0], users[1]],
            }));
            findLastCreatedUserMock.mockImplementationOnce((users: UserDto[]) => users[0]);

            const expected = [
                {
                    user: users[0],
                    action: EmailToLowerCaseAction.UPDATE,
                },
                {
                    user: users[1],
                    action: EmailToLowerCaseAction.DELETE,
                },
            ];

            // @ts-expect-error findUsersAction is private methods
            const actual = await userMigration.findUsersAction(users);

            expect(actual).toEqual(expected);
        });
    });

    describe("findLastCreatedUser", () => {
        const findUserResetByUserIdMock = jest.spyOn(userActivationService, "findUserResetByUserId");

        beforeEach(() => {
            findUserResetByUserIdMock.mockReset();
        });

        it("should return last reset user", async () => {
            const users = [
                {
                    _id: "userId1",
                },
                {
                    _id: "userId2",
                },
            ] as unknown as UserDto[];
            const resets: DefaultObject = {
                [users[0]._id.toString()]: {
                    userId: users[0]._id,
                    createdAt: new Date(),
                },
                [users[1]._id.toString()]: {
                    userId: users[1]._id,
                    createdAt: new Date(2020, 9, 9),
                },
            };
            findUserResetByUserIdMock.mockImplementation(
                async userId => resets[userId.toString()] as unknown as WithId<UserReset>,
            );

            const expected = users[0];
            // @ts-expect-error findLastCreatedUser is private methods
            const actual = await userMigration.findLastCreatedUser(users);

            expect(actual).toBe(expected);
        });
    });

    describe("findLastConnectedUser", () => {
        beforeEach(() => {
            mockedUserAuthService.findJwtByUser.mockReset();
        });

        it("should return last reset user", async () => {
            const users = [
                {
                    _id: "userId1",
                },
                {
                    _id: "userId2",
                },
            ] as unknown as UserDto[];
            const tokens: DefaultObject<{ token: string; expirateDate: Date }> = {
                [users[0]._id.toString()]: {
                    token: "",
                    expirateDate: new Date(),
                },
                [users[1]._id.toString()]: {
                    token: "",
                    expirateDate: new Date(2020, 9, 9),
                },
            };
            mockedUserAuthService.findJwtByUser.mockImplementation(async user => tokens[user._id.toString()]);

            const expected = users[0];
            // @ts-expect-error findLastConnectedUser is private methods
            const actual = await userMigration.findLastConnectedUser(users);

            expect(actual).toBe(expected);
        });
    });
});
