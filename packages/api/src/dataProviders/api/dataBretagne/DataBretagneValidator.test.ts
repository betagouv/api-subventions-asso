import { isConstructorDeclaration } from "typescript";
import {
    DataBretagneDomaineFonctionnelDto,
    DataBretagneMinistryDto,
    DataBretagneProgrammeDto,
    DataBretagneRefProgrammationDto,
} from "./DataBretagneDto";
import { dropDuplicates, findDuplicateAttribute } from "./DataBretagneValidator"; // Import the dropDuplicates function

const dto = {
    domaineFonct: {
        code: "code",
        code_programme: "163",
        label: "Label",
    } as DataBretagneDomaineFonctionnelDto,

    ministry: {
        code: "code",
        label: "label",
        sigle_ministere: "sigle_ministere",
    } as DataBretagneMinistryDto,

    programme: {
        code: "code",
        code_ministere: "code_ministere",
        label: "label",
        label_theme: "label_theme",
    } as DataBretagneProgrammeDto,

    refProgrammation: {
        code: "code",
        code_programme: "code_programme",
        label: "label",
    } as DataBretagneRefProgrammationDto,
};

describe("DataBretagneValidator", () => {
    describe("dropDuplicates", () => {
        it("should return a list without duplicates", () => {
            const dtoListwithDuplicates = [
                dto["domaineFonct"],
                dto["domaineFonct"],
                dto["domaineFonct"],
                dto["domaineFonct"],
            ];
            const expected = [dto["domaineFonct"]];

            const result = dropDuplicates(dtoListwithDuplicates);
            expect(result).toEqual(expected);
        });
    });

    describe("findDuplicateAttribute", () => {
        it("should return an empty list when no duplicate attributes are found", () => {
            const dtoList = [dto["domaineFonct"], { ...dto["domaineFonct"], code: "code2" }];

            const expected = [];

            const result = findDuplicateAttribute(dtoList, "code");
            expect(result).toEqual([]);
        });

        it("should return a list of duplicate attributes", () => {
            const dtoList = [dto["domaineFonct"], { ...dto["domaineFonct"], label: "Label2" }];

            const expected = ["code"];

            const result = findDuplicateAttribute(dtoList, "code");
            expect(result).toEqual(expected);
        });
    });
});
