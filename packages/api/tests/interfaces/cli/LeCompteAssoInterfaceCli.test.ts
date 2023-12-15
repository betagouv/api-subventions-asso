import path from "path";
import apiAssoService from "../../../src/modules/providers/apiAsso/apiAsso.service";
import LeCompteAssoCli from "../../../src/interfaces/cli/LeCompteAsso.cli";
import ProviderValueAdapter from "../../../src/shared/adapters/ProviderValueAdapter";
import rnaSirenService from "../../../src/modules/rna-siren/rnaSiren.service";

describe("LeCompteAssoCli", () => {
    const testWrongFilePath = path.resolve(
        __dirname,
        "../../modules/providers/leCompteAsso/__fixtures__/le-compte-asso-export-tests.csv",
    );
    const testFilePath = path.resolve(
        __dirname,
        "../../modules/providers/leCompteAsso/__fixtures__/le-compte-asso-export-tests-with-good-siret.csv",
    );
    let controller: LeCompteAssoCli;

    beforeEach(() => {
        controller = new LeCompteAssoCli();
    });

    describe("validate", () => {
        it("should reject because no var sent", async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await expect(controller.validate).rejects.toThrow("Validate command need file args");
        });

        it("should reject because file not exist", async () => {
            await expect(controller.validate("FAKE_FILE")).rejects.toThrow("File not found FAKE_FILE");
        });

        it("should show an error because siret not valid", async () => {
            const errorLog = jest.spyOn(console, "error").mockImplementation();

            await controller.validate(testWrongFilePath);

            expect(errorLog).toHaveBeenCalledWith(expect.stringMatching("INVALID SIRET FOR 0"), {
                name: "Lorem ipsum dolor sit",
                rna: null,
                siret: "0",
            });

            errorLog.mockClear();
        });

        it("should parse files in folders", async () => {
            const errorLog = jest.spyOn(console, "error").mockImplementation();
            const info = jest.spyOn(console, "info").mockImplementation();

            await controller.validate(path.resolve(__dirname, "../../modules/providers/leCompteAsso/__fixtures__/"));

            expect(errorLog).toHaveBeenCalledWith(expect.stringMatching("INVALID SIRET FOR 0"), {
                name: "Lorem ipsum dolor sit",
                rna: null,
                siret: "0",
            });
            expect(info.mock.calls).toEqual(
                expect.arrayContaining([
                    ["\nStart validation file: ", testFilePath],
                    ["Check 1 entities!"],
                    [expect.stringMatching("Validation done")], // Using stringMatching because console.info is called with color
                ]),
            );
            info.mockClear();
            errorLog.mockClear();
        });

        it("should work, and show logs", async () => {
            const info = jest.spyOn(console, "info").mockImplementation();

            await controller.validate(testFilePath);

            expect(info.mock.calls).toEqual([
                ["\nStart validation file: ", testFilePath],
                ["Check 1 entities!"],
                [expect.stringMatching("Validation done")], // Using stringMatching because console.info is called with color
            ]);

            info.mockClear();
        });
    });

    describe("parse", () => {
        let mock: jest.SpyInstance<Promise<unknown>>;
        let rnaSrienMock: jest.SpyInstance;
        beforeEach(() => {
            mock = jest.spyOn(apiAssoService, "findAssociationBySiren");
            rnaSrienMock = jest.spyOn(rnaSirenService, "find").mockResolvedValue([{ rna: "test", siren: "000000000" }]);
        });

        afterEach(() => {
            mock.mockReset();
            rnaSrienMock.mockReset();
        });

        it("should reject because no var sent", async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await expect(controller.parse).rejects.toThrow("Parse command need file args");
        });

        it("should reject because file not exist", async () => {
            await expect(controller.parse("FAKE_FILE")).rejects.toThrow("File not found FAKE_FILE");
        });

        it("should parse files in folders", async () => {
            const errorLog = jest.spyOn(console, "error").mockImplementation();
            const info = jest.spyOn(console, "info").mockImplementation();

            mock.mockImplementation(() =>
                Promise.resolve({
                    rna: ProviderValueAdapter.toProviderValues("RNA", "test", new Date()),
                    categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date()),
                }),
            );

            await controller.parse(path.resolve(__dirname, "../../modules/providers/leCompteAsso/__fixtures__/"));

            expect(info.mock.calls).toEqual([
                ["2 files in the parse queue"],
                ["You can read log in ./logs/lecompteasso.parse.log.txt"],
                ["\nStart parse file: ", testFilePath],
                ["1 entities found in file."],
                [
                    `All entities is valid !
Start register in database ...`,
                ],
                [
                    `
            1/1
            1 requests created and 0 requests updated
            0 requests not valid
        `,
                ],
                ["\nStart parse file: ", testWrongFilePath],
                ["1 entities found in file."],
                ["Please use command validator for more information eg. npm run cli leCompteAsso validator YOUR_FILE"],
            ]);
            expect(errorLog).toHaveBeenCalledWith(
                expect.stringMatching("An error occurred while parsing the file " + testWrongFilePath),
            );
            info.mockClear();
            errorLog.mockClear();
        });

        it("should work, and show logs", async () => {
            const info = jest.spyOn(console, "info").mockImplementation();

            mock.mockImplementation(() =>
                Promise.resolve({
                    rna: ProviderValueAdapter.toProviderValues("RNA", "test", new Date()),
                    categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date()),
                }),
            );

            await controller.parse(testFilePath);

            expect(info.mock.calls).toEqual([
                ["1 files in the parse queue"],
                ["You can read log in ./logs/lecompteasso.parse.log.txt"],
                ["\nStart parse file: ", testFilePath],
                ["1 entities found in file."],
                [
                    `All entities is valid !
Start register in database ...`,
                ],
                [
                    `
            1/1
            1 requests created and 0 requests updated
            0 requests not valid
        `,
                ],
            ]);

            info.mockClear();
        });
    });
});
