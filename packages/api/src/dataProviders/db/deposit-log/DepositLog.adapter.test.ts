import DepositScdlLogDbo from "./DepositScdlLogDbo";
import { ObjectId } from "mongodb";
import DepositLogAdapter from "./DepositLog.adapter";
import DepositScdlLogEntity from "../../../modules/deposit-scdl-process/depositScdlLog.entity";

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

        it("should return null when DepositLogDbo is null", () => {
            const result = DepositLogAdapter.dboToEntity(null);
            expect(result).toBeNull();
        });
    });

    describe("toDbo", () => {
        it("should convert DepositScdlLog to DepositLogDbo", () => {
            const now = new Date();
            const entity: DepositScdlLogEntity = new DepositScdlLogEntity(
                "user123",
                1,
                now,
                undefined,
                false,
                "12345678901234",
                true,
            );

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
            const now = new Date();
            const entity: DepositScdlLogEntity = new DepositScdlLogEntity(
                "user123",
                1,
                now,
                undefined,
                false,
                "12345678901234",
                true,
            );

            const result = DepositLogAdapter.toDbo(entity);

            expect(result._id).toBeInstanceOf(ObjectId);
        });

        it("should convert DepositScdlLog to DepositLogDbo and generate new date", () => {
            const entity: DepositScdlLogEntity = new DepositScdlLogEntity(
                "user123",
                1,
                undefined,
                undefined,
                true,
                "12345678901234",
                false,
            );

            const result = DepositLogAdapter.toDbo(entity);

            expect(result.updateDate).toBeInstanceOf(Date);
        });
    });

    describe("entityToDto", () => {
        it("should convert DepositScdlLogEntity to DepositScdlLogDto", () => {
            const now = new Date();
            const entity: DepositScdlLogEntity = new DepositScdlLogEntity(
                "user123",
                1,
                now,
                new ObjectId().toString(),
                true,
                "12345678901234",
                false,
            );
            const result = DepositLogAdapter.entityToDto(entity);

            expect(result).not.toBeNull();
            expect(result).toEqual({
                userId: entity.userId,
                step: entity.step,
                overwriteAlert: entity.overwriteAlert,
                grantOrgSiret: entity.grantOrgSiret,
                permissionAlert: entity.permissionAlert,
            });
        });

        it("should return null when DepositScdlLogEntity is null", () => {
            const result = DepositLogAdapter.entityToDto(null);
            expect(result).toBeNull();
        });
    });
});
