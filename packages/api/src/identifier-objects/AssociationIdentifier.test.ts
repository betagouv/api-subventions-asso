import { SIREN, TAHITI, RID } from "./__fixtures__/IdentifierFixture";
import AssociationIdentifier from "./AssociationIdentifier";
import Rid from "./Rid";
import Siren from "./Siren";
import Tahiti from "./Tahiti";

describe("AssociationIdentifier", () => {
    describe("buildIdentifierFromString", () => {
        it.each`
            classObject | value
            ${Siren}    | ${SIREN.value}
            ${Rid}      | ${RID.value}
            ${Tahiti}   | ${TAHITI.value}
        `("return $classObject class given $value", ({ classObject, value }) => {
            const expected = new classObject(value);
            const actual = AssociationIdentifier.buildIdentifierFromString(value);
            expect(actual).toEqual(expected);
        });
    });
});
