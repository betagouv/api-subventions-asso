import Rna from "../../identifierObjects/Rna";
import Siren from "../../identifierObjects/Siren";
import associationIdentifierService from "./association-identifier.service";

describe("associationIdentifierService", () => {
    // TODO: test getAssociationIdentifiers
    // TODO: test getOneAssociationIdentifier

    describe("identifierStringToEntity", () => {
        it("throws IdentifierError", () => {
            expect(() => associationIdentifierService.identifierStringToEntity("X0002")).toThrow(
                "Invalid structure identifier: X0002",
            );
        });

        it.each`
            identifier          | constructor
            ${"W123456789"}     | ${Rna}
            ${"123456789"}      | ${Siren}
            ${"12345678901234"} | ${Siren}
        `("returns $constructor.name object given identifier $identifier", ({ identifier, constructor }) => {
            const entity = associationIdentifierService.identifierStringToEntity(identifier);
            expect(entity).toBeInstanceOf(constructor);
        });
    });
});
