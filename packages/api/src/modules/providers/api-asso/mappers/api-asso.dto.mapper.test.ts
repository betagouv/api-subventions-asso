import ApiAssoDtoMapper from "./api-asso.dto.mapper";
import { StructureRepresentantLegalDto } from "../dto/StructureDto";
import {
    fixtureAsso,
    fixtureEstablishments,
    fixtureRepresentantLegal,
    fixtureRib,
} from "../__fixtures__/ApiAssoStructureFixture";
import { DacDtoDocument, RnaDtoDocument } from "../__fixtures__/DtoDocumentFixture";
import { ApiAssoDocumentFixture } from "../__fixtures__/ApiAssoDocumentFixture";
import { sirenStructureFixture } from "../__fixtures__/SirenStructureFixture";
import { RNA_STRUCTURE_DTO } from "../__fixtures__/RnaStructureFixture";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import { Personne } from "dto";

describe("ApiAsso DTO Mapper", () => {
    describe("toEstablishment", () => {
        it("should return establishment with rib", () => {
            const actual = ApiAssoDtoMapper.toEstablishment(
                fixtureEstablishments[0],
                fixtureRib,
                [],
                fixtureAsso.identite!.date_modif_siren,
            );

            expect(actual).toMatchSnapshot();
        });

        it("should return establishment with contact", () => {
            const actual = ApiAssoDtoMapper.toEstablishment(
                fixtureEstablishments[0],
                [],
                fixtureRepresentantLegal,
                fixtureAsso.identite!.date_modif_siren,
            );

            expect(actual).toMatchSnapshot();
        });

        it("should return establishment without rib", () => {
            const actual = ApiAssoDtoMapper.toEstablishment(
                fixtureEstablishments[1],
                fixtureRib,
                [],
                fixtureAsso.identite!.date_modif_siren,
            );

            expect(actual).toMatchSnapshot();
        });

        it("should return establishment without contact", () => {
            const actual = ApiAssoDtoMapper.toEstablishment(
                fixtureEstablishments[1],
                [],
                undefined as unknown as StructureRepresentantLegalDto[],
                fixtureAsso.identite!.date_modif_siren,
            );

            expect(actual).toMatchSnapshot();
        });

        it("should convert contact's phone number to string", () => {
            const estab = ApiAssoDtoMapper.toEstablishment(
                fixtureEstablishments[1],
                [],
                [
                    { telephone: 222, id_siret: fixtureEstablishments[1].id_siret },
                ] as unknown as StructureRepresentantLegalDto[],
                fixtureAsso.identite!.date_modif_siren,
            );

            const expected = "222";
            const actual = (estab.contacts as Personne[])[0][0].value.telephone;

            expect(actual).toBe(expected);
        });
    });

    describe("convertAndEncodeUrl", () => {
        it("replaces localhost routes", () => {
            const expected = "https%3A%2F%2Flecompteasso.associations.gouv.fr%2Fapim%2Fapi-asso%2F%2Ftoto";
            const actual = ApiAssoDtoMapper.convertAndEncodeUrl("http://localhost:8181/services/toto");
            expect(actual).toBe(expected);
        });

        it("does not change anything else", () => {
            const expected = "toto";
            const actual = ApiAssoDtoMapper.convertAndEncodeUrl(expected);
            expect(actual).toBe(expected);
        });
    });

    describe("rnaDocumentToDocument", () => {
        let buildProviderValueSpy: jest.SpyInstance;

        beforeAll(() => {
            buildProviderValueSpy = jest.spyOn(ProviderValueFactory, "buildProviderValueMapper");
        });

        it("should return StructureRnaDocumentDto", () => {
            const expected = RnaDtoDocument;
            const actual = ApiAssoDtoMapper.rnaDocumentToDocument(
                ApiAssoDocumentFixture.asso.documents.document_rna[0],
            );
            expect(actual).toEqual(expected);
        });

        it("should set date to 01/01/1970 if year is not defined", () => {
            const document_rna = {
                ...ApiAssoDocumentFixture.asso.documents.document_rna[0],
                annee: undefined,
            };
            ApiAssoDtoMapper.rnaDocumentToDocument(document_rna);
            const actual = buildProviderValueSpy.mock.calls[0][1];
            expect(actual).toMatchInlineSnapshot(`1970-01-01T00:00:00.000Z`);
        });

        it("should set date to 01/01 of year if time is not defined", () => {
            const document_rna = {
                ...ApiAssoDocumentFixture.asso.documents.document_rna[0],
                time: undefined,
            };
            ApiAssoDtoMapper.rnaDocumentToDocument(document_rna);
            const actual = buildProviderValueSpy.mock.calls[0][1];
            expect(actual).toMatchInlineSnapshot(`2021-01-01T00:00:00.000Z`);
        });

        it("converts and encodes url", () => {
            const spy = jest.spyOn(ApiAssoDtoMapper, "convertAndEncodeUrl");
            ApiAssoDtoMapper.rnaDocumentToDocument(ApiAssoDocumentFixture.asso.documents.document_rna[0]);
            expect(spy).toHaveBeenCalledWith(ApiAssoDocumentFixture.asso.documents.document_rna[0].url);
        });
    });

    describe("dacDocumentToDocument", () => {
        it("should return StructureDacDocumentDto", () => {
            const expected = DacDtoDocument;
            const actual = ApiAssoDtoMapper.dacDocumentToDocument(
                ApiAssoDocumentFixture.asso.documents.document_dac[0],
            );
            expect(actual).toEqual(expected);
        });

        it("converts and encodes url", () => {
            const spy = jest.spyOn(ApiAssoDtoMapper, "convertAndEncodeUrl");
            ApiAssoDtoMapper.dacDocumentToDocument(ApiAssoDocumentFixture.asso.documents.document_dac[0]);
            expect(spy).toHaveBeenCalledWith(ApiAssoDocumentFixture.asso.documents.document_dac[0].url);
        });
    });

    describe("sirenStructureToAssociation", () => {
        // @ts-expect-error: protected
        const originalFormatEstablishementSiret = ApiAssoDtoMapper.formatEstablishementSiret;
        const mockedFormatEstablishementSiret = jest.fn().mockReturnValue(sirenStructureFixture.etablissements);

        const mockHasIdentity = jest.fn();

        beforeEach(() => {
            // @ts-expect-error: mock private method
            ApiAssoDtoMapper.hasIdentity = mockHasIdentity;
        });

        afterEach(() => {
            mockHasIdentity.mockReset();
        });

        // @ts-expect-error: protected
        beforeAll(() => (ApiAssoDtoMapper.formatEstablishementSiret = mockedFormatEstablishementSiret));
        // @ts-expect-error: protected
        afterAll(() => (ApiAssoDtoMapper.formatEstablishementSiret = originalFormatEstablishementSiret));

        it("should transform to association", () => {
            mockHasIdentity.mockReturnValue(true);
            expect(ApiAssoDtoMapper.sirenStructureToAssociation(sirenStructureFixture)).toMatchSnapshot();
        });

        it("returns null if structure has no identity", () => {
            mockHasIdentity.mockReturnValue(false);

            const expected = null;
            const actual = ApiAssoDtoMapper.sirenStructureToAssociation({
                ...sirenStructureFixture,
                // @ts-expect-error: edge case
                identite: {},
            });
            expect(actual).toEqual(expected);
        });

        it("returns null if id_siren is not defined", () => {
            mockHasIdentity.mockReturnValue(true);

            const expected = null;
            const actual = ApiAssoDtoMapper.sirenStructureToAssociation({
                ...sirenStructureFixture,
                // @ts-expect-error: edge case
                identite: { ...sirenStructureFixture.identite, id_siren: undefined },
            });
            expect(actual).toEqual(expected);
        });
    });

    describe("rnaStructureToAssociation", () => {
        it("should transform to association", () => {
            expect(ApiAssoDtoMapper.rnaStructureToAssociation(RNA_STRUCTURE_DTO)).toMatchSnapshot();
        });
    });

    describe("formatEstablishementSiret", () => {
        it("should return empty array", () => {
            const expected = [];
            // @ts-expect-error: protected
            const actual = ApiAssoDtoMapper.formatEstablishementSiret(undefined);
            expect(actual).toEqual(expected);
        });

        it("should wrap establishment in array", () => {
            const establishment = {};
            const expected = [establishment];
            // @ts-expect-error: protected
            const actual = ApiAssoDtoMapper.formatEstablishementSiret(establishment);
            expect(actual).toEqual(expected);
        });

        it("should return establishments", () => {
            const establishments = [{}];
            const expected = establishments;
            // @ts-expect-error: protected
            const actual = ApiAssoDtoMapper.formatEstablishementSiret(establishments);
            expect(actual).toEqual(expected);
        });
    });
});
