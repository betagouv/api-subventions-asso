import { HELIOS_ENTITY } from "../../../../modules/providers/helios/__fixtures__/helios.fixture";
import SaveHeliosDataUseCase from "../../../../modules/providers/helios/use-cases/save-helios-data.use-case";
import { HELIOS_DTO } from "../../../outputs/db/providers/helios/__fixtures__/helios.fixture";
import HeliosCli from "./helios.cli";
import HeliosMapper from "./helios.mapper";
import HeliosParser from "./helios.parser";
import notifyService from "../../../../modules/notify/notify.service";
import { NotificationType } from "../../../../modules/notify/@types/NotificationType";

jest.mock("./helios.parser");
jest.mock("./helios.mapper");
jest.mock("../../../../modules/notify/notify.service", () => ({ notify: jest.fn().mockResolvedValue(true) }));
jest.mock("../../../../modules/data-log/dataLog.service", () => ({ addFromFile: jest.fn() }));

describe("Helios CLI", () => {
    let cli: HeliosCli;
    const FILE_PATH = "/path/to/file";
    const mockSaveData = {
        execute: jest.fn(),
    } as unknown as SaveHeliosDataUseCase;

    beforeEach(() => {
        cli = new HeliosCli(mockSaveData);
        jest.spyOn(HeliosParser, "parse").mockReturnValue([HELIOS_DTO]);
        jest.spyOn(HeliosMapper, "toEntity").mockReturnValue(HELIOS_ENTITY);
    });

    describe("parse", () => {
        it("use helios parser to extract data to entities", () => {
            cli.parse(FILE_PATH);
            expect(HeliosParser.parse).toHaveBeenCalledWith(FILE_PATH);
        });

        it("transform dto to entity", () => {
            cli.parse(FILE_PATH);
            expect(HeliosMapper.toEntity).toHaveBeenCalledWith(HELIOS_DTO);
        });

        it("persists data", async () => {
            await cli.parse(FILE_PATH);
            expect(mockSaveData.execute).toHaveBeenCalledWith([HELIOS_ENTITY]);
        });

        it("notifies Tchap after import", async () => {
            await cli.parse(FILE_PATH);
            expect(notifyService.notify).toHaveBeenCalledWith(
                NotificationType.DATA_IMPORT_SUCCESS,
                expect.objectContaining({
                    providerName: "Helios",
                    details: expect.objectContaining({
                        fileName: "file",
                        parsedCount: 1,
                        importedCount: 1,
                    }),
                }),
            );
        });
    });
});
