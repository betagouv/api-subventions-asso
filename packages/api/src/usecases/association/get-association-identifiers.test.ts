import { AssociationSearchAdapter } from "../../adapters/outputs/db/association-search/association-search.adapter";
import { ASSOCIATION_SEARCH_ENTITIES } from "../../domain/__fixtures__/association-search.fixture";
import { IdentifierError } from "../../domain/errors/IdentifierError";
import { IdentifierNotHandledError } from "../../domain/errors/IdentifierNotHandledError";
import { AssociationIdentifier } from "../../identifier-objects";
import { RID } from "../../identifier-objects/__fixtures__/IdentifierFixture";
import { GetAssociationIdentifiers } from "./get-association-identifiers";

describe("GetAssociationIdentifiers UseCase", () => {
    const ASSOCIATION_SEARCH = { ...ASSOCIATION_SEARCH_ENTITIES[0] };
    const mockAdapter = {
        findByIdentifier: jest.fn().mockResolvedValue(ASSOCIATION_SEARCH),
    } as unknown as jest.Mocked<AssociationSearchAdapter>;
    const usecase = new GetAssociationIdentifiers(mockAdapter);

    it("returns AssociationIdentifier from the given identifier if not match found", async () => {
        mockAdapter.findByIdentifier.mockResolvedValueOnce(null);
        const expected = [AssociationIdentifier.fromSiren(ASSOCIATION_SEARCH.siren!)];
        const actual = await usecase.execute(ASSOCIATION_SEARCH.siren!.value);
        expect(actual).toEqual(expected);
    });

    it("returns AssociationIdentifier with both rna and siren when match is found", async () => {
        const expected = [AssociationIdentifier.fromSirenAndRna(ASSOCIATION_SEARCH.siren!, ASSOCIATION_SEARCH.rna!)];
        const actual = await usecase.execute(ASSOCIATION_SEARCH.rna!.value);
        expect(actual).toEqual(expected);
    });

    it("throws IdentifierNotHandledError", async () => {
        await expect(() => usecase.execute(RID.value)).rejects.toThrow(IdentifierNotHandledError);
    });

    it("throws IdentifierError", async () => {
        await expect(() => usecase.execute("123")).rejects.toThrow(IdentifierError);
    });
});
