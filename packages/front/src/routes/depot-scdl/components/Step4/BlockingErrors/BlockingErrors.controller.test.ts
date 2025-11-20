import BlockingErrorsController from "./BlockingErrors.controller";
import { depositLogStore } from "$lib/store/depositLog.store";
import type { UploadedFileInfosDto } from "dto";
import { stringify, type Input, type Options } from "csv-stringify/browser/esm/sync";
import type { MockedFunction } from "vitest";

vi.mock("$lib/stores/depositLogStore", () => ({
    depositLogStore: {
        value: null,
    },
}));

vi.mock("csv-stringify/browser/esm/sync", () => ({
    stringify: vi.fn(),
}));

describe("BlockingErrorsController", () => {
    let controller: BlockingErrorsController;
    let createObjectURLMock: ReturnType<typeof vi.fn>;
    let revokeObjectURLMock: ReturnType<typeof vi.fn>;
    let mockLink: Partial<HTMLAnchorElement>;
    let stringifyMock: MockedFunction<(input: Input, options?: Options) => string>;
    const errors = [
        { valeur: "valeur 1", colonne: "colonne 1", bloquant: "oui", doublon: "non", message: "error message" },
        { valeur: "valeur 2", colonne: "colonne 2", bloquant: "oui", doublon: "non", message: "error message" },
    ];

    beforeEach(() => {
        depositLogStore.value = {
            uploadedFileInfos: {
                fileName: "filename.csv",
                errors: errors,
            } as UploadedFileInfosDto,
            step: 1,
        };

        controller = new BlockingErrorsController();

        stringifyMock = vi.mocked(stringify);

        createObjectURLMock = vi.fn().mockReturnValue("blob:created-url-for-csv-file-data");
        revokeObjectURLMock = vi.fn();

        Object.defineProperty(window, "URL", {
            value: {
                createObjectURL: createObjectURLMock,
                revokeObjectURL: revokeObjectURLMock,
            },
            writable: true,
        });

        mockLink = {
            href: "",
            download: "",
            click: vi.fn(),
        };

        vi.spyOn(document, "createElement").mockReturnValue(mockLink as HTMLAnchorElement);
    });

    describe("downloadErrorFile", () => {
        const mockCsvString =
            "valeur,colonne,bloquant,doublon,message\nvaleur 1,colonne 1,oui,non,error message\nvaleur 2,colonne 2,oui,non,error message";
        it("should stringify has been called with errors array", async () => {
            stringifyMock.mockReturnValue(mockCsvString);

            await controller.downloadErrorFile();

            expect(stringifyMock).toHaveBeenCalledWith(errors, {
                header: true,
                quoted: true,
                quoted_empty: true,
            });
        });

        it("should download errors array", async () => {
            stringifyMock.mockReturnValue(mockCsvString);

            await controller.downloadErrorFile();

            expect(createObjectURLMock).toHaveBeenCalledTimes(1);

            const blobCall = createObjectURLMock.mock.calls[0][0];
            expect(blobCall).toBeInstanceOf(Blob);
            expect(blobCall.type).toBe("text/csv; charset=utf-8");

            expect(mockLink.href).toBe("blob:created-url-for-csv-file-data");
            expect(mockLink.click).toHaveBeenCalledTimes(1);
            expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:created-url-for-csv-file-data");
        });

        it("verify generated filename", async () => {
            stringifyMock.mockReturnValue(mockCsvString);

            await controller.downloadErrorFile();

            expect(mockLink.download).toBe(`${depositLogStore.value?.uploadedFileInfos?.fileName}.csv-errors.csv`);
        });
    });
});
