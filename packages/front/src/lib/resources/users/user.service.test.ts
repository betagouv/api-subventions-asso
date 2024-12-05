import { AdminTerritorialLevel, AgentJobTypeEnum, AgentTypeEnum, type UserDto } from "dto";
import authService from "../auth/auth.service";

vi.mock("../auth/auth.service");
import userService from "./user.service";
import userPort from "./user.port";

vi.mock("./user.port");

describe("UsersService", () => {
    const USER = {
        agentType: AgentTypeEnum.OPERATOR,
        jobType: AgentJobTypeEnum.ADMINISTRATOR,
        service: "SERVICE",
        structure: "STRUCTURE",
    };
    describe("isUserActif", () => {
        it("should return true", () => {
            const user = { lastActivityDate: new Date() };
            const expected = true;
            const actual = userService.isUserActif(user as UserDto);

            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const user = {
                stats: {
                    lastSearchDate: new Date(2000),
                },
            };
            const expected = false;
            const actual = userService.isUserActif(user);

            expect(actual).toEqual(expected);
        });
    });

    describe("deleteCurrentUser", () => {
        it("should call UserPort.deleteSelfUser", () => {
            userService.deleteCurrentUser();
            expect(userPort.deleteSelfUser).toHaveBeenCalledTimes(1);
        });

        it("should call authService.logout()", async () => {
            await userService.deleteCurrentUser();
            expect(authService.logout).toHaveBeenCalledTimes(1);
        });
    });

    describe("isProfileFullyCompleted()", () => {
        describe("with no agentType", () => {
            it("should return false", () => {
                const expected = false;
                // @ts-expect-error: edge case
                const actual = userService.isProfileFullyCompleted({ ...USER, agentType: undefined });
                expect(actual).toEqual(expected);
            });
        });

        describe(`with ${AgentTypeEnum.OPERATOR} agent`, () => {
            const OPERATOR_USER = { ...USER, region: "REGION" };

            it("should return true", () => {
                const expected = true;
                // @ts-expect-error: partial user dto
                const actual = userService.isProfileFullyCompleted(OPERATOR_USER);
                expect(actual).toEqual(expected);
            });

            it.each`
                field
                ${"jobType"}
                ${"service"}
                ${"structure"}
                ${"region"}
            `("should return false if $field is empty", ({ field }) => {
                const expected = false;
                // @ts-expect-error: partial user dto
                const actual = userService.isProfileFullyCompleted({ ...OPERATOR_USER, [field]: "" });
                expect(actual).toEqual(expected);
            });
        });

        describe(`with ${AgentTypeEnum.CENTRAL_ADMIN} agent`, () => {
            const CENTRAL_ADMIN_USER = { ...USER, agentType: AgentTypeEnum.CENTRAL_ADMIN };

            it("should return true", () => {
                const expected = true;
                // @ts-expect-error: partial user dto
                const actual = userService.isProfileFullyCompleted(CENTRAL_ADMIN_USER);
                expect(actual).toEqual(expected);
            });

            it.each`
                field
                ${"jobType"}
                ${"service"}
                ${"structure"}
            `("should return false if $field is empty", ({ field }) => {
                const expected = false;
                // @ts-expect-error partial user dto
                const actual = userService.isProfileFullyCompleted({ ...CENTRAL_ADMIN_USER, [field]: "" });
                expect(actual).toEqual(expected);
            });
        });

        describe(`with ${AgentTypeEnum.DECONCENTRATED_ADMIN} agent`, () => {
            const DECONCENTRATED_ADMIN_USER = {
                ...USER,
                agentType: AgentTypeEnum.DECONCENTRATED_ADMIN,
                region: "REGION",
                decentralizedLevel: AdminTerritorialLevel.DEPARTMENTAL,
                decentralizedTerritory: "TERRITORY",
            };

            it("should return true", () => {
                const expected = true;
                // @ts-expect-error: partial user dto
                const actual = userService.isProfileFullyCompleted(DECONCENTRATED_ADMIN_USER);
                expect(actual).toEqual(expected);
            });

            it.each`
                field
                ${"jobType"}
                ${"service"}
                ${"structure"}
                ${"region"}
                ${"decentralizedLevel"}
                ${"decentralizedTerritory"}
            `("should return false if $field is empty", ({ field }) => {
                const expected = false;
                // @ts-expect-error: partial user dto
                const actual = userService.isProfileFullyCompleted({
                    ...DECONCENTRATED_ADMIN_USER,
                    [field]: "",
                });
                expect(actual).toEqual(expected);
            });

            it.each`
                level
                ${AdminTerritorialLevel.INTERDEPARTMENTAL}
                ${AdminTerritorialLevel.INTERREGIONAL}
                ${AdminTerritorialLevel.OVERSEAS}
            `("should bypass region field if level is $level", ({ level }) => {
                const expected = true;
                // @ts-expect-error: partial user dto
                const actual = userService.isProfileFullyCompleted({
                    ...DECONCENTRATED_ADMIN_USER,
                    decentralizedLevel: level,
                    region: "",
                });
                expect(actual).toEqual(expected);
            });
        });

        describe(`with ${AgentTypeEnum.TERRITORIAL_COLLECTIVITY} agent`, () => {
            const TERRITORIAL_COLLECTIVITY_USER = {
                ...USER,
                agentType: AgentTypeEnum.TERRITORIAL_COLLECTIVITY,
                region: "REGION",
                territorialScope: "SCOPE",
            };

            it("should return true", () => {
                const expected = true;
                // @ts-expect-error: partial user dto
                const actual = userService.isProfileFullyCompleted(TERRITORIAL_COLLECTIVITY_USER);
                expect(actual).toEqual(expected);
            });

            it.each`
                field
                ${"jobType"}
                ${"service"}
                ${"structure"}
                ${"region"}
                ${"territorialScope"}
            `("should return false if $field is empty", ({ field }) => {
                const expected = false;
                // @ts-expect-error: partial user dto
                const actual = userService.isProfileFullyCompleted({
                    ...TERRITORIAL_COLLECTIVITY_USER,
                    [field]: "",
                });
                expect(actual).toEqual(expected);
            });
        });
    });
});
