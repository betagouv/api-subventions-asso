import ApiAssoDtoAdapter from "./ApiAssoDtoAdapter";
import { StructureRepresentantLegalDto } from "../dto/StructureDto";
import {
    fixtureAsso,
    fixtureEtablissements,
    fixtureRepresentantLegal,
    fixtureRib
} from "../__fixtures__/ApiAssoStructureFixture";
import { DacDtoDocument, RnaDtoDocument } from "../__fixtures__/DtoDocumentFixture";
import { ApiAssoDocumentFixture } from "../__fixtures__/ApiAssoDocumentFixture";

describe("ApiAssoDtoAdapter", () => {
    describe("toAssociation", () => {
        it("should return two associations", () => {
            const expected = 2;
            const actual = ApiAssoDtoAdapter.toAssociation(fixtureAsso);

            expect(actual).toHaveLength(expected);
        });

        it("should return siren association", () => {
            const actual = ApiAssoDtoAdapter.toAssociation(fixtureAsso);

            expect(actual[1]).toMatchSnapshot();
        });

        it("should return rna association", () => {
            const actual = ApiAssoDtoAdapter.toAssociation(fixtureAsso);

            expect(actual[0]).toMatchSnapshot();
        });

        it("should return rna association with adresse", () => {
            const actual = ApiAssoDtoAdapter.toAssociation({
                ...fixtureAsso,
                identite: {
                    ...fixtureAsso.identite,
                    regime: "loi1901"
                }
            });

            expect(actual[0]).toMatchSnapshot();
        });

        it("should return rna association with date creation", () => {
            const actual = ApiAssoDtoAdapter.toAssociation({
                ...fixtureAsso,
                identite: {
                    ...fixtureAsso.identite,
                    date_creat: "01-01-2022"
                }
            });

            expect(actual[0]).toMatchSnapshot();
        });

        it("should return siren association with date creation", () => {
            const actual = ApiAssoDtoAdapter.toAssociation({
                ...fixtureAsso,
                identite: {
                    ...fixtureAsso.identite,
                    date_creation_sirene: "01-01-2022"
                }
            });

            expect(actual[1]).toMatchSnapshot();
        });

        it("should return siren association without nom siren", () => {
            const actual = ApiAssoDtoAdapter.toAssociation({
                ...fixtureAsso,
                identite: {
                    ...fixtureAsso.identite,
                    nom_sirene: undefined
                }
            });

            expect(actual[1]).toMatchSnapshot();
        });
    });

    describe("toEtablissement", () => {
        it("should return etablissement with rib", () => {
            const actual = ApiAssoDtoAdapter.toEtablissement(
                fixtureEtablissements[0],
                fixtureRib,
                [],
                fixtureAsso.identite.date_modif_siren
            );

            expect(actual).toMatchSnapshot();
        });

        it("should return etablissement with contact", () => {
            const actual = ApiAssoDtoAdapter.toEtablissement(
                fixtureEtablissements[0],
                [],
                fixtureRepresentantLegal,
                fixtureAsso.identite.date_modif_siren
            );

            expect(actual).toMatchSnapshot();
        });

        it("should return etablissement without rib", () => {
            const actual = ApiAssoDtoAdapter.toEtablissement(
                fixtureEtablissements[1],
                fixtureRib,
                [],
                fixtureAsso.identite.date_modif_siren
            );

            expect(actual).toMatchSnapshot();
        });

        it("should return etablissement without contact", () => {
            const actual = ApiAssoDtoAdapter.toEtablissement(
                fixtureEtablissements[1],
                [],
                undefined as unknown as StructureRepresentantLegalDto[],
                fixtureAsso.identite.date_modif_siren
            );

            expect(actual).toMatchSnapshot();
        });
    });

    describe("rnaDocumentToDocument", () => {
        it("should return StructureRnaDocumentDto", () => {
            const expected = RnaDtoDocument;
            const actual = ApiAssoDtoAdapter.rnaDocumentToDocument(
                ApiAssoDocumentFixture.asso.documents.document_rna[0]
            );
            expect(actual).toEqual(expected);
        });

        it("should set date to 01/01/1970 if year is not define", () => {
            const document_rna = {
                ...ApiAssoDocumentFixture.asso.documents.document_rna[0],
                annee: undefined
            };
            const actual = ApiAssoDtoAdapter.rnaDocumentToDocument(document_rna);
            expect(actual).toMatchSnapshot();
        });

        it("should set date to 01/01 of year if time is not define", () => {
            const document_rna = {
                ...ApiAssoDocumentFixture.asso.documents.document_rna[0],
                time: undefined
            };
            const actual = ApiAssoDtoAdapter.rnaDocumentToDocument(document_rna);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("dacDocumentToDocument", () => {
        it("should return StructureDacDocumentDto", () => {
            const expected = DacDtoDocument;
            const actual = ApiAssoDtoAdapter.dacDocumentToDocument(
                ApiAssoDocumentFixture.asso.documents.document_dac[0]
            );
            expect(actual).toEqual(expected);
        });
    });
});
