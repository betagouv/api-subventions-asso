import { EtablissementAdapter } from "./EtablissementAdapter";

const SIRET = "000000000000001";
const ETABLISSEMENT = {
    siret: [{ value: SIRET }],
    nic: [{}],
    versements: {},
    demandes_subventions: {},
};

describe("EtablissementAdapter", () => {
    describe("toSimplifiedEtablissement", () => {
        it("return a SimplifiedEtablissement", () => {
            const expected = { siret: ETABLISSEMENT.siret, nic: ETABLISSEMENT.nic };
            // @ts-expect-error: private method
            const actual = EtablissementAdapter.toSimplifiedEtablissement(ETABLISSEMENT);
            expect(actual).toEqual(expected);
        });
    });
});
