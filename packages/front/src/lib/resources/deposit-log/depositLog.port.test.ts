import { AxiosResponse } from "axios";
import requestsService from "$lib/services/requests.service";
import depositLogPort from "$lib/resources/deposit-log/depositLog.port";
import type { CreateDepositScdlLogDto, DepositScdlLogDto, DepositScdlLogResponseDto } from "dto";
import DepositLogPort from "$lib/resources/deposit-log/depositLog.port";

vi.mock("$lib/services/requests.service");
const mockedRequestService = vi.mocked(requestsService);

describe("DepositLogPort", () => {
    mockedRequestService.get.mockResolvedValue({ data: {} } as AxiosResponse);

    vi.spyOn(requestsService, "get");
    vi.spyOn(requestsService, "post");

    describe("GET methods", () => {
        const mockGetResource = vi.spyOn(depositLogPort, "getResource");

        beforeAll(() => {
            mockGetResource.mockResolvedValue({
                data: { step: 1, allocatorSiret: "12345678901234", overwriteAlert: true } as DepositScdlLogResponseDto,
            } as AxiosResponse);
        });

        describe("getDepositLog", () => {
            it("should call axios with route", () => {
                depositLogPort.getDepositLog();
                expect(mockGetResource).toHaveBeenCalledWith();
            });

            it("returns depositLog", async () => {
                const expected = { data: { step: 1, allocatorSiret: "12345678901234", overwriteAlert: true } };
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
                expect(mockPostResource).toHaveBeenCalledWith(DepositLogPort.BASE_PATH, param);
            });

            it("returns depositLog", async () => {
                const expected = { data: { step: 1, allocatorSiret: "12345678901234", overwriteAlert: true } };
                const actual = await depositLogPort.createDepositLog({});
                expect(actual).toEqual(expected);
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
                expect(mockPatchResource).toHaveBeenCalledWith(DepositLogPort.BASE_PATH + "/step/1", param);
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
                expect(mockDeleteResource).toHaveBeenCalledWith(DepositLogPort.BASE_PATH);
            });

            it("returns empty data", async () => {
                const expected = { data: "" };
                const actual = await depositLogPort.deleteDepositLog();
                expect(actual).toEqual(expected);
            });
        });
    });
});
