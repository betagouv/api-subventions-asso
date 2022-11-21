import * as AssocationHelper from "./association.helper";

const SIREN = "123456789";
const NIC = "12345";

describe("Association Helper", () => {
    describe("getSiegeSiret()", () => {
        it("should return siret", () => {
            const partialAssociationDto = {
                siren: SIREN,
                nic_siege: NIC
            };
            const expected = SIREN + NIC;
            const actual = AssocationHelper.getSiegeSiret(partialAssociationDto);
            expect(actual).toEqual(expected);
        });
    });
});
