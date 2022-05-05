import ApiAssoDtoAdapter from "../../../../../src/modules/providers/apiAsso/adapters/ApiAssoDtoAdapter";
import { StructureRepresentantLegalDto } from "../../../../../src/modules/providers/apiAsso/dto/StructureDto";
import { fixtureAsso, fixtureEtablissements, fixtureRepresentantLegal, fixtureRib } from "../__fixtures__/ApiAssoStructureFixture";

describe("ApiAssoDtoAdapter", () => {
    describe("toAssociation", () => {
        it("should retrun two associations", () => {
            const expected = 2;
            const actual = ApiAssoDtoAdapter.toAssociation(fixtureAsso);

            expect(actual).toHaveLength(expected);
        })

        it("should retrun siren association", () => {
            const actual = ApiAssoDtoAdapter.toAssociation(fixtureAsso);

            expect(actual[0]).toMatchSnapshot();
        })

        it("should retrun rna association", () => {
            const actual = ApiAssoDtoAdapter.toAssociation(fixtureAsso);

            expect(actual[1]).toMatchSnapshot();
        })

        it("should retrun rna association with adresse", () => {
            const actual = ApiAssoDtoAdapter.toAssociation({
                ...fixtureAsso,
                identite: {
                    ...fixtureAsso.identite,
                    regime: "loi1901"
                }
            });

            expect(actual[1]).toMatchSnapshot();
        })

        it("should retrun rna association with date creation", () => {
            const actual = ApiAssoDtoAdapter.toAssociation({
                ...fixtureAsso,
                identite: {
                    ...fixtureAsso.identite,
                    date_creat: "01-01-2022",
                }
            });

            expect(actual[1]).toMatchSnapshot();
        })

        it("should retrun siren association with date creation", () => {
            const actual = ApiAssoDtoAdapter.toAssociation({
                ...fixtureAsso,
                identite: {
                    ...fixtureAsso.identite,
                    date_creation_sirene: "01-01-2022",
                }
            });

            expect(actual[0]).toMatchSnapshot();
        })

        it("should retrun siren association without nom siren", () => {
            const actual = ApiAssoDtoAdapter.toAssociation({
                ...fixtureAsso,
                identite: {
                    ...fixtureAsso.identite,
                    nom_sirene: undefined
                }
            });

            expect(actual[0]).toMatchSnapshot();
        })
    })

    describe("toEtablissement", () => {
        it("should retrun etablissement with rib", () => {
            const actual = ApiAssoDtoAdapter.toEtablissement(fixtureEtablissements[0], fixtureRib, [], fixtureAsso.identite.date_modif_siren);

            expect(actual).toMatchSnapshot();
        })

        it("should retrun etablissement with contact", () => {
            const actual = ApiAssoDtoAdapter.toEtablissement(fixtureEtablissements[0], [], fixtureRepresentantLegal, fixtureAsso.identite.date_modif_siren);

            expect(actual).toMatchSnapshot();
        })

        it("should retrun etablissement without rib", () => {
            const actual = ApiAssoDtoAdapter.toEtablissement(fixtureEtablissements[1], fixtureRib, [], fixtureAsso.identite.date_modif_siren);

            expect(actual).toMatchSnapshot();
        })

        it("should retrun etablissement without contact", () => {
            const actual = ApiAssoDtoAdapter.toEtablissement(fixtureEtablissements[1], [], undefined as unknown as StructureRepresentantLegalDto[], fixtureAsso.identite.date_modif_siren);

            expect(actual).toMatchSnapshot();
        })
    })
});