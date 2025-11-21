import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import depositLogPort from "$lib/resources/deposit-log/depositLog.port";
import type { CreateDepositScdlLogDto, DepositScdlLogDto, DepositScdlLogResponseDto } from "dto";
import type { AxiosResponse } from "axios";

describe("DepositLogService", () => {
    vi.spyOn(depositLogPort, "getDepositLog");
    vi.spyOn(depositLogPort, "createDepositLog");
    vi.spyOn(depositLogPort, "updateDepositLog");
    vi.spyOn(depositLogPort, "deleteDepositLog");
    vi.spyOn(depositLogPort, "validateScdlFile");
    vi.spyOn(depositLogPort, "persistScdlFile");
    vi.spyOn(depositLogPort, "getExistingScdlDatas");

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getDepositLog", () => {
        it("should return null when status is 204", async () => {
            const response = {
                data: "",
                status: 204,
            } as AxiosResponse;
            vi.mocked(depositLogPort.getDepositLog).mockResolvedValue(response);

            const result = await depositLogService.getDepositLog();

            expect(depositLogPort.getDepositLog).toHaveBeenCalledTimes(1);
            expect(result).toBeNull();
        });

        it("should return data when exists", async () => {
            const response = {
                data: {
                    overwriteAlert: true,
                    allocatorSiret: "12345678901234",
                    step: 1,
                },
                status: 200,
            } as AxiosResponse;

            vi.mocked(depositLogPort.getDepositLog).mockResolvedValue(response);

            const result = await depositLogService.getDepositLog();

            expect(depositLogPort.getDepositLog).toHaveBeenCalledTimes(1);
            expect(result).toEqual(response.data as DepositScdlLogResponseDto);
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.getDepositLog).mockRejectedValue(mockError);

            await expect(depositLogService.getDepositLog()).rejects.toThrow(mockError);
            expect(depositLogPort.getDepositLog).toHaveBeenCalledTimes(1);
        });
    });

    describe("createDepositLog", () => {
        it("should return data", async () => {
            const response = {
                data: {
                    overwriteAlert: true,
                    allocatorSiret: "12345678901234",
                    step: 1,
                },
                status: 204,
            } as AxiosResponse;

            vi.mocked(depositLogPort.createDepositLog).mockResolvedValue(response);

            const result = await depositLogService.createDepositLog({} as CreateDepositScdlLogDto);

            expect(depositLogPort.createDepositLog).toHaveBeenCalledTimes(1);
            expect(result).toEqual(response.data as DepositScdlLogResponseDto);
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.createDepositLog).mockRejectedValue(mockError);

            await expect(depositLogService.createDepositLog({})).rejects.toThrow(mockError);
            expect(depositLogPort.createDepositLog).toHaveBeenCalledTimes(1);
        });
    });

    describe("updateDepositLog", () => {
        it("should return data", async () => {
            const response = {
                data: {
                    overwriteAlert: true,
                    allocatorSiret: "12345678901234",
                    step: 1,
                },
                status: 200,
            } as AxiosResponse;

            vi.mocked(depositLogPort.updateDepositLog).mockResolvedValue(response);

            const result = await depositLogService.updateDepositLog(1, {} as DepositScdlLogDto);

            expect(depositLogPort.updateDepositLog).toHaveBeenCalledTimes(1);
            expect(result).toEqual(response.data as DepositScdlLogResponseDto);
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.updateDepositLog).mockRejectedValue(mockError);

            await expect(depositLogService.updateDepositLog(1, {})).rejects.toThrow(mockError);
            expect(depositLogPort.updateDepositLog).toHaveBeenCalledTimes(1);
        });
    });

    describe("deleteDepositLog", () => {
        it("should return no data", async () => {
            const response = {
                data: "",
                status: 204,
            } as AxiosResponse;

            vi.mocked(depositLogPort.deleteDepositLog).mockResolvedValue(response);

            const result = await depositLogService.deleteDepositLog();

            expect(depositLogPort.deleteDepositLog).toHaveBeenCalledTimes(1);
            expect(result).toEqual(null);
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.deleteDepositLog).mockRejectedValue(mockError);

            await expect(depositLogService.deleteDepositLog()).rejects.toThrow(mockError);
            expect(depositLogPort.deleteDepositLog).toHaveBeenCalledTimes(1);
        });
    });

    describe("postScdlFile", () => {
        it("should return data", async () => {
            const uploadedFileInfos = {};

            const response = {
                data: {
                    overwriteAlert: true,
                    allocatorSiret: "12345678901234",
                    step: 2,
                    permissionAlert: true,
                    uploadedFileInfos,
                } as DepositScdlLogResponseDto,
                status: 200,
            } as AxiosResponse;

            vi.mocked(depositLogPort.validateScdlFile).mockResolvedValue(response);

            const result = await depositLogService.postScdlFile({} as File, {} as DepositScdlLogDto);

            expect(depositLogPort.validateScdlFile).toHaveBeenCalledTimes(1);
            expect(result).toEqual(response.data as DepositScdlLogResponseDto);
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.validateScdlFile).mockRejectedValue(mockError);

            await expect(depositLogService.postScdlFile({} as File, {} as DepositScdlLogDto)).rejects.toThrow(
                mockError,
            );
            expect(depositLogPort.validateScdlFile).toHaveBeenCalledTimes(1);
        });
    });

    describe("getCsv", () => {
        it("should return data", async () => {
            const response = {
                data: "col1,col2,col3\ntoto,tata,1234\ntonton,tutu,4567",
                headers: {
                    "content-disposition": "attachment; filename=existing-grants-22160001800016-2025-20251120.csv",
                    "content-type": "text/csv; charset=utf-8",
                },
            } as Partial<AxiosResponse>;

            vi.mocked(depositLogPort.getExistingScdlDatas).mockResolvedValue(response as AxiosResponse);

            const result = await depositLogService.getCsv();

            expect(result).toEqual({
                csvData: response.data,
                fileName: "existing-grants-22160001800016-2025-20251120.csv",
            });
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.getExistingScdlDatas).mockRejectedValue(mockError);

            await expect(depositLogService.getCsv).rejects.toThrow(mockError);
        });
    });

    describe("persistScdlFile", () => {
        it("should return void", async () => {
            const response = {
                data: null,
                status: 204,
            } as AxiosResponse;

            vi.mocked(depositLogPort.persistScdlFile).mockResolvedValue(response);

            const result = await depositLogService.persistScdlFile({} as File);

            expect(depositLogPort.persistScdlFile).toHaveBeenCalledTimes(1);
            expect(result).toBeUndefined();
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.persistScdlFile).mockRejectedValue(mockError);

            await expect(depositLogService.persistScdlFile({} as File)).rejects.toThrow(mockError);
            expect(depositLogPort.persistScdlFile).toHaveBeenCalledTimes(1);
        });
    });
});
