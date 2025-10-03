import { CreateDepositScdlLogDto, DepositScdlLogDto } from "dto";
import depositScdlProcessCheckService from "./DepositScdlProcess.check.service";
import { BadRequestError, ConflictError } from "core";
import { DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2 } from "../__fixtures__/depositLog.fixture";

describe("DepositScdlProcess check service", () => {
    describe("validateCreate", () => {
        it("should accept valid data", () => {
            const dto: CreateDepositScdlLogDto = { overwriteAlert: true, allocatorSiret: "12345678901234" };

            expect(() => depositScdlProcessCheckService.validateCreate(dto)).not.toThrow();
        });

        it("should throw BadRequestError if overwriteAlert is false", () => {
            const dto: CreateDepositScdlLogDto = { overwriteAlert: false };

            expect(() => depositScdlProcessCheckService.validateCreate(dto)).toThrow(BadRequestError);
            expect(() => depositScdlProcessCheckService.validateCreate(dto)).toThrow(
                "overwrite alert must be accepted",
            );
        });
    });

    describe("validateUpdateConsistency", () => {
        it("should accept valid data", () => {
            expect(() =>
                depositScdlProcessCheckService.validateUpdateConsistency(DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, 2),
            ).not.toThrow();
        });

        it("should throw BadRequestError if invalid step", () => {
            expect(() =>
                depositScdlProcessCheckService.validateUpdateConsistency(DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, 8),
            ).toThrow(BadRequestError);
        });

        it("should throw ConflictError if inconsistency properties in step", () => {
            expect(() =>
                depositScdlProcessCheckService.validateUpdateConsistency(DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, 1),
            ).toThrow(ConflictError);
        });

        it("should throw ConflictError if not a siret", () => {
            const wrongSiret: DepositScdlLogDto = { allocatorSiret: "123456789" };
            expect(() => depositScdlProcessCheckService.validateUpdateConsistency(wrongSiret, 1)).toThrow(
                ConflictError,
            );
        });

        it("should throw ConflictError if overwriteAlert not accepted", () => {
            const alertNotAccepted: DepositScdlLogDto = { overwriteAlert: false };
            expect(() => depositScdlProcessCheckService.validateUpdateConsistency(alertNotAccepted, 1)).toThrow(
                ConflictError,
            );
        });
    });
});
