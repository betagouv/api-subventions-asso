import * as associationHelper from "./association.helper";
vi.mock("./association.helper");
const mockedAssociationHelper = vi.mocked(associationHelper);
import { toSearchHistory } from "./association.mapper";
import DEFAULT_ASSOCIATION from "./__fixtures__/Association";

describe("toSearchHistory", () => {
    const ADDRESS = "ADDRESS";

    beforeAll(() => mockedAssociationHelper.getAddress.mockReturnValue(ADDRESS));

    it("should adapt format", () => {
        const expected = {
            rna: DEFAULT_ASSOCIATION.rna,
            siren: DEFAULT_ASSOCIATION.siren,
            name: DEFAULT_ASSOCIATION.denomination_rna,
            address: ADDRESS,
            nbEtabs: DEFAULT_ASSOCIATION.etablisements_siret.length,
        };
        const actual = toSearchHistory(DEFAULT_ASSOCIATION);
        expect(actual).toEqual(expected);
    });
});
