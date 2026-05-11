import { Association, EstablishmentWithProviderValues } from "dto";
import ApiAssoDtoMapper from "./mappers/api-asso.dto.mapper";
import { ApiAssoService } from "./api-asso.service";
import { DacDtoDocument, RnaDtoDocument } from "./__fixtures__/DtoDocumentFixture";
import { fixtureAsso, STRUCTURE_ESTABLISHMENT_DTO } from "./__fixtures__/ApiAssoStructureFixture";
import { SirenStructureDto } from "./dto/SirenStructureDto";
import * as ObjectHelper from "../../../shared/helpers/ObjectHelper";
import { DocumentsDto } from "./dto/StructureDto";
import Siren from "../../../identifier-objects/Siren";
import AssociationIdentifier from "../../../identifier-objects/AssociationIdentifier";
import Rna from "../../../identifier-objects/Rna";
import EstablishmentIdentifier from "../../../identifier-objects/EstablishmentIdentifier";
import { SIREN_STRUCTURE_ESTABLISHMENT, sirenStructureFixture } from "./__fixtures__/SirenStructureFixture";
import DEFAULT_ASSOCIATION from "../../../../tests/__fixtures__/association.fixture";

jest.mock("../../../shared/helpers/ObjectHelper");
const mockedObjectHelper = jest.mocked(ObjectHelper);

jest.mock("./mappers/api-asso.dto.mapper", () => ({
    rnaDocumentToDocument: jest.fn().mockImplementation(() => RnaDtoDocument),
    dacDocumentToDocument: jest.fn().mockImplementation(() => DacDtoDocument),
    dacDocumentToRib: jest.fn(),
    toEstablishment: jest.fn().mockImplementation(() => STRUCTURE_ESTABLISHMENT_DTO),
    rnaStructureToAssociation: jest.fn(),
    sirenStructureToAssociation: jest.fn(),
}));

describe("ApiAssoService", () => {
    const mockAdapter = {
        getStructure: jest.fn(),
        getSirenStructure: jest.fn(),
        getRnaStructure: jest.fn(),
        getDocuments: jest.fn(),
    };

    const RNA = new Rna(DEFAULT_ASSOCIATION.rna);

    const service = new ApiAssoService(mockAdapter);

    beforeEach(() => {
        Object.values(mockAdapter).map(mock => mock.mockReset());
    });

    describe("Association Provider Part", () => {
        const SIREN = new Siren("509221941");

        const ASSOCIATION_ID_WITHOUT_RNA = AssociationIdentifier.fromSiren(SIREN);
        const ASSOCIATION_ID_WITH_RNA = AssociationIdentifier.fromRna(RNA);
        const ASSOCIATION_ID = AssociationIdentifier.fromSirenAndRna(SIREN, RNA);

        describe("getAssociations", () => {
            const findAssociationBySirenMock = jest.spyOn(service, "findAssociationBySiren");
            const findAssociationByRnaMock = jest.spyOn(service, "findAssociationByRna");

            it("should call findAssociationBySiren", async () => {
                findAssociationBySirenMock.mockResolvedValueOnce(null);
                await service.getAssociationsWithProviderValues(ASSOCIATION_ID_WITHOUT_RNA);
                expect(findAssociationBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("should call findAssociationByRna", async () => {
                findAssociationByRnaMock.mockResolvedValueOnce(null);
                await service.getAssociationsWithProviderValues(ASSOCIATION_ID_WITH_RNA);
                expect(findAssociationByRnaMock).toHaveBeenCalledWith(RNA);
            });

            it("should call findAssociationBySiren and findAssociationByRna", async () => {
                findAssociationBySirenMock.mockResolvedValueOnce(null);
                findAssociationByRnaMock.mockResolvedValueOnce(null);
                await service.getAssociationsWithProviderValues(ASSOCIATION_ID);
                expect(findAssociationBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("should return empty array", async () => {
                findAssociationBySirenMock.mockResolvedValueOnce(null);
                const actual = await service.getAssociationsWithProviderValues(ASSOCIATION_ID_WITHOUT_RNA);
                expect(actual).toHaveLength(0);
            });

            it("should return many associations", async () => {
                const expected = 2;
                findAssociationBySirenMock.mockResolvedValueOnce({ data: true });
                findAssociationByRnaMock.mockResolvedValueOnce({ data: true });
                const actual = await service.getAssociationsWithProviderValues(ASSOCIATION_ID);
                expect(actual).toHaveLength(expected);
            });
        });

        describe("findAssociationByRna", () => {
            const RNA = new Rna("W000000000");

            beforeAll(() => {
                mockedObjectHelper.hasEmptyProperties.mockReturnValue(false);
            });

            it("calls adapter", async () => {
                await service.findAssociationByRna(RNA);

                expect(mockAdapter.getRnaStructure).toHaveBeenCalledWith(RNA);
            });

            it("should return null if result without date", async () => {
                const expected = null;
                mockAdapter.getRnaStructure.mockResolvedValue({ data: true, identite: { date_modif_rna: null } });
                const actual = await service.findAssociationByRna(RNA);

                expect(actual).toBe(expected);
            });

            it("should return null if structure.identite has empty properties", async () => {
                mockedObjectHelper.hasEmptyProperties.mockReturnValueOnce(true);
                const expected = null;
                mockAdapter.getRnaStructure.mockResolvedValue({ data: true, identite: {} });
                const actual = await service.findAssociationByRna(RNA);
                expect(actual).toBe(expected);
            });

            it("should use adapter", async () => {
                const expected = { data: true, identite: { date_modif_rna: "smthg" } };
                mockAdapter.getRnaStructure.mockResolvedValue(expected);
                await service.findAssociationByRna(RNA);

                expect(ApiAssoDtoMapper.rnaStructureToAssociation).toHaveBeenCalledWith(expected);
            });
        });

        describe("findAssociationBySiren", () => {
            const SIREN = new Siren("000000000");
            const ASSO_WITH_STRUCTURES: Association = {
                // @ts-expect-error: incomplete fixture
                data: true,
                identite: { date_modif_siren: "smthg" },
                etablissement: { length: 1 },
            };
            let mockGetDefaultDateModifSiren: jest.SpyInstance;

            beforeAll(() => {
                mockedObjectHelper.hasEmptyProperties.mockReturnValue(false);
                mockGetDefaultDateModifSiren = jest
                    // @ts-expect-error: mock private method
                    .spyOn(service, "getDefaultDateModifSiren")
                    // @ts-expect-error: mock
                    .mockReturnValue("1900-01-01");
            });

            afterAll(() => {
                mockGetDefaultDateModifSiren.mockRestore();
            });

            it("calls adapter", async () => {
                await service.findAssociationBySiren(SIREN);
                expect(mockAdapter.getSirenStructure).toHaveBeenCalledWith(SIREN);
            });

            it("should call /structures if no establishment found", async () => {
                mockAdapter.getSirenStructure.mockResolvedValueOnce({
                    data: true,
                    identite: { date_modif_siren: "smthg" },
                });
                await service.findAssociationBySiren(SIREN);
                expect(mockAdapter.getSirenStructure).toHaveBeenCalledWith(SIREN);
            });

            it("should return null if structure identite has empty properties", async () => {
                mockedObjectHelper.hasEmptyProperties.mockReturnValueOnce(true);
                const STRUCTURE: SirenStructureDto = {
                    etablissement: [SIREN_STRUCTURE_ESTABLISHMENT],
                    // @ts-expect-error: mock wrong api response
                    identite: { date_modif_siren: null, nom: null, id_rna: null },
                };
                mockAdapter.getSirenStructure.mockResolvedValueOnce(STRUCTURE);
                const actual = await service.findAssociationBySiren(SIREN);
                expect(actual).toBe(null);
            });

            it("maps result to association", async () => {
                mockAdapter.getSirenStructure.mockResolvedValue(sirenStructureFixture);

                await service.findAssociationBySiren(SIREN);
                expect(ApiAssoDtoMapper.sirenStructureToAssociation).toHaveBeenCalledWith(sirenStructureFixture);
            });

            it("returns association", async () => {
                const expected = ASSO_WITH_STRUCTURES;
                mockAdapter.getSirenStructure.mockResolvedValue(sirenStructureFixture);
                jest.mocked(ApiAssoDtoMapper.sirenStructureToAssociation).mockReturnValue(ASSO_WITH_STRUCTURES);
                const actual = await service.findAssociationBySiren(SIREN);
                expect(actual).toEqual(expected);
            });

            it("should call getDefaultDateModifSiren()", async () => {
                const STRUCTURE = {
                    ...ASSO_WITH_STRUCTURES,
                    identite: { date_modif_siren: undefined },
                };
                mockAdapter.getSirenStructure.mockResolvedValueOnce(STRUCTURE);
                await service.findAssociationBySiren(SIREN);
                expect(mockGetDefaultDateModifSiren).toHaveBeenCalledWith(STRUCTURE);
            });
        });
    });

    describe("getDefaultDateModifSiren", () => {
        it.each`
            structure
            ${{}}
            ${{ identite: {} }}
            ${{ identifie: { date_creation_sirene: undefined } }}
            ${{ identifie: { date_creation_sirene: null } }}
        `("should return default value", ({ structure }) => {
            const expected = "1900-01-01";
            // @ts-expect-error: private method
            const actual = service.getDefaultDateModifSiren(structure);
            expect(actual).toEqual(expected);
        });

        it("should return date_creation_sirene", () => {
            const STRUCTURE = {
                identite: {
                    date_creation_sirene: "2000-01-01",
                },
            };
            const expected = STRUCTURE.identite.date_creation_sirene;
            // @ts-expect-error: private method
            const actual = service.getDefaultDateModifSiren(STRUCTURE);
            expect(actual).toEqual(expected);
        });
    });

    describe("getEstablishments part", () => {
        let findDocumentsMock: jest.SpyInstance;
        let findEstablishmentsBySirenMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error: mock private method
            findDocumentsMock = jest.spyOn(service, "findDocuments");
            findEstablishmentsBySirenMock = jest.spyOn(service, "findEstablishmentsBySiren");
        });

        afterAll(() => {
            findDocumentsMock.mockRestore();
        });

        describe("getEstablishmentsWithProviderValues", () => {
            const SIREN = new Siren("000000000");
            const ASSOCIATION_ID = AssociationIdentifier.fromSiren(SIREN);
            const SIRET = SIREN.toSiret("00001");
            const ESTABLISHMENT_ID = EstablishmentIdentifier.fromSiret(SIRET, ASSOCIATION_ID);
            it("should call findEstablishmentsBySiren with Association identifier", async () => {
                findEstablishmentsBySirenMock.mockResolvedValueOnce([]);
                await service.getEstablishmentsWithProviderValues(ASSOCIATION_ID);
                expect(findEstablishmentsBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("should call findEstablishmentsBySiren with Establishment identifier", async () => {
                findEstablishmentsBySirenMock.mockResolvedValueOnce([]);
                await service.getEstablishmentsWithProviderValues(ESTABLISHMENT_ID);
                expect(findEstablishmentsBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("should filter establishments by siret", async () => {
                const expected = 1;
                findEstablishmentsBySirenMock.mockResolvedValueOnce([
                    { siret: [{ value: SIRET.value }] },
                    { siret: [{ value: SIREN.toSiret("00002").value }] },
                ]);
                const actual = await service.getEstablishmentsWithProviderValues(ESTABLISHMENT_ID);
                expect(actual).toHaveLength(expected);
            });
        });

        describe("findEstablishmentsBySiren", () => {
            const SIREN = new Siren("000000000");

            let mockGetDefaultDateModifSiren: jest.SpyInstance;
            let toEstablishmentMock: jest.SpyInstance;

            beforeAll(() => {
                mockGetDefaultDateModifSiren = jest
                    // @ts-expect-error: private method
                    .spyOn(service, "getDefaultDateModifSiren")
                    // @ts-expect-error: mock
                    .mockReturnValue("1900-01-01");
                toEstablishmentMock = jest
                    .spyOn(ApiAssoDtoMapper, "toEstablishment")
                    .mockImplementation(data => data as unknown as EstablishmentWithProviderValues);
            });

            afterAll(() => {
                mockGetDefaultDateModifSiren.mockRestore();
                toEstablishmentMock.mockRestore();
            });

            it("calls adapter", async () => {
                await service.findEstablishmentsBySiren(SIREN);

                expect(mockAdapter.getStructure).toHaveBeenCalledWith(SIREN);
            });

            it("returns empty array if no establishment found", async () => {
                mockAdapter.getStructure.mockResolvedValueOnce(null);
                const actual = await service.findEstablishmentsBySiren(SIREN);
                expect(actual).toHaveLength(0);
            });

            it("returns empty array if structure.identite has empty properties", async () => {
                mockAdapter.getStructure.mockResolvedValueOnce({
                    date_modif_siren: null,
                    id_siren: null,
                });
                const expected = [];
                const actual = await service.findEstablishmentsBySiren(SIREN);
                expect(actual).toEqual(expected);
            });

            it("maps structure to establishment", async () => {
                mockAdapter.getStructure.mockResolvedValue(fixtureAsso);
                await service.findEstablishmentsBySiren(SIREN);
                expect(toEstablishmentMock).toHaveBeenCalledTimes(fixtureAsso.etablissement.length);
            });

            it("should call getDefaultDateModifSiren()", async () => {
                const STRUCTURE = { ...fixtureAsso, identite: { date_modif_siren: undefined } };
                mockAdapter.getStructure.mockResolvedValueOnce(STRUCTURE);
                await service.findEstablishmentsBySiren(SIREN);
                expect(mockGetDefaultDateModifSiren).toHaveBeenCalledWith(STRUCTURE);
            });
        });
    });

    describe("Documents part", () => {
        describe("filterRnaDocuments", () => {
            it("should keep just right type", () => {
                const expected = [
                    {
                        sous_type: "MD",
                        annee: 2022,
                        time: 0,
                    },
                ];

                const documents = [
                    ...expected,
                    {
                        sous_type: "WRONG",
                        annee: 2022,
                        time: 0,
                    },
                ];

                // @ts-expect-error filterRnaDocuments has private method
                const actual = service.filterRnaDocuments(documents);

                expect(actual).toEqual(expected);
            });

            it("should keep just most recent", () => {
                const expected = [
                    {
                        sous_type: "MD",
                        annee: 2022,
                        time: 0,
                    },
                ];

                const documents = [
                    ...expected,
                    {
                        sous_type: "MD",
                        annee: 2021,
                        time: 0,
                    },
                ];

                // @ts-expect-error filterRnaDocuments has private method
                const actual = service.filterRnaDocuments(documents);

                expect(actual).toEqual(expected);
            });
        });

        describe("filterDacDocuments", () => {
            it("should keep just right type", () => {
                const expected = [
                    {
                        meta: {
                            type: "RFA",
                        },
                        time_depot: new Date().toString(),
                    },
                ];

                const documents = [
                    ...expected,
                    {
                        meta: {
                            type: "WRONG",
                        },
                        time_depot: new Date().toString(),
                    },
                ];

                // @ts-expect-error filterDacDocuments has private method
                const actual = service.filterDacDocuments(documents);

                expect(actual).toEqual(expected);
            });

            it("should keep just most recent", () => {
                const expected = [
                    {
                        meta: {
                            type: "RFA",
                        },
                        time_depot: new Date().toString(),
                    },
                ];

                const documents = [
                    ...expected,
                    {
                        meta: {
                            type: "RFA",
                        },
                        time_depot: new Date(2021, 1).toString(),
                    },
                ];

                // @ts-expect-error filterDacDocuments has private method
                const actual = service.filterDacDocuments(documents);

                expect(actual).toEqual(expected);
            });
        });

        describe("filterRibsInDacDocuments", () => {
            it("should keep just right type", () => {
                const expected = [
                    {
                        meta: {
                            type: "RIB",
                            iban: "",
                        },
                        url: "FAKE_URL",
                    },
                ];

                const documents = [
                    ...expected,
                    {
                        meta: {
                            type: "WRONG",
                        },
                    },
                ];

                // @ts-expect-error filterRibsInDacDocuments has private method
                const actual = service.filterRibsInDacDocuments(documents);

                expect(actual).toEqual(expected);
            });
        });

        describe("filterActiveDacDocuments", () => {
            it("should keep just active documents", () => {
                const expected = [
                    {
                        meta: {
                            etat: "courant",
                        },
                    },
                    {
                        meta: {
                            etat: "courant",
                        },
                    },
                ];

                const documents = [
                    ...expected,
                    {
                        meta: {
                            etat: "WRONG",
                        },
                    },
                ];

                // @ts-expect-error filterActiveDacDocuments has private method
                const actual = service.filterActiveDacDocuments(documents);

                expect(actual).toEqual(expected);
            });
        });

        describe("fetchDocuments", () => {
            const ASSOCIATION_ID = AssociationIdentifier.fromRna(RNA);
            it("calls adapter", async () => {
                // @ts-expect-error: private method
                await service.fetchDocuments(ASSOCIATION_ID);
                expect(mockAdapter.getDocuments).toHaveBeenCalledWith(RNA);
            });

            it("return documents", async () => {
                const API_ASSO_RESPONSE = {
                    asso: {
                        documents: {
                            document_dac: [],
                            document_rna: [],
                        },
                    },
                };
                const expected = API_ASSO_RESPONSE.asso.documents;
                mockAdapter.getDocuments.mockResolvedValue(API_ASSO_RESPONSE);
                // @ts-expect-error: private method
                const actual = await service.fetchDocuments(ASSOCIATION_ID);
                expect(actual).toEqual(expected);
            });

            it("turns single docs to array", async () => {
                const expected = {
                    document_dac: ["something"],
                    document_rna: ["else"],
                };
                mockAdapter.getDocuments.mockResolvedValue({
                    asso: {
                        documents: {
                            document_dac: "something",
                            document_rna: "else",
                        },
                    },
                });
                // @ts-expect-error: private method
                const actual = await service.fetchDocuments(ASSOCIATION_ID);
                expect(actual).toEqual(expected);
            });

            it("does not fail if no result from axios", async () => {
                mockAdapter.getDocuments.mockResolvedValue(null);
                // @ts-expect-error: private method
                const test = async () => await service.fetchDocuments(ASSOCIATION_ID);
                await expect(test).resolves;
            });
        });

        describe("findDocuments", () => {
            const SIREN = new Siren("123456789");
            const ASSOCIATION_ID = AssociationIdentifier.fromSiren(SIREN);

            // @ts-expect-error: mock
            const mockFilterRnaDocuments = jest.spyOn(service, "filterRnaDocuments");
            // @ts-expect-error: mock
            const mockFilterActiveDacDocuments = jest.spyOn(service, "filterActiveDacDocuments");
            // @ts-expect-error: mock
            const mockFilterDacDocuments = jest.spyOn(service, "filterDacDocuments");
            // @ts-expect-error: mock
            const mockFilterRibsInDacDocuments = jest.spyOn(service, "filterRibsInDacDocuments");
            // @ts-expect-error: mock
            const fetchDocumentsMock: jest.SpyInstance = jest.spyOn(service, "fetchDocuments");

            beforeAll(() => {
                // @ts-expect-error filterRnaDocuments has private method
                mockFilterRnaDocuments.mockImplementation(() => []);
                // @ts-expect-error filterActiveDacDocuments has private method
                mockFilterActiveDacDocuments.mockImplementation(() => []);
                // @ts-expect-error filterDacDocuments has private method
                mockFilterDacDocuments.mockImplementation(() => []);
                // @ts-expect-error filterRibsInDacDocuments has private method
                mockFilterRibsInDacDocuments.mockImplementation(() => []);
            });

            it("should call filterRnaDocuments with document_rna", async () => {
                const expected = [
                    {
                        sous_type: "PV",
                    },
                ];

                const documents = {
                    document_rna: expected,
                } as unknown as DocumentsDto;

                fetchDocumentsMock.mockResolvedValueOnce(documents);

                // @ts-expect-error findDocuments has private method
                await service.findDocuments(ASSOCIATION_ID);

                expect(mockFilterRnaDocuments).toHaveBeenCalledWith(expected);
            });

            it("should call filterRnaDocuments with empty array", async () => {
                const expected = [];

                const documents = {
                    document_rna: expected,
                } as unknown as DocumentsDto;

                fetchDocumentsMock.mockResolvedValueOnce(documents);

                // @ts-expect-error findDocuments has private method
                await service.findDocuments(ASSOCIATION_ID);

                expect(mockFilterRnaDocuments).toHaveBeenCalledWith(expected);
            });

            it("should call filterActiveDacDocuments with document_dac", async () => {
                const expected = [
                    {
                        meta: {
                            type: "RFA",
                        },
                    },
                ];

                const documents = {
                    document_dac: expected,
                } as unknown as DocumentsDto;

                fetchDocumentsMock.mockResolvedValueOnce(documents);

                // @ts-expect-error findDocuments has private method
                await service.findDocuments(ASSOCIATION_ID);

                expect(mockFilterActiveDacDocuments).toHaveBeenCalledWith(expected, ASSOCIATION_ID);
            });

            it("should call filterActiveDacDocuments with empty array", async () => {
                const expected = [];

                const documents = {
                    document_dac: expected,
                } as unknown as DocumentsDto;

                fetchDocumentsMock.mockResolvedValueOnce(documents);

                // @ts-expect-error findDocuments has private method
                await service.findDocuments(ASSOCIATION_ID);

                expect(mockFilterActiveDacDocuments).toHaveBeenCalledWith(expected, ASSOCIATION_ID);
            });

            it("should call filterDacDocuments with actives document_dac", async () => {
                const expected = [
                    {
                        meta: {
                            type: "RFA",
                        },
                    },
                ];

                const documents = {
                    document_dac: expected,
                } as unknown as DocumentsDto;

                fetchDocumentsMock.mockResolvedValueOnce(documents);
                // @ts-expect-error: mock
                mockFilterActiveDacDocuments.mockImplementationOnce(data => data);

                // @ts-expect-error findDocuments has private method
                await service.findDocuments(ASSOCIATION_ID);

                expect(mockFilterDacDocuments).toHaveBeenCalledWith(expected);
            });

            it("should call filterRibsInDacDocuments with actives document_dac", async () => {
                const expected = [
                    {
                        meta: {
                            type: "RFA",
                        },
                    },
                ];

                const documents = {
                    document_dac: expected,
                } as unknown as DocumentsDto;

                fetchDocumentsMock.mockResolvedValueOnce(documents);

                // @ts-expect-error: mock
                mockFilterActiveDacDocuments.mockImplementationOnce(data => data);

                // @ts-expect-error findDocuments has private method
                await service.findDocuments(ASSOCIATION_ID);

                expect(mockFilterRibsInDacDocuments).toHaveBeenCalledWith(expected);
            });

            it("should call ApiAssoDtoAdapter.rnaDocumentToDocument with document_rna", async () => {
                const expected = {
                    sous_type: "PV",
                };

                const documents = {
                    document_rna: [expected],
                } as unknown as DocumentsDto;

                fetchDocumentsMock.mockResolvedValueOnce(documents);

                // @ts-expect-error: mock
                mockFilterRnaDocuments.mockImplementationOnce(data => data);

                // @ts-expect-error findDocuments has private method
                await service.findDocuments(ASSOCIATION_ID);

                expect(ApiAssoDtoMapper.rnaDocumentToDocument).toHaveBeenCalledWith(expected);
            });

            it("should call ApiAssoDtoAdapter.dacDocumentToDocument with document_dac", async () => {
                const expected = {
                    meta: {
                        type: "RFA",
                    },
                };

                const documents = {
                    document_dac: [expected],
                } as unknown as DocumentsDto;

                fetchDocumentsMock.mockResolvedValueOnce(documents);

                // @ts-expect-error: mock
                mockFilterActiveDacDocuments.mockImplementationOnce(data => data);
                // @ts-expect-error: mock
                mockFilterDacDocuments.mockImplementationOnce(data => data);

                // @ts-expect-error findDocuments has private method
                await service.findDocuments(ASSOCIATION_ID);

                expect(ApiAssoDtoMapper.dacDocumentToDocument).toHaveBeenCalledWith(expected);
            });

            it("should call ApiAssoDtoAdapter.dacDocumentToDocument with ribs document_dac", async () => {
                const expected = {
                    meta: {
                        type: "RIB",
                    },
                };

                const documents = {
                    document_dac: [expected],
                } as unknown as DocumentsDto;

                fetchDocumentsMock.mockResolvedValueOnce(documents);

                // @ts-expect-error: mock
                mockFilterActiveDacDocuments.mockImplementationOnce(data => data);
                // @ts-expect-error: mock
                mockFilterRibsInDacDocuments.mockImplementationOnce(data => data);
                // @ts-expect-error: mock
                ApiAssoDtoMapper.dacDocumentToDocument.mockImplementationOnce(data => data);

                // @ts-expect-error findDocuments has private method
                await service.findDocuments(ASSOCIATION_ID);

                expect(ApiAssoDtoMapper.dacDocumentToRib).toHaveBeenCalledWith(expected);
            });
        });

        describe("getDocuments", () => {
            const SIREN = new Siren("000000000");
            const ASSOCIATION_ID = AssociationIdentifier.fromSiren(SIREN);
            const SIRET = SIREN.toSiret("00001");
            const ESTABLISHMENT_ID = EstablishmentIdentifier.fromSiret(SIRET, ASSOCIATION_ID);

            let findDocumentsMock: jest.SpyInstance;

            beforeAll(() => {
                // @ts-expect-error: mock private method
                findDocumentsMock = jest.spyOn(service, "findDocuments");
            });

            afterAll(() => {
                findDocumentsMock.mockRestore();
            });

            it("should call findDocuments", async () => {
                findDocumentsMock.mockResolvedValueOnce([]);
                await service.getDocuments(ASSOCIATION_ID);
                expect(findDocumentsMock).toHaveBeenCalledWith(ASSOCIATION_ID);
            });

            it("should call findDocuments with establishment identifier", async () => {
                findDocumentsMock.mockResolvedValueOnce([]);
                await service.getDocuments(ESTABLISHMENT_ID);
                expect(findDocumentsMock).toHaveBeenCalledWith(ASSOCIATION_ID);
            });

            it("should filter documents by siret", async () => {
                const expected = 1;
                findDocumentsMock.mockResolvedValueOnce([
                    { __meta__: { siret: SIRET.value } },
                    { __meta__: { siret: SIREN.toSiret("00002").value } },
                ]);
                const actual = await service.getDocuments(ESTABLISHMENT_ID);
                expect(actual).toHaveLength(expected);
            });
        });
    });
});
