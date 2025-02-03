import { DTOS } from "./__fixtures__/DataBretagne.fixture";
import {
    DataBretagneDomaineFonctionnelValidator,
    DataBretagneMinistryValidator,
    DataBretagneProgrammeValidator,
    DataBretagneRefProgrammationValidator,
    DataBretagneValidatorHelper,
} from "./DataBretagneValidator";

describe("DataBretagneValidator", () => {
    describe(DataBretagneValidatorHelper, () => {
        let requiredAttributes = ["code", "label"];

        describe("dropDuplicates", () => {
            it("should return a list without duplicates", () => {
                const dtoListwithDuplicates = [
                    DTOS["domaineFonct"],
                    DTOS["domaineFonct"],
                    DTOS["domaineFonct"],
                    DTOS["domaineFonct"],
                ];
                const expected = [DTOS["domaineFonct"]];

                const result = DataBretagneValidatorHelper.dropDuplicates(dtoListwithDuplicates);
                expect(result).toEqual(expected);
            });
        });
        describe("findDuplicateAttribute", () => {
            it("should return an empty list when no duplicate attributes are found", () => {
                const dtoList = [DTOS["domaineFonct"], { ...DTOS["domaineFonct"], code: "code2" }];

                const expected = new Set();

                const result = DataBretagneValidatorHelper.findDuplicateAttribute(dtoList, "code");
                expect(result).toEqual(expected);
            });

            it("should return a set of duplicate attributes", () => {
                const dtoList = [DTOS["domaineFonct"], { ...DTOS["domaineFonct"], label: "Label2" }];

                const expected = new Set(["code"]);

                const result = DataBretagneValidatorHelper.findDuplicateAttribute(dtoList, "code");
                expect(result).toEqual(expected);
            });

            it("should console.error when a duplicate attribute is found", () => {
                const dtoList = [DTOS["domaineFonct"], { ...DTOS["domaineFonct"], label: "Label2" }];

                const spy = jest.spyOn(console, "error");

                DataBretagneValidatorHelper.findDuplicateAttribute(dtoList, "code");
                expect(spy).toHaveBeenCalledWith("Duplicate value found for code : code");
            });
        });

        describe("validateNotNulls", () => {
            let dtoInvalid = { ...DTOS["domaineFonct"], code: undefined };

            it("should return true when all required attributes are present", () => {
                const result = DataBretagneValidatorHelper.validateNotNulls(DTOS["domaineFonct"], requiredAttributes);
                expect(result).toEqual(true);
            });

            it("should return false when a required attribute is missing", () => {
                const result = DataBretagneValidatorHelper.validateNotNulls(dtoInvalid, requiredAttributes);

                expect(result).toEqual(false);
            });
        });

        describe("sortByValidity", () => {
            let dtoListWithInvalids = [
                DTOS["domaineFonct"],
                { ...DTOS["domaineFonct"], code: "code2" },
                { ...DTOS["domaineFonct"], code: undefined },
            ];

            let mockedValidateNotNulls: jest.SpyInstance;

            let duplicatesCode = new Set(["code"]);

            beforeEach(() => {
                mockedValidateNotNulls = jest.spyOn(DataBretagneValidatorHelper, "validateNotNulls");
            });

            afterAll(() => {
                mockedValidateNotNulls.mockRestore();
            });

            it("should return a list of valids and invalids", () => {
                mockedValidateNotNulls.mockReturnValueOnce(false);
                mockedValidateNotNulls.mockReturnValueOnce(true);
                mockedValidateNotNulls.mockReturnValueOnce(false);

                const expected = {
                    valids: [{ ...DTOS["domaineFonct"], code: "code2" }],
                    invalids: [DTOS["domaineFonct"], { ...DTOS["domaineFonct"], code: undefined }],
                };

                const result = DataBretagneValidatorHelper.sortDataByValidity(
                    dtoListWithInvalids,
                    duplicatesCode,
                    requiredAttributes,
                );
                expect(result).toEqual(expected);
            });
        });
    });

    describe.each([
        ["domaineFonct", DataBretagneDomaineFonctionnelValidator, ["code", "label"]],
        ["ministry", DataBretagneMinistryValidator, ["code", "label"]],
        ["programme", DataBretagneProgrammeValidator, ["code", "label"]],
        ["refProgrammation", DataBretagneRefProgrammationValidator, ["code", "label"]],
    ])("with %s", (entityName, Validator, requiredAttributes) => {
        describe("validate", () => {
            let mockedDropDuplicates: jest.SpyInstance;
            let mockedFindDuplicateAttribute: jest.SpyInstance;
            let mockedSortDataByValidity: jest.SpyInstance;

            beforeEach(() => {
                mockedDropDuplicates = jest
                    .spyOn(DataBretagneValidatorHelper, "dropDuplicates")
                    .mockReturnValue([DTOS["entityName"]]);
                mockedFindDuplicateAttribute = jest
                    .spyOn(DataBretagneValidatorHelper, "findDuplicateAttribute")
                    .mockReturnValue(new Set());
                mockedSortDataByValidity = jest
                    .spyOn(DataBretagneValidatorHelper, "sortDataByValidity")
                    .mockReturnValue({ valids: [DTOS[entityName]], invalids: [] });
            });

            afterAll(() => {
                mockedDropDuplicates.mockRestore();
                mockedFindDuplicateAttribute.mockRestore();
                mockedSortDataByValidity.mockRestore();
            });

            it("should call dropDuplicates", () => {
                Validator.validate([DTOS["entityName"]]);
                expect(mockedDropDuplicates).toHaveBeenCalledWith([DTOS["entityName"]]);
            });

            it("should call findDuplicateAttribute", () => {
                Validator.validate([DTOS["entityName"]]);
                expect(mockedFindDuplicateAttribute).toHaveBeenCalledWith([DTOS["entityName"]], "code");
            });

            it("should call sortDataByValidity", () => {
                Validator.validate([DTOS["entityName"]]);
                expect(mockedSortDataByValidity).toHaveBeenCalledWith(
                    [DTOS["entityName"]],
                    new Set(),
                    requiredAttributes,
                );
            });
        });
    });
});
