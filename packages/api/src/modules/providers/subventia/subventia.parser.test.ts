import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import { SubventiaRequestEntity } from "./entities/SubventiaRequestEntity";
import SubventiaParser from "./subventia.parser";

describe("SubventiaParser", () => {
    describe("parse", () => {
        const header = ["A", "B", "C"];
        const data = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ];

        const fileContentData = [[header, ...data]];

        const buffer = Buffer.from("TEST-BUFFER");

        const xlsParseMock = jest.spyOn(ParseHelper, "xlsParse");
        const linkHeaderToDataMock = jest.spyOn(ParseHelper, "linkHeaderToData");
        const indexDataByPathObjectMock = jest.spyOn(ParseHelper, "indexDataByPathObject");

        it("should call xls parser", () => {
            xlsParseMock.mockImplementationOnce(() => [[header]]);

            const expected = "STRING" as unknown as Buffer;

            SubventiaParser.parse(expected);

            expect(xlsParseMock).toHaveBeenCalledWith(expected);
        });

        it("should not return data (empty file)", () => {
            xlsParseMock.mockImplementationOnce(() => [[header]]);

            const expected = 0;

            const actual = SubventiaParser.parse(buffer);

            expect(actual).toHaveLength(expected);
        });

        it("should call linkHeaderToData with headers and data", () => {
            xlsParseMock.mockImplementationOnce(() => fileContentData);
            linkHeaderToDataMock.mockImplementationOnce(() => ({}));
            indexDataByPathObjectMock.mockImplementation(() => ({}));

            const expected = [
                [header, data[0]],
                [header, data[1]],
                [header, data[2]],
            ];

            SubventiaParser.parse(buffer);

            const actual = linkHeaderToDataMock.mock.calls;

            expect(actual).toEqual(expected);

            indexDataByPathObjectMock.mockReset();
        });

        it("should call indexDataByPathObject with parsed data", () => {
            xlsParseMock.mockImplementationOnce(() => fileContentData);
            const expected = {
                A: 1,
                B: 2,
                C: 3,
            };
            linkHeaderToDataMock.mockImplementationOnce(() => expected);
            indexDataByPathObjectMock.mockImplementation(() => ({}));

            SubventiaParser.parse(buffer);

            expect(indexDataByPathObjectMock).toHaveBeenCalledWith(
                SubventiaRequestEntity.indexedProviderInformationsPath,
                expected,
            );
            expect(indexDataByPathObjectMock).toHaveBeenCalledWith(
                SubventiaRequestEntity.indexedLegalInformationsPath,
                expected,
            );

            indexDataByPathObjectMock.mockReset();
        });

        it("should return entities", () => {
            xlsParseMock.mockImplementationOnce(() => fileContentData);
            linkHeaderToDataMock.mockImplementationOnce(() => ({}));
            indexDataByPathObjectMock.mockImplementation(() => ({}));

            const expected = 3;
            const actual = SubventiaParser.parse(buffer);

            expect(actual).toHaveLength(expected);

            indexDataByPathObjectMock.mockReset();
        });
    });
});
