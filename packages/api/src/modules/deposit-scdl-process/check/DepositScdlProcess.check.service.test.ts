import { CreateDepositScdlLogDto, DepositScdlLogDto } from "dto";
import depositScdlProcessCheckService from "./DepositScdlProcess.check.service";
import { BadRequestError, ConflictError } from "core";
import { DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2 } from "../__fixtures__/depositLog.fixture";

describe("DepositScdlProcess check service", () => {
    describe("validateCreate", () => {
        it("should accept valid data", () => {
            const dto: CreateDepositScdlLogDto = { overwriteAlert: true };

            const fn = () => depositScdlProcessCheckService.validateCreate(dto);

            expect(fn).not.toThrow();
        });

        it("should throw BadRequestError if overwriteAlert is false", () => {
            const dto: CreateDepositScdlLogDto = { overwriteAlert: false };

            const fn = () => depositScdlProcessCheckService.validateCreate(dto);

            expect(fn).toThrow(BadRequestError);
            expect(fn).toThrow("overwrite alert must be accepted");
        });
    });

    describe("validateUpdateConsistency", () => {
        it("should accept valid data", () => {
            const fn = () =>
                depositScdlProcessCheckService.validateUpdateConsistency(DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, 2);
            expect(fn).not.toThrow();
        });

        it("should throw BadRequestError if invalid step", () => {
            const fn = () =>
                depositScdlProcessCheckService.validateUpdateConsistency(DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, 8);
            expect(fn).toThrow(BadRequestError);
        });

        it("should throw ConflictError if inconsistency properties in step", () => {
            const fn = () =>
                depositScdlProcessCheckService.validateUpdateConsistency(DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, 3);
            expect(fn).toThrow(ConflictError);
        });

        it("should throw ConflictError if not a siret", () => {
            const wrongSiret: DepositScdlLogDto = { grantOrgSiret: "123456789" };
            const fn = () => depositScdlProcessCheckService.validateUpdateConsistency(wrongSiret, 3);
            expect(fn).toThrow(ConflictError);
        });

        it("should throw ConflictError if overwriteAlert not accepted", () => {
            const alertNotAccepted: DepositScdlLogDto = { overwriteAlert: false };
            const fn = () => depositScdlProcessCheckService.validateUpdateConsistency(alertNotAccepted, 3);
            expect(fn).toThrow(ConflictError);
        });
    });
});
