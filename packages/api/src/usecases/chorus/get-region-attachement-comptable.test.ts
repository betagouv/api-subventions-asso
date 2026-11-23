import { GetRegionAttachementComptable } from "./get-region-attachement-comptable";

describe("GetRegionAttachementComptable UseCase", () => {
    const usecase = new GetRegionAttachementComptable();

    const testCases = [
        ["ADCE", "Administration Centrale"],
        ["DOM1", "DOM-TOM"],
        ["ALSA", "Grand Est"],
        ["AQUI", "Nouvelle-Aquitaine"],
        ["AUVE", "Auvergne-Rhône-Alpes"],
    ];

    it.each(testCases)("should return the region for a given valid region code", (regionCode, expected) => {
        const actual = usecase.execute(regionCode);

        expect(actual).toEqual(expected);
    });

    it("returns null when given string doesn't match a region code", () => {
        const actual = usecase.execute("INVALID");
        const expected = null;
        expect(actual).toBe(expected);
    });

    it("should return N/A for a N/A region code", () => {
        const actual = usecase.execute("N/A");
        const expected = "N/A";
        expect(actual).toBe(expected);
    });
});
