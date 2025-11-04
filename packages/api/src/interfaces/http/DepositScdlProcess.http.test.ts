import depositScdlProcessService from "../../modules/deposit-scdl-process/depositScdlProcess.service";
import { DepositScdlProcessHttp } from "./DepositScdlProcess.http";
import { IdentifiedRequest } from "../../@types";
import { ObjectId } from "mongodb";
import {
    CREATE_DEPOSIT_LOG_DTO,
    DEPOSIT_LOG_ENTITY_STEP_1,
    DEPOSIT_LOG_ENTITY_STEP_2,
    DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2,
    DEPOSIT_LOG_RESPONSE_DTO,
    DEPOSIT_LOG_RESPONSE_DTO_STEP_2,
} from "../../modules/deposit-scdl-process/__fixtures__/depositLog.fixture";
import DepositScdlLogEntity from "../../modules/deposit-scdl-process/entities/depositScdlLog.entity";
import { ConflictError, NotFoundError } from "core";

const controller = new DepositScdlProcessHttp();

describe("DepositScdlProcessHttp", () => {
    const REQ = { user: { _id: new ObjectId() } } as IdentifiedRequest;

    describe("getDepositLog", () => {
        const getDepositLogSpy = jest.spyOn(depositScdlProcessService, "getDepositLog");
        it("should call service with args", async () => {
            const depositScdlLog = {} as Promise<DepositScdlLogEntity>;
            getDepositLogSpy.mockReturnValueOnce(depositScdlLog);
            await controller.getDepositLog(REQ);
            expect(getDepositLogSpy).toHaveBeenCalledWith(REQ.user._id.toString());
        });

        it("should return depositLogDto", async () => {
            getDepositLogSpy.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY_STEP_2);
            const result = await controller.getDepositLog(REQ);
            expect(result).toEqual(DEPOSIT_LOG_RESPONSE_DTO_STEP_2);
        });
    });

    describe("deleteDepositLog", () => {
        const deleteDepositLogSpy = jest.spyOn(depositScdlProcessService, "deleteDepositLog");
        it("should call service with args", async () => {
            deleteDepositLogSpy.mockReturnValueOnce(Promise.resolve());
            await controller.deleteDepositLog(REQ);
            expect(deleteDepositLogSpy).toHaveBeenCalledWith(REQ.user._id.toString());
        });

        it("should return null after deleting the deposit log", async () => {
            deleteDepositLogSpy.mockResolvedValueOnce(Promise.resolve());
            const result = await controller.deleteDepositLog(REQ);
            expect(result).toEqual(null);
        });
    });

    describe("createDepositLog", () => {
        const createDepositLogSpy = jest.spyOn(depositScdlProcessService, "createDepositLog");
        it("should call service with args", async () => {
            const depositScdlLog = {} as Promise<DepositScdlLogEntity>;
            createDepositLogSpy.mockReturnValueOnce(depositScdlLog);
            await controller.createDepositLog(CREATE_DEPOSIT_LOG_DTO, REQ);
            expect(createDepositLogSpy).toHaveBeenCalledWith(CREATE_DEPOSIT_LOG_DTO, REQ.user._id.toString());
        });

        it("should return CreateDepositLogDto", async () => {
            createDepositLogSpy.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY_STEP_1);
            const result = await controller.createDepositLog(CREATE_DEPOSIT_LOG_DTO, REQ);
            expect(result).toEqual(DEPOSIT_LOG_RESPONSE_DTO);
        });

        it("should reject and throw ConcliftError when user has already a deposit in progress", async () => {
            createDepositLogSpy.mockRejectedValueOnce(new ConflictError("Deposit already exists"));
            await expect(controller.createDepositLog(CREATE_DEPOSIT_LOG_DTO, REQ)).rejects.toThrow(ConflictError);
        });
    });

    describe("updateDepositLog", () => {
        const STEP = 2;
        const updateDepositLogSpy = jest.spyOn(depositScdlProcessService, "updateDepositLog");

        it("should call service with args", async () => {
            const depositScdlLog = {} as Promise<DepositScdlLogEntity>;
            updateDepositLogSpy.mockReturnValueOnce(depositScdlLog);
            await controller.updateDepositLog(STEP, DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, REQ);
            expect(updateDepositLogSpy).toHaveBeenCalledWith(
                STEP,
                DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2,
                REQ.user._id.toString(),
            );
        });

        it("should return DepositScdlLogResponseDto", async () => {
            updateDepositLogSpy.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY_STEP_2);
            const result = await controller.updateDepositLog(STEP, DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, REQ);
            expect(result).toEqual({
                step: STEP,
                overwriteAlert: true,
                allocatorSiret: "12345678901234",
                permissionAlert: true,
                uploadedFileInfos: {
                    fileName: "test.csv",
                    uploadDate: new Date("2025-11-03T00:00:00.000Z"),
                    allocatorsSiret: ["12345678901234"],
                    errors: [],
                    beginPaymentDate: undefined,
                    endPaymentDate: undefined,
                    parseableLines: undefined,
                    existingLinesInDbOnSamePeriod: undefined,
                },
            });
        });

        it("should reject and throw Error when error throw by service", async () => {
            updateDepositLogSpy.mockRejectedValueOnce(new NotFoundError("an error"));
            await expect(controller.updateDepositLog(STEP, DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, REQ)).rejects.toThrow(
                NotFoundError,
            );
        });
    });

    describe("validateScdlFile", () => {
        const validateScdlFileSpy = jest.spyOn(depositScdlProcessService, "validateScdlFile");

        const file: Express.Multer.File = {
            fieldname: "file",
            originalname: "test.csv",
            encoding: "7bit",
            mimetype: "text/csv",
            size: 56,
            buffer: Buffer.from("name,email\nJohn,john@example.com\nJane,jane@example.com", "utf-8"),
            destination: "",
            filename: "",
            path: "",
        } as unknown as Express.Multer.File;

        it("should call service with args", async () => {
            const depositScdlLog = {} as Promise<DepositScdlLogEntity>;
            validateScdlFileSpy.mockReturnValueOnce(depositScdlLog);

            await controller.validateScdlFile(file, DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, REQ);
            expect(validateScdlFileSpy).toHaveBeenCalledWith(
                file,
                DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2,
                REQ.user._id.toString(),
                undefined,
            );
        });

        it("should return DepositScdlLogResponseDto", async () => {
            validateScdlFileSpy.mockResolvedValueOnce(DEPOSIT_LOG_ENTITY_STEP_2);
            const result = await controller.validateScdlFile(file, DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, REQ);
            expect(result).toEqual(DEPOSIT_LOG_RESPONSE_DTO_STEP_2);
        });

        it("should reject and throw Error when error throw by service", async () => {
            validateScdlFileSpy.mockRejectedValueOnce(new NotFoundError("an error"));
            await expect(controller.validateScdlFile(file, DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, REQ)).rejects.toThrow(
                NotFoundError,
            );
        });
    });
});
