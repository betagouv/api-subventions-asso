import DepositScdlLogDbo from "./DepositScdlLogDbo";
import { ObjectId } from "mongodb";
import DepositLogAdapter from "./DepositLog.adapter";
import DepositScdlLogEntity from "../../../modules/deposit-scdl-process/depositScdlLog.entity";
import { CreateDepositScdlLogDto, DepositScdlLogDto } from "dto";
import { DEPOSIT_LOG_ENTITY } from "../../../modules/deposit-scdl-process/__fixtures__/depositLog.fixture";

describe("DepositLogAdapter", () => {
    describe("dboToEntity", () => {
        it("should convert DepositLogDbo to DepositScdlLog", () => {
            const now = new Date();
            const dbo: DepositScdlLogDbo = {
                _id: new ObjectId(),
                updateDate: now,
                userId: "user123",
                step: 1,
                overwriteAlert: true,
                permissionAlert: false,
                grantOrgSiret: "12345678901234",
            };

            const result = DepositLogAdapter.dboToEntity(dbo);

            expect(result).toEqual({
                userId: dbo.userId,
                step: dbo.step,
                updateDate: dbo.updateDate,
                overwriteAlert: dbo.overwriteAlert,
                permissionAlert: dbo.permissionAlert,
                grantOrgSiret: dbo.grantOrgSiret,
            });
        });
    });

    describe("toDbo", () => {
        it("should convert DepositScdlLog to DepositLogDbo", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY;

            const result = DepositLogAdapter.toDbo(entity);

            expect(result).toEqual({
                updateDate: result.updateDate,
                userId: entity.userId,
                step: entity.step,
                overwriteAlert: entity.overwriteAlert,
                permissionAlert: entity.permissionAlert,
                grantOrgSiret: entity.grantOrgSiret,
            });
        });

        it("should convert DepositScdlLog to DepositLogDbo and generate new date", () => {
            const result = DepositLogAdapter.toDbo(DEPOSIT_LOG_ENTITY);

            expect(result.updateDate).toBeInstanceOf(Date);
        });
    });

    describe("entityToDepositScdlLogDto", () => {
        it("should convert DepositScdlLogEntity to DepositScdlLogDto", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY;
            const result = DepositLogAdapter.entityToDepositScdlLogDto(entity);

            expect(result).toEqual({
                overwriteAlert: entity.overwriteAlert,
                grantOrgSiret: entity.grantOrgSiret,
                permissionAlert: entity.permissionAlert,
            });
        });
    });

    describe("entityToCreateDepositScdlLogDto", () => {
        it("should convert DepositScdlLogEntity to CreateDepositScdlLogDto", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY;
            const result = DepositLogAdapter.entityToCreateDepositScdlLogDto(entity);

            expect(result).toEqual({
                overwriteAlert: entity.overwriteAlert,
            });
        });
    });

    describe("entityToDepositScdlLogResponseDto", () => {
        it("should convert DepositScdlLogEntity to DepositScdlLogResponseDto", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY;
            const result = DepositLogAdapter.entityToDepositScdlLogResponseDto(entity);

            expect(result).toEqual({
                overwriteAlert: entity.overwriteAlert,
                grantOrgSiret: entity.grantOrgSiret,
                permissionAlert: entity.permissionAlert,
                step: entity.step,
            });
        });
    });

    describe("depositScdlLogDtoToEntity", () => {
        it("should convert DepositScdlLogDto to DepositScdlLogEntity", () => {
            const dto: DepositScdlLogDto = {
                overwriteAlert: true,
                grantOrgSiret: "12345678901234",
                permissionAlert: true,
            };
            const userId = "user123";
            const step = 3;

            const result = DepositLogAdapter.depositScdlLogDtoToEntity(dto, userId, step);

            expect(result).not.toBeNull();
            expect(result).toMatchObject({
                userId: userId,
                step: step,
                overwriteAlert: dto.overwriteAlert,
                permissionAlert: dto.permissionAlert,
                grantOrgSiret: dto.grantOrgSiret,
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

            const result = DepositLogAdapter.createDepositScdlLogDtoToEntity(dto, userId, step);

            expect(result).toMatchObject({
                userId: userId,
                step: step,
                overwriteAlert: dto.overwriteAlert,
            });
        });
    });
});
