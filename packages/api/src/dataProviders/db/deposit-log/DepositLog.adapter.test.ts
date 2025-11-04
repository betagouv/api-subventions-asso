import DepositScdlLogDbo from "./DepositScdlLogDbo";
import { ObjectId } from "mongodb";
import DepositLogAdapter from "./DepositLog.adapter";
import DepositScdlLogEntity from "../../../modules/deposit-scdl-process/entities/depositScdlLog.entity";
import {
    DEPOSIT_LOG_ENTITY,
    DEPOSIT_LOG_ENTITY_STEP_2,
} from "../../../modules/deposit-scdl-process/__fixtures__/depositLog.fixture";
import UploadedFileInfosDbo from "./UploadedFileInfosDbo";

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
                allocatorSiret: "12345678901234",
            };

            const result = DepositLogAdapter.dboToEntity(dbo);

            expect(result).toEqual({
                userId: dbo.userId,
                step: dbo.step,
                updateDate: dbo.updateDate,
                overwriteAlert: dbo.overwriteAlert,
                permissionAlert: dbo.permissionAlert,
                allocatorSiret: dbo.allocatorSiret,
            });
        });

        it("should convert DepositLogDbo with uploadFileInfos to DepositScdlLog", () => {
            const now = new Date();
            const uploadFileInfos: UploadedFileInfosDbo = {
                fileName: "test.csv",
                uploadDate: now,
                allocatorsSiret: ["12345678901234"],
                errors: [],
                beginPaymentDate: now,
                endPaymentDate: now,
                parseableLines: 123,
                existingLinesInDbOnSamePeriod: 145,
            };
            const dbo: DepositScdlLogDbo = {
                _id: new ObjectId(),
                updateDate: now,
                userId: "user123",
                step: 1,
                overwriteAlert: true,
                permissionAlert: false,
                allocatorSiret: "12345678901234",
                uploadFileInfos: uploadFileInfos,
            };

            const result = DepositLogAdapter.dboToEntity(dbo);

            expect(result).toEqual({
                userId: dbo.userId,
                step: dbo.step,
                updateDate: dbo.updateDate,
                overwriteAlert: dbo.overwriteAlert,
                permissionAlert: dbo.permissionAlert,
                allocatorSiret: dbo.allocatorSiret,
                uploadedFileInfos: uploadFileInfos,
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
                allocatorSiret: entity.allocatorSiret,
            });
        });

        it("should convert DepositScdlLog to DepositLogDbo and generate new date", () => {
            const result = DepositLogAdapter.toDbo(DEPOSIT_LOG_ENTITY);

            expect(result.updateDate).toBeInstanceOf(Date);
        });

        it("should convert DepositScdlLog with uploadedFileInfos to DepositLogDbo", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY_STEP_2;

            const result = DepositLogAdapter.toDbo(entity);

            expect(result).toEqual({
                updateDate: result.updateDate,
                userId: entity.userId,
                step: entity.step,
                overwriteAlert: entity.overwriteAlert,
                permissionAlert: entity.permissionAlert,
                allocatorSiret: entity.allocatorSiret,
                uploadFileInfos: entity.uploadedFileInfos,
            });
        });
    });
});
