import SubventionsAdapter from "./subventions.adapter";
import * as dataHelper from "$lib/helpers/dataHelper";
vi.mock("$lib/helpers/dataHelper");
vi.mock("$lib/helpers/stringHelper", () => ({
    capitalizeFirstLetter: value => value,
}));

describe("Subventions Adapter", () => {
    const SIRET = "12345678912345";
    const SUBVENTION = {
        dispositif: "ABC DISPOSITIF",
        serviceInstructeur: "SERVICE INST.",
        actions_proposee: [{ intitule: "A" }, { intitule: "B" }, { intitule: "C" }],
    };
    const ELEMENT = { siret: SIRET, subvention: SUBVENTION };

    describe("toSubvention()", () => {
        let mockGetProjectName;
        beforeAll(() => {
            mockGetProjectName = vi.spyOn(SubventionsAdapter, "_getProjectName").mockImplementation(name => name);
        });
        afterAll(() => mockGetProjectName.mockRestore());

        it("should return an object with properties", () => {
            const expected = [
                "establishmentPostcode",
                "serviceInstructeur",
                "dispositif",
                "projectName",
                "montantsDemande",
                "montantsAccorde",
                "status",
            ];
            const actual = Object.keys(SubventionsAdapter.toSubvention(ELEMENT));
            expect(actual).toEqual(expected);
        });

        it("should call valueOrHyphen() multiple time", () => {
            SubventionsAdapter.toSubvention(ELEMENT);
            expect(dataHelper.valueOrHyphen).toHaveBeenCalledTimes(6);
        });
    });

    describe("_getProjectName", () => {
        it("return concatenated names", () => {
            const expected = "A. - B. - C.";
            const actual = SubventionsAdapter._getProjectName(SUBVENTION);
            expect(actual).toEqual(expected);
        });
    });
});
