import { EstablishmentAdapter } from "./EstablishmentAdapter";

const SIRET = "000000000000001";
const ESTABLISHMENT = {
    siret: [{ value: SIRET }],
    nic: [{}],
    versements: {},
    demandes_subventions: {},
};

describe("EstablishmentAdapter", () => {
    describe("toSimplifiedEstablishment", () => {
        it("return a SimplifiedEstablishment", () => {
            const expected = { siret: ESTABLISHMENT.siret, nic: ESTABLISHMENT.nic };
            // @ts-expect-error: private method
            const actual = EstablishmentAdapter.toSimplifiedEstablishment(ESTABLISHMENT);
            expect(actual).toEqual(expected);
        });
    });
});
