import * as AssociationHelper from "./association.helper";

describe("Association Helper", () => {
    const SIREN = "123456789";
    const NIC = "12345";
    describe("getSiegeSiret()", () => {
        it("should return siret", () => {
            const partialAssociationDto = {
                siren: SIREN,
                nic_siege: NIC
            };
            const expected = SIREN + NIC;
            const actual = AssociationHelper.getSiegeSiret(partialAssociationDto);
            expect(actual).toEqual(expected);
        });
    });
});
