import fs from "fs";
import * as CliHelper from "../../shared/helpers/CliHelper";
import { SubventiaRequestEntity } from "../../modules/providers/subventia/entities/SubventiaRequestEntity";

import SubventiaParser from "../../modules/providers/subventia/subventia.parser";
import subventiaService, {
    AcceptedRequest,
    RejectedRequest,
} from "../../modules/providers/subventia/subventia.service";
import SubventiaCli from "./Subventia.cli";

describe("SubventiaCli", () => {
    describe("_parse", () => {
        const controller = new SubventiaCli();
        // @ts-expect-error _parse is private method
        const _parse = controller._parse.bind(controller);
        // @ts-expect-error logger is private attribute of parent
        const logMock = jest.spyOn(controller.logger, "log").mockImplementation(() => {});
        // @ts-expect-error logger is private attribute of parent
        const logICMock = jest.spyOn(controller.logger, "logIC").mockImplementation(() => {});
        const readFileMock = jest.spyOn(fs, "readFileSync");
        const parseMock = jest.spyOn(SubventiaParser, "parse");
        const createEntityMock = jest.spyOn(subventiaService, "createEntity");
        const printProgressMock = jest.spyOn(CliHelper, "printProgress").mockImplementation(() => {});

        afterEach(() => {
            logMock.mockClear();
            readFileMock.mockReset();
            logICMock.mockClear();
        });

        afterAll(() => {
            printProgressMock.mockReset();
            parseMock.mockReset();
            createEntityMock.mockReset();
            readFileMock.mockReset();
        });

        it("should call logger", async () => {
            readFileMock.mockImplementation(() => "Fake content file");
            parseMock.mockImplementationOnce(() => []);

            await _parse("FILE");

            expect(logMock).toHaveBeenCalledWith(
                `\n\n--------------------------------\nFILE\n--------------------------------\n\n`,
            );
            expect(logICMock).toHaveBeenCalledWith("\nStart parse file: ", "FILE");
        });

        it("should call fs", async () => {
            const expected = "FILE";
            readFileMock.mockImplementation(() => "Fake content file");
            parseMock.mockImplementationOnce(() => []);

            await _parse(expected);

            expect(readFileMock).toHaveBeenCalledWith(expected);
        });

        it("should call parser", async () => {
            const expected = "Fake content file";
            readFileMock.mockImplementation(() => expected);
            parseMock.mockImplementationOnce(() => []);

            await _parse("FILE");

            expect(parseMock).toHaveBeenCalledWith(expected);
        });

        it("should save entity", async () => {
            const expected = { fake: "entity" } as unknown as SubventiaRequestEntity;
            readFileMock.mockImplementation(() => "");
            parseMock.mockImplementationOnce(() => [expected]);

            createEntityMock.mockImplementationOnce(async () => ({ state: "created" } as AcceptedRequest));

            await _parse("FILE");

            expect(createEntityMock).toHaveBeenCalledWith(expected);
        });

        it("should show log", async () => {
            const expected = "MESSAGE";
            readFileMock.mockImplementation(() => "");
            parseMock.mockImplementationOnce(() => [{ fake: "entity" } as unknown as SubventiaRequestEntity]);

            createEntityMock.mockImplementationOnce(async () => ({ message: expected } as unknown as RejectedRequest));

            await _parse("FILE");

            expect(logMock.mock.calls).toEqual(
                expect.arrayContaining([
                    expect.arrayContaining([`\n\nThis request is not registered because: ${expected}\n`]),
                ]),
            );
        });
    });
});
