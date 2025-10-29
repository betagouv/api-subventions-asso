import { DEPOSIT_LOG_ENTITY } from "./__fixtures__/depositLog.fixture";
import DepositScdlLogEntity from "./entities/depositScdlLog.entity";
import DepositScdlLogDtoAdapter from "./depositScdlLog.dto.adapter";
import { CreateDepositScdlLogDto, DepositScdlLogDto } from "dto";

describe("depositScdlLogDtoAdapter", () => {
    describe("entityToDepositScdlLogDto", () => {
        it("should convert DepositScdlLogEntity to DepositScdlLogDto", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY;
            const result = DepositScdlLogDtoAdapter.entityToDepositScdlLogDto(entity);

            expect(result).toEqual({
                overwriteAlert: entity.overwriteAlert,
                allocatorSiret: entity.allocatorSiret,
                permissionAlert: entity.permissionAlert,
            });
        });
    });

    describe("entityToCreateDepositScdlLogDto", () => {
        it("should convert DepositScdlLogEntity to CreateDepositScdlLogDto", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY;
            const result = DepositScdlLogDtoAdapter.entityToCreateDepositScdlLogDto(entity);

            expect(result).toEqual({
                overwriteAlert: entity.overwriteAlert,
                allocatorSiret: entity.allocatorSiret,
            });
        });
    });

    describe("entityToDepositScdlLogResponseDto", () => {
        it("should convert DepositScdlLogEntity to DepositScdlLogResponseDto", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY;
            const result = DepositScdlLogDtoAdapter.entityToDepositScdlLogResponseDto(entity);

            expect(result).toEqual({
                overwriteAlert: entity.overwriteAlert,
                allocatorSiret: entity.allocatorSiret,
                permissionAlert: entity.permissionAlert,
                step: entity.step,
            });
        });
    });

    describe("depositScdlLogDtoToEntity", () => {
        it("should convert DepositScdlLogDto to DepositScdlLogEntity", () => {
            const dto: DepositScdlLogDto = {
                overwriteAlert: true,
                allocatorSiret: "12345678901234",
                permissionAlert: true,
            };
            const userId = "user123";
            const step = 3;

            const result = DepositScdlLogDtoAdapter.depositScdlLogDtoToEntity(dto, userId, step);

            expect(result).not.toBeNull();
            expect(result).toMatchObject({
                userId: userId,
                step: step,
                overwriteAlert: dto.overwriteAlert,
                permissionAlert: dto.permissionAlert,
                allocatorSiret: dto.allocatorSiret,
            });
        });
    });

    describe("createDepositScdlLogDtoToEntity", () => {
        it("should convert CreateDepositScdlLogDto to DepositScdlLogEntity", () => {
            const dto: CreateDepositScdlLogDto = {
                overwriteAlert: true,
            };
            const userId = "user123";
            const step = 1;

            const result = DepositScdlLogDtoAdapter.createDepositScdlLogDtoToEntity(dto, userId, step);

            expect(result).toMatchObject({
                userId: userId,
                step: step,
                overwriteAlert: dto.overwriteAlert,
            });
        });
    });
});
