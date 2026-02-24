import type { AxiosResponse } from "axios";
import requestsService from "$lib/services/requests.service";
import depositLogPort from "$lib/resources/deposit-log/depositLog.port";
import {
    type CreateDepositScdlLogDto,
    type DepositScdlLogDto,
    type DepositScdlLogResponseDto,
    type FileDownloadUrlDto,
} from "dto";

vi.mock("$lib/services/requests.service");
const mockedRequestService = vi.mocked(requestsService);

describe("DepositLogPort", () => {
    mockedRequestService.get.mockResolvedValue({ data: {} } as AxiosResponse);

    vi.spyOn(requestsService, "get");
    vi.spyOn(requestsService, "post");

    describe("GET methods", () => {
        const mockGetResource = vi.spyOn(depositLogPort, "getResource");

        describe("getDepositLog", () => {
            it("should call axios with route", () => {
                depositLogPort.getDepositLog();
                expect(mockGetResource).toHaveBeenCalledWith();
            });

            it("returns depositLog", async () => {
                mockGetResource.mockResolvedValueOnce({
                    data: {
                        step: 1,
                        allocatorSiret: "12345678901234",
                        overwriteAlert: true,
                    } as DepositScdlLogResponseDto,
                } as AxiosResponse);
                const expected = { data: { step: 1, allocatorSiret: "12345678901234", overwriteAlert: true } };
                const actual = await depositLogPort.getDepositLog();
                expect(actual).toEqual(expected);
            });
        });

        describe("getExistingScdlDatas", () => {
            it("should call axios with route", () => {
                depositLogPort.getExistingScdlDatas();
                expect(mockGetResource).toHaveBeenCalledWith("donnees-existantes");
            });
        });

        describe("getFileDownloadUrl", () => {
            it("should call axios with route", () => {
                depositLogPort.getFileDownloadUrl();
                expect(mockGetResource).toHaveBeenCalledWith("fichier-depose/url-de-telechargement");
            });

            it("returns FileDownloadUrlDto", async () => {
                mockGetResource.mockResolvedValueOnce({
                    data: { url: "presigned-url" } as FileDownloadUrlDto,
                } as AxiosResponse);
                const expected = { data: { url: "presigned-url" } };
                const actual = await depositLogPort.getDepositLog();
                expect(actual).toEqual(expected);
            });
        });
    });

    describe("POST methods", () => {
        const mockPostResource = vi.spyOn(requestsService, "post");

        beforeAll(() => {
            mockPostResource.mockResolvedValue({
                data: { step: 1, allocatorSiret: "12345678901234", overwriteAlert: true } as DepositScdlLogResponseDto,
            } as AxiosResponse);
        });

        describe("createDepositLog", () => {
            it("should call axios with route", () => {
                const param = {} as CreateDepositScdlLogDto;
                depositLogPort.createDepositLog(param);
                expect(mockPostResource).toHaveBeenCalledWith(depositLogPort.BASE_PATH, param);
            });

            it("returns depositLog", async () => {
                const expected = { data: { step: 1, allocatorSiret: "12345678901234", overwriteAlert: true } };
                const actual = await depositLogPort.createDepositLog({});
                expect(actual).toEqual(expected);
            });
        });

        describe("validateScdlFile", () => {
            it("should call axios with route", () => {
                const file = new File(["content"], "test.csv", { type: "text/csv" });
                const dto = { permissionAlert: true } as DepositScdlLogDto;
                const sheetName = "sheetname";
                depositLogPort.validateScdlFile(file, dto, sheetName);
                expect(mockPostResource).toHaveBeenCalledWith(
                    depositLogPort.BASE_PATH + "/validation-fichier-scdl",
                    expect.any(FormData),
                );

                const callArgs = mockPostResource.mock.calls[0];
                const formData = callArgs[1] as FormData;

                expect(formData.get("file")).toBe(file);
                expect(formData.get("depositScdlLogDto")).toBe(JSON.stringify(dto));
            });
        });

        describe("persistScdlFile", () => {
            it("should call axios with route", () => {
                depositLogPort.persistScdlFile();
                expect(mockPostResource).toHaveBeenCalledWith(depositLogPort.BASE_PATH + "/depot-fichier-scdl");
            });
        });
    });

    describe("PATCH methods", () => {
        const mockPatchResource = vi.spyOn(requestsService, "patch");

        beforeAll(() => {
            mockPatchResource.mockResolvedValue({
                data: { step: 1, allocatorSiret: "12345678901234", overwriteAlert: true } as DepositScdlLogResponseDto,
            } as AxiosResponse);
        });

        describe("updateDepositLog", () => {
            it("should call axios with route", () => {
                const param = {} as DepositScdlLogDto;
                depositLogPort.updateDepositLog(1, param);
                expect(mockPatchResource).toHaveBeenCalledWith(depositLogPort.BASE_PATH + "/step/1", param);
            });

            it("returns depositLog", async () => {
                const expected = { data: { step: 1, allocatorSiret: "12345678901234", overwriteAlert: true } };
                const actual = await depositLogPort.updateDepositLog(1, {});
                expect(actual).toEqual(expected);
            });
        });
    });

    describe("DELETE methods", () => {
        const mockDeleteResource = vi.spyOn(requestsService, "delete");

        beforeAll(() => {
            mockDeleteResource.mockResolvedValue({ data: "" } as AxiosResponse);
        });

        describe("deleteDepositLog", () => {
            it("should call axios with route", () => {
                depositLogPort.deleteDepositLog();
                expect(mockDeleteResource).toHaveBeenCalledWith(depositLogPort.BASE_PATH);
            });

            it("returns empty data", async () => {
                const expected = { data: "" };
                const actual = await depositLogPort.deleteDepositLog();
                expect(actual).toEqual(expected);
            });
        });
    });
});
