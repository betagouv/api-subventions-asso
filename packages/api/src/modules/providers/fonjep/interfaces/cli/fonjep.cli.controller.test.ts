import ExportDateError from '../../../../../shared/errors/cliErrors/ExportDateError';
import FonjepCliController from './fonjep.cli.controller'
import fs from "fs";
import FonjepParser from "../../fonjep.parser";
import fonjepRepository from "../../repositories/fonjep.repository";
jest.mock("fs");


describe("FonjepCliController", () => {
    const cli = new FonjepCliController();
    describe("_parse()", () => {
        const PATH = "path/to/test";
        it("should throw ExportDateError without exportDate", async () => {
            const expected = new ExportDateError();
            let actual;
            try {
                // @ts-expect-error: protected method
                actual = await cli._parse(PATH);
            } catch (e) {
                actual = e
            }
            expect(actual).toEqual(expected);
        });
    });

    describe("_compare()", () => {
        const mockParse = jest.spyOn(FonjepParser, "parse");

        it("should return true", async () => {
            mockParse
                .mockImplementationOnce(() => ([{
                    // @ts-expect-error: mock
                    indexedInformations: { annee_demande: 2021 },
                    data: { Code: "CODE1" }
                }]))
                .mockImplementationOnce(() => ([
                    {
                        // @ts-expect-error: mock
                        indexedInformations: { annee_demande: 2021 },
                        data: { Code: "CODE1" }
                    },
                    {
                        // @ts-expect-error: mock
                        indexedInformations: { annee_demande: 2022 },
                        data: { Code: "CODE2" }
                    }
                ]))
            const expected = true;
            const actual = await cli._compare("file1", "file2");
            expect(actual).toEqual(expected);
        })

        it("should return false", async () => {
            mockParse
                .mockImplementationOnce(() => ([{
                    // @ts-expect-error: mock
                    indexedInformations: { annee_demande: 2021 },
                    data: { Code: "CODE1" }
                }]))
                .mockImplementationOnce(() => ([
                    {
                        // @ts-expect-error: mock
                        indexedInformations: { annee_demande: 2022 },
                        data: { Code: "CODE2" }
                    }
                ]))
            const expected = false;
            const actual = await cli._compare("file1", "file2");
            expect(actual).toEqual(expected);
        })
    })

    describe.only("drop()", () => {
        it("should call FonjepRepository.drop()", async () => {
            const mockDrop = jest.spyOn(fonjepRepository, "drop").mockImplementationOnce(jest.fn());
            const expected = 1;
            await cli.drop();
            const actual = mockDrop.mock.calls.length;
            expect(actual).toEqual(expected);
        })
    })
});