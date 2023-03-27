import SubventionsAdapter from "./subventions.adapter";
import * as dataHelper from "@helpers/dataHelper";
jest.mock("@helpers/dataHelper");
import * as stringHelper from "@helpers/stringHelper";
jest.mock("@helpers/stringHelper", () => ({
    trim: value => value
}));
import * as textHelper from "@helpers/textHelper";
jest.mock("@helpers/textHelper", () => ({
    capitalizeFirstLetter: value => value
}));

describe("Subventions Adapter", () => {
    const SUBVENTION = {
        dispositif: "ABC DISPOSITIF",
        serviceInstructeur: "SERVICE INST.",
        actions_proposee: [{ intitule: "A" }, { intitule: "B" }, { intitule: "C" }]
    };

    describe("toSubvention()", () => {
        const mockGetProjectName = jest.spyOn(SubventionsAdapter, "_getProjectName");
        beforeAll(() => mockGetProjectName.mockImplementation(name => name));
        afterAll(() => mockGetProjectName.mockRestore());

        it("should return an object with properties", () => {
            const expected = [
                "serviceInstructeur",
                "dispositif",
                "projectName",
                "montantsDemande",
                "montantsAccorde",
                "status",
                "showAmount"
            ];
            const actual = Object.keys(SubventionsAdapter.toSubvention(SUBVENTION));
            expect(actual).toEqual(expected);
        });

        it("should call valueOrHyphen() multiple time", () => {
            SubventionsAdapter.toSubvention(SUBVENTION);
            expect(dataHelper.valueOrHyphen).toHaveBeenCalledTimes(4);
        });
    });

    describe("_getProjectName", () => {
        it("return concatened names", () => {
            const expected = "A. - B. - C.";
            const actual = SubventionsAdapter._getProjectName(SUBVENTION);
            expect(actual).toEqual(expected);
        });
    });
});
