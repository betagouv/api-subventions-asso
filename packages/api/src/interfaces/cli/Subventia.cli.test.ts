import SubventiaCli from "./Subventia.cli";
import subventiaService from "../../modules/providers/subventia/subventia.service";
jest.mock("../../modules/providers/subventia/subventia.service");
import * as CliHelper from "../../shared/helpers/CliHelper";
jest.mock("../../shared/helpers/CliHelper");

describe("SubventiaCli", () => {
    let subventiaCli: SubventiaCli;
    let mockEntities: any[];

    const mockFile = "mockFile";
    const mockLogs = "mockLogs";
    const mockExportDate = "mockExportDate" as unknown as Date;

    beforeEach(() => {
        subventiaCli = new SubventiaCli();
        mockEntities = [{}, {}, {}];

        (subventiaService.ProcessSubventiaData as jest.Mock).mockReturnValue(mockEntities);
        (subventiaService.createEntity as jest.Mock).mockResolvedValue(true);
        (CliHelper.printProgress as jest.Mock).mockReturnValue(true);
    });

    it("should call ProcessSubventiaData", async () => {
        //@ts-expect-error
        await subventiaCli._parse(mockFile, mockLogs, mockExportDate);
        expect(subventiaService.ProcessSubventiaData).toHaveBeenCalledWith(mockFile);
    });

    it.each`
        fn
        ${subventiaService.createEntity}
        ${CliHelper.printProgress}
    `("should call $fn", async ({ fn }) => {
        // @ts-expect-error: protected
        await subventiaCli._parse(mockFile, mockLogs, mockExportDate);
        expect(fn).toHaveBeenCalledTimes(mockEntities.length);
    });
});
