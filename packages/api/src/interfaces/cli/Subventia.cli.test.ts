/*import fs from "fs";
import * as CliHelper from "../../shared/helpers/CliHelper";
import SubventiaLineEntity from "../../modules/providers/subventia/entities/SubventiaLineEntity";

import SubventiaParser from "../../modules/providers/subventia/subventia.parser";
import subventiaService from "../../modules/providers/subventia/subventia.service";
import SubventiaCli from "./Subventia.cli";

describe("SubventiaCli", () => {
    const subventiaCli = new SubventiaCli();
    describe("_parse", () => {
        const processSubventiaDataMock = jest.spyOn(subventiaService, "ProcessSubventiaData");
        const createEntityMock = jest.spyOn(subventiaService, "createEntity");
        const printProgressMock = jest.spyOn(CliHelper, "printProgress").mockImplementation(() => {});

        const processExpected = "This is a list of entities" as unknown as SubventiaLineEntity[];
        //@ts-expect-error
        const createExpected = "Faked result" as unknown as Promise<InsertOneResult<SubventiaLineEntity>>;
        processSubventiaDataMock.mockImplementation(() => processExpected);
        createEntityMock.mockResolvedValue(createExpected);

        afterAll(() => {
            printProgressMock.mockReset();
            processSubventiaDataMock.mockReset();
            createEntityMock.mockReset();
        });

        it("should call processSubventiaData", async () => {
            
            // @ts-expect-error: private method
            await subventiaCli._parse("file_path");
            expect(processSubventiaDataMock).toHaveBeenCalledWith("file_path");
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
*/
