import { RIDET, SIRET, TAHITIET } from "./__fixtures__/IdentifierFixture";
import EstablishmentIdentifier from "./EstablishmentIdentifier";
import Rid from "./Rid";
import Ridet from "./Ridet";
import Siren from "./Siren";
import Siret from "./Siret";
import Tahiti from "./Tahiti";
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

    describe("getAssociationIdentifier", () => {
        let RID, TAHITI, SIREN;
        const mockToRid = jest.spyOn(Ridet.prototype, "toRid");
        const mockToTahiti = jest.spyOn(Tahitiet.prototype, "toTahiti");
        const mockToSiren = jest.spyOn(Siret.prototype, "toSiren");
        const mockIsRidet = jest.spyOn(Ridet, "isRidet");
        const mockIsSiret = jest.spyOn(Siret, "isSiret");
        const mockIsTahiti = jest.spyOn(Tahiti, "isTahiti");
        const mockIsTahitiet = jest.spyOn(Tahitiet, "isTahitiet");
        const mockIsSiren = jest.spyOn(Siren, "isSiren");
        const mockIsRid = jest.spyOn(Rid, "isRid");

        // Only partial mock of ValueObject classes
        // If we wanted to be 100% unit testing we should create a mock in __mocks__ folder
        beforeAll(() => {
            RID = new Rid("0482749");
            TAHITI = new Tahiti("A12345");
            SIREN = new Siren("123456789");
            mockToRid.mockReturnValue(RID);
            mockToTahiti.mockReturnValue(TAHITI);
            mockToSiren.mockReturnValue(SIREN);

            mockIsRidet.mockReturnValue(true);
            mockIsTahitiet.mockReturnValue(true);
            mockIsSiret.mockReturnValue(true);

            // only used in the new ValueObject() to bypass the check in constructor
            mockIsRid.mockReturnValue(true);
            mockIsTahiti.mockReturnValue(true);
            mockIsSiren.mockReturnValue(true);
        });

        afterAll(() => {
            [
                mockIsRid,
                mockIsRidet,
                mockIsSiren,
                mockIsSiret,
                mockIsTahiti,
                mockIsTahitiet,
                mockToRid,
                mockToTahiti,
                mockToSiren,
            ].forEach(mock => {
                mock.mockRestore();
            });
        });

        it("should return Siren with Siren", () => {
            const actual = EstablishmentIdentifier.getAssociationIdentifier(new Siret("12345678900018"));
            const expected = SIREN;
            expect(actual).toEqual(expected);
        });

        it("should return Rid with Ridet", () => {
            const actual = EstablishmentIdentifier.getAssociationIdentifier(new Ridet("0482749145"));
            const expected = RID;
            expect(actual).toEqual(expected);
        });

        it("should return Tahiti with Tahitiet", () => {
            const actual = EstablishmentIdentifier.getAssociationIdentifier(new Tahitiet("A12345697"));
            const expected = TAHITI;
            expect(actual).toEqual(expected);
        });
    });
});
