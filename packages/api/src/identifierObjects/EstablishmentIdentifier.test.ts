import { RIDET, SIRET, TAHITIET } from "./__fixtures__/IdentifierFixture";
import EstablishmentIdentifier from "./EstablishmentIdentifier";
import Ridet from "./Ridet";
import Siret from "./Siret";
import Tahitiet from "./Tahitiet";

describe("EstablishmentIdentifier", () => {
    // if siren is given it will return ridet as we cannot differenciate siren and ridet (9 character each)
    describe("getIdentifierType", () => {
        it.each`
            type                  | identifier
            ${Ridet.getName()}    | ${"8711030001"}
            ${Siret.getName()}    | ${SIRET.value}
            ${Tahitiet.getName()} | ${"Z23456700"}
            ${null}               | ${"8711030"}
            ${null}               | ${"Z234"}
        `("should return $type with $identifier", ({ type, identifier }) => {
            const expected = type;
            const actual = EstablishmentIdentifier.getIdentifierType(identifier);
            expect(actual).toEqual(expected);
        });
    });

    describe("buildIdentifierFromString", () => {
        it.each`
            constructor | value
            ${Siret}    | ${SIRET.value}
            ${Ridet}    | ${RIDET.value}
            ${Tahitiet} | ${TAHITIET.value}
        `("return $class class given $value", ({ constructor, value }) => {
            const expected = new constructor(value);
            const actual = EstablishmentIdentifier.buildIdentifierFromString(value);
            expect(actual).toEqual(expected);
        });
    });
});
