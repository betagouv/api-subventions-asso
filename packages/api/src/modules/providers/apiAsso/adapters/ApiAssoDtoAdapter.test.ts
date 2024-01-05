import ApiAssoDtoAdapter from "./ApiAssoDtoAdapter";
import { StructureRepresentantLegalDto } from "../dto/StructureDto";
import {
    fixtureAsso,
    fixtureEtablissements,
    fixtureRepresentantLegal,
    fixtureRib,
} from "../__fixtures__/ApiAssoStructureFixture";
import { DacDtoDocument, RnaDtoDocument } from "../__fixtures__/DtoDocumentFixture";
import { ApiAssoDocumentFixture } from "../__fixtures__/ApiAssoDocumentFixture";
import { sirenStructureFixture } from "../__fixtures__/SirenStructureFixture";
import { rnaStructureFixture } from "../__fixtures__/RnaStructureFixture";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";

describe("ApiAssoDtoAdapter", () => {
    describe("toEtablissement", () => {
        it("should return etablissement with rib", () => {
            const actual = ApiAssoDtoAdapter.toEtablissement(
                fixtureEtablissements[0],
                fixtureRib,
                [],
                fixtureAsso.identite.date_modif_siren,
            );

            expect(actual).toMatchSnapshot();
        });

        it("should return etablissement with contact", () => {
            const actual = ApiAssoDtoAdapter.toEtablissement(
                fixtureEtablissements[0],
                [],
                fixtureRepresentantLegal,
                fixtureAsso.identite.date_modif_siren,
            );

            expect(actual).toMatchSnapshot();
        });

        it("should return etablissement without rib", () => {
            const actual = ApiAssoDtoAdapter.toEtablissement(
                fixtureEtablissements[1],
                fixtureRib,
                [],
                fixtureAsso.identite.date_modif_siren,
            );

            expect(actual).toMatchSnapshot();
        });

        it("should return etablissement without contact", () => {
            const actual = ApiAssoDtoAdapter.toEtablissement(
                fixtureEtablissements[1],
                [],
                undefined as unknown as StructureRepresentantLegalDto[],
                fixtureAsso.identite.date_modif_siren,
            );

            expect(actual).toMatchSnapshot();
        });
    });

    describe("rnaDocumentToDocument", () => {
        let buildProviderValueSpy: jest.SpyInstance;

        beforeAll(() => {
            buildProviderValueSpy = jest.spyOn(ProviderValueFactory, "buildProviderValueAdapter");
        });

        it("should return StructureRnaDocumentDto", () => {
            const expected = RnaDtoDocument;
            const actual = ApiAssoDtoAdapter.rnaDocumentToDocument(
                ApiAssoDocumentFixture.asso.documents.document_rna[0],
            );
            expect(actual).toEqual(expected);
        });

        it("should set date to 01/01/1970 if year is not defined", () => {
            const document_rna = {
                ...ApiAssoDocumentFixture.asso.documents.document_rna[0],
                annee: undefined,
            };
            ApiAssoDtoAdapter.rnaDocumentToDocument(document_rna);
            const actual = buildProviderValueSpy.mock.calls[0][1];
            expect(actual).toMatchInlineSnapshot(`1970-01-01T00:00:00.000Z`);
        });

        it("should set date to 01/01 of year if time is not defined", () => {
            const document_rna = {
                ...ApiAssoDocumentFixture.asso.documents.document_rna[0],
                time: undefined,
            };
            ApiAssoDtoAdapter.rnaDocumentToDocument(document_rna);
            const actual = buildProviderValueSpy.mock.calls[0][1];
            expect(actual).toMatchInlineSnapshot(`2021-01-01T00:00:00.000Z`);
        });
    });

    describe("dacDocumentToDocument", () => {
        it("should return StructureDacDocumentDto", () => {
            const expected = DacDtoDocument;
            const actual = ApiAssoDtoAdapter.dacDocumentToDocument(
                ApiAssoDocumentFixture.asso.documents.document_dac[0],
            );
            expect(actual).toEqual(expected);
        });
    });

    describe("sirenStructureToAssociation", () => {
        // @ts-expect-error: protected
        const originalFormatEstablishementSiret = ApiAssoDtoAdapter.formatEstablishementSiret;
        const mockedFormatEstablishementSiret = jest
            .fn()
            .mockReturnValue(sirenStructureFixture.etablissements.etablissement);

        // @ts-expect-error: protected
        beforeAll(() => (ApiAssoDtoAdapter.formatEstablishementSiret = mockedFormatEstablishementSiret));
        // @ts-expect-error: protected
        afterAll(() => (ApiAssoDtoAdapter.formatEstablishementSiret = originalFormatEstablishementSiret));

        it("should transform to association", () => {
            expect(ApiAssoDtoAdapter.sirenStructureToAssociation(sirenStructureFixture)).toMatchSnapshot();
        });
    });

    describe("rnaStructureToAssociation", () => {
        it("should transform to association", () => {
            expect(ApiAssoDtoAdapter.rnaStructureToAssociation(rnaStructureFixture)).toMatchSnapshot();
        });
    });

    describe("apiDateToDate", () => {
        it("should throw if falsy value", () => {
            const test = () => ApiAssoDtoAdapter.apiDateToDate("");

            expect(test).toThrowError();
        });

        it("should return valid date", () => {
            const actual = ApiAssoDtoAdapter.apiDateToDate("2022-12-23");

            expect(actual).toEqual(new Date(Date.UTC(2022, 11, 23)));
        });
    });

    describe("formatEstablishementSiret", () => {
        it("should return empty array", () => {
            const expected = [];
            // @ts-expect-error: protected
            const actual = ApiAssoDtoAdapter.formatEstablishementSiret(undefined);
            expect(actual).toEqual(expected);
        });

        it("should wrap establishment in array", () => {
            const establishment = {};
            const expected = [establishment];
            // @ts-expect-error: protected
            const actual = ApiAssoDtoAdapter.formatEstablishementSiret(establishment);
            expect(actual).toEqual(expected);
        });

        it("should return establishments", () => {
            const establishments = [{}];
            const expected = establishments;
            // @ts-expect-error: protected
            const actual = ApiAssoDtoAdapter.formatEstablishementSiret(establishments);
            expect(actual).toEqual(expected);
        });
    });
});
