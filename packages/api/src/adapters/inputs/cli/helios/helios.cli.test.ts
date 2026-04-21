import { HELIOS_ENTITY } from "../../../../modules/providers/helios/__fixtures__/helios.fixture";
import SaveHeliosDataUseCase from "../../../../modules/providers/helios/use-cases/save-helios-data.use-case";
import { HELIOS_DTO } from "../../../outputs/db/providers/helios/__fixtures__/helios.fixture";
import HeliosCli from "./helios.cli";
import HeliosMapper from "./helios.mapper";
import HeliosParser from "./helios.parser";

jest.mock("./helios.parser");
jest.mock("./helios.mapper");

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
    });
});
