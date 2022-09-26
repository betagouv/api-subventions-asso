import ExportDateError from '../../../../../shared/errors/cliErrors/ExportDateError';
import FonjepCliController from './fonjep.cli.controller'
import FonjepParser from "../../fonjep.parser";
import fonjepSubventionRepository from "../../repositories/fonjep.subvention.repository";
import fonjepParserResponse from "../../__fixtures__/fonjepParserResponse.json";
import fonjepService from "../../fonjep.service";
jest.mock("fs");


describe("FonjepCliController", () => {
    const createSubventionEntityMock = jest.spyOn(fonjepService, "createSubventionEntity");
    const createVersementEntityMock = jest.spyOn(fonjepService, "createVersementEntity");

    beforeAll(() => {
        createSubventionEntityMock.mockImplementation(async () => ({ success: true }));
        createVersementEntityMock.mockImplementation(async () => ({ success: true }));
    });

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

        it("should create entities", async () => {
            const parseMock = jest.spyOn(FonjepParser, "parse");
            // @ts-expect-error: mock;
            parseMock.mockImplementationOnce(() => fonjepParserResponse);
            // @ts-expect-error: test protected method
            await cli._parse(PATH, [], new Date());
            expect(createSubventionEntityMock).toHaveBeenCalledTimes(fonjepParserResponse.subventions.length);
            expect(createVersementEntityMock).toHaveBeenCalledTimes(fonjepParserResponse.versements.length);
        });
    });

    // describe("_compare()", () => {
    //     const mockParse = jest.spyOn(FonjepParser, "parse");

    //     it("should return true", async () => {
    //         mockParse
    //             .mockImplementationOnce(() => ([
    //                 {
    //                     subvention: {
    //                         // @ts-expect-error: mock
    //                         indexedInformations: { annee_demande: 2021 },
    //                         data: { Code: "CODE1" }
    //                     },
    //                     versements: []
    //                 }
    //             ]))
    //             .mockImplementationOnce(() => [
    //                 {
    //                     subvention:
    //                     {
    //                         // @ts-expect-error: mock
    //                         indexedInformations: { annee_demande: 2021 },
    //                         data: { Code: "CODE1" }
    //                     },

    //                     versements: []
    //                 },
    //                 {
    //                     subvention:
    //                     {
    //                         // @ts-expect-error: mock
    //                         indexedInformations: { annee_demande: 2022 },
    //                         data: { Code: "CODE2" }
    //                     },
    //                     versements: []
    //                 }
    //             ])
    //         const expected = true;
    //         const actual = await cli._compare("file1", "file2");
    //         expect(actual).toEqual(expected);
    //     })

    //     it("should return false", async () => {
    //         mockParse
    //             .mockImplementationOnce(() => [
    //                 {
    //                     subvention: {
    //                         // @ts-expect-error: mock
    //                         indexedInformations: { annee_demande: 2021 },
    //                         data: { Code: "CODE1" }
    //                     },
    //                     versements: []
    //                 }
    //             ])
    //             .mockImplementationOnce(() => [
    //                 {
    //                     subvention:
    //                     {
    //                         // @ts-expect-error: mock
    //                         indexedInformations: { annee_demande: 2022 },
    //                         data: { Code: "CODE2" }
    //                     }
    //                     ,
    //                     versements: []
    //                 }
    //             ])
    //         const expected = false;
    //         const actual = await cli._compare("file1", "file2");
    //         expect(actual).toEqual(expected);
    //     })
    // })

    describe("drop()", () => {
        it("should call FonjepRepository.drop()", async () => {
            const mockDrop = jest.spyOn(fonjepSubventionRepository, "drop").mockImplementationOnce(jest.fn());
            const expected = 1;
            await cli.drop();
            const actual = mockDrop.mock.calls.length;
            expect(actual).toEqual(expected);
        })
    })
});