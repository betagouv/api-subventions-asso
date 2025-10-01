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
                userId: "user123",
                updateDate: now,
                step: 1,
                overwriteAlert: true,
                grantOrgSiret: "12345678901234",
                permissionAlert: false,
            };

            const result = DepositLogAdapter.dboToEntity(dbo);

            expect(result).not.toBeNull();
            expect(result).toEqual({
                id: dbo._id.toString(),
                userId: dbo.userId,
                updateDate: dbo.updateDate,
                step: dbo.step,
                overwriteAlert: dbo.overwriteAlert,
                grantOrgSiret: dbo.grantOrgSiret,
                permissionAlert: dbo.permissionAlert,
            });
        });
    });

    describe("toDbo", () => {
        it("should convert DepositScdlLog to DepositLogDbo", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY;

            const result = DepositLogAdapter.toDbo(entity);

            expect(result._id).toBeInstanceOf(ObjectId);
            expect(result).toEqual({
                _id: result._id,
                userId: entity.userId,
                updateDate: entity.updateDate,
                step: entity.step,
                overwriteAlert: entity.overwriteAlert,
                grantOrgSiret: entity.grantOrgSiret,
                permissionAlert: entity.permissionAlert,
            });
        });

        it("should convert DepositScdlLog to DepositLogDbo and generate new id", () => {
            const result = DepositLogAdapter.toDbo(DEPOSIT_LOG_ENTITY);

            expect(result._id).toBeInstanceOf(ObjectId);
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

            expect(result).not.toBeNull();
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

            expect(result).not.toBeNull();
            expect(result).toEqual({
                overwriteAlert: entity.overwriteAlert,
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
            const step = 2;

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

            expect(result).not.toBeNull();
            expect(result).toMatchObject({
                userId: userId,
                step: step,
                overwriteAlert: dto.overwriteAlert,
                permissionAlert: false,
            });
        });
    });
});
