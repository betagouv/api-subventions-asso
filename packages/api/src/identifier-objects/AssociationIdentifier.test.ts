import { SIRET, RIDET, TAHITIET } from "./__fixtures__/IdentifierFixture";
import AssociationIdentifier from "./AssociationIdentifier";
import Rid from "./Rid";
import Siren from "./Siren";
import Tahiti from "./Tahiti";

describe("AssociationIdentifier", () => {
    describe("buildIdentifierFromString", () => {
        it.each`
            classObject | value
            ${Siren}    | ${SIRET.value}
            ${Rid}      | ${RIDET.value}
            ${Tahiti}   | ${TAHITIET.value}
        `("return $class class given $value", ({ classObject, value }) => {
            const expected = new classObject(value);
            const actual = AssociationIdentifier.buildIdentifierFromString(value);
            expect(actual).toEqual(expected);
        });
    });
});
