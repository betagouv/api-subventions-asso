import DepositScdlLogDbo from "./DepositScdlLogDbo";
import { ObjectId } from "mongodb";
import DepositLogMapper from "./deposit-log.mapper";
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

            const result = DepositLogMapper.dboToEntity(dbo);

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
            const uploadedFileInfos: UploadedFileInfosDbo = {
                fileName: "test.csv",
                uploadDate: now,
                allocatorsSiret: ["12345678901234"],
                grantCoverageYears: [2019, 2200],
                parseableLines: 123,
                totalLines: 125,
                missingHeaders: { optional: [], mandatory: [] },
                existingLinesInDbOnSamePeriod: 145,
                errorStats: { count: 0, errorSample: [] },
            };
            const dbo: DepositScdlLogDbo = {
                _id: new ObjectId(),
                updateDate: now,
                userId: "user123",
                step: 1,
                overwriteAlert: true,
                permissionAlert: false,
                allocatorSiret: "12345678901234",
                uploadedFileInfos: uploadedFileInfos,
            };

            const result = DepositLogMapper.dboToEntity(dbo);

            expect(result).toEqual({
                userId: dbo.userId,
                step: dbo.step,
                updateDate: dbo.updateDate,
                overwriteAlert: dbo.overwriteAlert,
                permissionAlert: dbo.permissionAlert,
                allocatorSiret: dbo.allocatorSiret,
                uploadedFileInfos: uploadedFileInfos,
            });
        });
    });

    describe("toDbo", () => {
        it("should convert DepositScdlLog to DepositLogDbo", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY;

            const result = DepositLogMapper.toDbo(entity);

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
            const result = DepositLogMapper.toDbo(DEPOSIT_LOG_ENTITY);

            expect(result.updateDate).toBeInstanceOf(Date);
        });

        it("should convert DepositScdlLog with uploadedFileInfos to DepositLogDbo", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY_STEP_2;

            const result = DepositLogMapper.toDbo(entity);

            expect(result).toEqual({
                updateDate: result.updateDate,
                userId: entity.userId,
                step: entity.step,
                overwriteAlert: entity.overwriteAlert,
                permissionAlert: entity.permissionAlert,
                allocatorSiret: entity.allocatorSiret,
                uploadedFileInfos: entity.uploadedFileInfos,
            });
        });
    });
});
