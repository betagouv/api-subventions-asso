import { AssociationSearchPort } from "../../adapters/outputs/db/association-search/association-search.port";
import { ASSOCIATION_SEARCH_ENTITIES } from "../../domain/__fixtures__/association-search.fixture";
import { Search } from "./search";

describe("Search Use Case", () => {
    const mockSearchPort = {
        findByIdentifier: jest.fn().mockResolvedValue(ASSOCIATION_SEARCH_ENTITIES[0]),
        findByText: jest.fn().mockResolvedValue(ASSOCIATION_SEARCH_ENTITIES),
    } as unknown as AssociationSearchPort;
    const SEARCH_INPUT = {
        value: "Tennis",
        postalCode: "35000",
    };
    const useCase = new Search(mockSearchPort);

    it("returns association entities from text", async () => {
        const expected = ASSOCIATION_SEARCH_ENTITIES;
        const actual = await useCase.execute(SEARCH_INPUT);
        expect(actual).toEqual(expected);
    });

    it("returns association entities from identifier", async () => {
        const expected = ASSOCIATION_SEARCH_ENTITIES;
        const actual = await useCase.execute({ ...SEARCH_INPUT, value: ASSOCIATION_SEARCH_ENTITIES[0].siren.value });
        expect(actual).toEqual(expected);
    });
});
