import axios from "axios";
import { Establishment } from "dto";
import ApiAssoDtoAdapter from "./adapters/ApiAssoDtoAdapter";
import apiAssoService from "./apiAsso.service";
import { DacDtoDocument, RnaDtoDocument } from "./__fixtures__/DtoDocumentFixture";
import { fixtureAsso } from "./__fixtures__/ApiAssoStructureFixture";
import { SirenStructureDto } from "./dto/SirenStructureDto";
import * as ObjectHelper from "../../../shared/helpers/ObjectHelper";
import { DocumentsDto } from "./dto/StructureDto";
import Siren from "../../../identifierObjects/Siren";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import Rna from "../../../identifierObjects/Rna";
import EstablishmentIdentifier from "../../../identifierObjects/EstablishmentIdentifier";

jest.mock("../../../shared/helpers/ObjectHelper");
const mockedObjectHelper = jest.mocked(ObjectHelper);

jest.mock("./adapters/ApiAssoDtoAdapter", () => ({
    rnaDocumentToDocument: jest.fn().mockImplementation(() => RnaDtoDocument),
    dacDocumentToDocument: jest.fn().mockImplementation(() => DacDtoDocument),
    dacDocumentToRib: jest.fn(),
    toEstablishment: r => ({ ...r, siret: [{ value: r.id_siret }] }) as unknown as Establishment,
    rnaStructureToAssociation: jest.fn().mockImplementation(data => data),
    sirenStructureToAssociation: jest.fn().mockImplementation(data => data),
}));

describe("ApiAssoService", () => {
    let httpGetSpy: jest.SpyInstance;
    // @ts-expect-error: mock private method
    let mockSendRequest = jest.spyOn(apiAssoService, "sendRequest") as jest.SpyInstance<unknown | null>;

    const RNA = "W750000000";
    const API_ASSO_RESPONSE = {
        asso: {
            documents: {
                document_dac: [],
                document_rna: [],
            },
        },
    };

    beforeAll(() => {
        httpGetSpy = jest.spyOn(apiAssoService.http, "get");
    });

    describe("sendRequest", () => {
        // @ts-expect-error: access private prop
        const cache = apiAssoService.requestCache;
        const cacheGetMock = jest.spyOn(cache, "get");

        it("should return cache data", async () => {
            const expected = "FAKEDATA";

            cacheGetMock.mockImplementationOnce(() => expected);

            // @ts-expect-error: test private method
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        });

        it("should return api data", async () => {
            const expected = "FAKEDATA";
            httpGetSpy.mockResolvedValueOnce({
                status: 200,
                data: expected,
            });

            // @ts-expect-error: test private method
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        });

        it("should return null (wrong status code)", async () => {
            const expected = null;
            httpGetSpy.mockImplementationOnce(() =>
                Promise.resolve({
                    status: 404,
                    data: 1,
                }),
            );
            cacheGetMock.mockImplementationOnce(() => null);

            // @ts-expect-error: test private method
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        });

        it("should return null (dummy error message in data and status 200)", async () => {
            const expected = null;
            httpGetSpy.mockImplementationOnce(() =>
                Promise.resolve({
                    status: 200,
                    data: "Error",
                }),
            );
            cacheGetMock.mockImplementationOnce(() => null);

            // @ts-expect-error: test private method
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        });

        it("should return null (error is throw)", async () => {
            const expected = null;
            httpGetSpy.mockImplementationOnce(() => {
                throw new Error("Error test");
            });
            cacheGetMock.mockImplementationOnce(() => null);

            // @ts-expect-error: test private method
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        });
    });

    describe("findRnaSiren", () => {
        const RNA_STR = "W760938289";
        const SIREN_STR = "954983829";
        const RNA = new Rna(RNA_STR);

        beforeEach(() => {
            // @ts-expect-error: mock
            mockSendRequest.mockResolvedValue({ identite: { id_rna: RNA_STR, id_siren: SIREN_STR } });
        });

        afterAll(() => mockSendRequest.mockReset());

        it("should return null if identite is undefined", async () => {
            // @ts-expect-error: mock
            mockSendRequest.mockResolvedValueOnce({});
            const expected = null;
            const actual = await apiAssoService.findRnaSiren(RNA);
            expect(actual).toEqual(expected);
        });

        it("should return identifiers", async () => {
            // @ts-expect-error: mock
            mockSendRequest.mockResolvedValueOnce({
                identite: {
                    id_rna: RNA_STR,
                    id_siren: SIREN_STR,
                },
            });

            const expected = { rna: new Rna(RNA_STR), siren: new Siren(SIREN_STR) };
            const actual = await apiAssoService.findRnaSiren(RNA);
            expect(actual).toEqual(expected);
        });
    });

    describe("fetchDocuments", () => {
        const ASSOCIATION_ID = AssociationIdentifier.fromRna(new Rna(RNA));
        it("call sendRequest()", async () => {
            // @ts-expect-error: private method
            await apiAssoService.fetchDocuments(ASSOCIATION_ID);
            expect(mockSendRequest).toHaveBeenCalledWith(`/proxy_db_asso/documents/${RNA}`);
        });

        it("return documents", async () => {
            const expected = API_ASSO_RESPONSE.asso.documents;
            mockSendRequest.mockImplementationOnce(async () => API_ASSO_RESPONSE);
            // @ts-expect-error: private method
            const actual = await apiAssoService.fetchDocuments(ASSOCIATION_ID);
            expect(actual).toEqual(expected);
        });

        it("turns single docs to array", async () => {
            const expected = {
                document_dac: ["something"],
                document_rna: ["else"],
            };
            // @ts-expect-error: mock
            mockSendRequest.mockResolvedValue({
                asso: {
                    documents: {
                        document_dac: "something",
                        document_rna: "else",
                    },
                },
            });
            // @ts-expect-error: private method
            const actual = await apiAssoService.fetchDocuments(ASSOCIATION_ID);
            expect(actual).toEqual(expected);
        });

        it("does not fail if no result from axios", async () => {
            mockSendRequest.mockImplementationOnce(async () => null);
            // @ts-expect-error: private method
            const test = async () => await apiAssoService.fetchDocuments(ASSOCIATION_ID);
            await expect(test).resolves;
        });
    });

    describe("Association Provider Part", () => {
        const SIREN = new Siren("509221941");
        const RNA = new Rna("W750000000");
        const ASSOCIATION_ID_WITHOUT_RNA = AssociationIdentifier.fromSiren(SIREN);
        const ASSOCIATION_ID_WITH_RNA = AssociationIdentifier.fromRna(RNA);
        const ASSOCIATION_ID = AssociationIdentifier.fromSirenAndRna(SIREN, RNA);

        describe("getAssociations", () => {
            const findAssociationBySirenMock = jest.spyOn(apiAssoService, "findAssociationBySiren");
            const findAssociationByRnaMock = jest.spyOn(apiAssoService, "findAssociationByRna");

            it("should call findAssociationBySiren", async () => {
                findAssociationBySirenMock.mockResolvedValueOnce(null);
                await apiAssoService.getAssociations(ASSOCIATION_ID_WITHOUT_RNA);
                expect(findAssociationBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("should call findAssociationByRna", async () => {
                findAssociationByRnaMock.mockResolvedValueOnce(null);
                await apiAssoService.getAssociations(ASSOCIATION_ID_WITH_RNA);
                expect(findAssociationByRnaMock).toHaveBeenCalledWith(RNA);
            });

            it("should call findAssociationBySiren and findAssociationByRna", async () => {
                findAssociationBySirenMock.mockResolvedValueOnce(null);
                findAssociationByRnaMock.mockResolvedValueOnce(null);
                await apiAssoService.getAssociations(ASSOCIATION_ID);
                expect(findAssociationBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("should return empty array", async () => {
                findAssociationBySirenMock.mockResolvedValueOnce(null);
                const actual = await apiAssoService.getAssociations(ASSOCIATION_ID_WITHOUT_RNA);
                expect(actual).toHaveLength(0);
            });

            it("should return many associations", async () => {
                const expected = 2;
                // @ts-expect-error mock fake data
                findAssociationBySirenMock.mockResolvedValueOnce({ data: true });
                // @ts-expect-error: mock
                findAssociationByRnaMock.mockResolvedValueOnce({ data: true });
                const actual = await apiAssoService.getAssociations(ASSOCIATION_ID);
                expect(actual).toHaveLength(expected);
            });
        });

        describe("findAssociationByRna", () => {
            const RNA = new Rna("W000000000");
            let mockSendRequest: jest.SpyInstance;

            beforeAll(() => {
                mockedObjectHelper.hasEmptyProperties.mockReturnValue(false);
                // @ts-expect-error sendRequest is private Method
                mockSendRequest = jest.spyOn(apiAssoService, "sendRequest").mockResolvedValue(null);
            });

            afterAll(() => {
                mockSendRequest.mockRestore();
            });

            it("should send a request", async () => {
                await apiAssoService.findAssociationByRna(RNA);

                expect(mockSendRequest).toHaveBeenCalledTimes(1);
            });

            it("should return null if result without date", async () => {
                const expected = null;
                mockSendRequest.mockResolvedValue({ data: true, identite: { date_modif_rna: null } });
                const actual = await apiAssoService.findAssociationByRna(RNA);

                expect(actual).toBe(expected);
            });

            it("should return null if structure.identite has empty properties", async () => {
                mockedObjectHelper.hasEmptyProperties.mockReturnValueOnce(true);
                const expected = null;
                mockSendRequest.mockResolvedValue({ data: true, identite: {} });
                const actual = await apiAssoService.findAssociationByRna(RNA);
                expect(actual).toBe(expected);
            });

            it("should use adapter", async () => {
                const expected = { data: true, identite: { date_modif_rna: "smthg" } };
                mockSendRequest.mockResolvedValue(expected);
                await apiAssoService.findAssociationByRna(RNA);

                expect(ApiAssoDtoAdapter.rnaStructureToAssociation).toBeCalledWith(expected);
            });
        });

        describe("findAssociationBySiren", () => {
            const SIREN = new Siren("000000000");
            const ASSO_WITH_STRUCTURES = {
                data: true,
                identite: { date_modif_siren: "smthg" },
                etablissement: { length: 1 },
            };
            let mockSendRequest: jest.SpyInstance;
            let mockGetDefaultDateModifSiren: jest.SpyInstance;

            beforeAll(() => {
                mockedObjectHelper.hasEmptyProperties.mockReturnValue(false);
                // @ts-expect-error sendRequest is private Method
                mockSendRequest = jest.spyOn(apiAssoService, "sendRequest").mockResolvedValue(ASSO_WITH_STRUCTURES);
                mockGetDefaultDateModifSiren = jest
                    // @ts-expect-error: mock private method
                    .spyOn(apiAssoService, "getDefaultDateModifSiren")
                    // @ts-expect-error: mock
                    .mockReturnValue("1900-01-01");
            });

            afterAll(() => {
                mockSendRequest.mockRestore();
                mockGetDefaultDateModifSiren.mockRestore();
            });

            it("should send a request", async () => {
                await apiAssoService.findAssociationBySiren(SIREN);
                expect(mockSendRequest).toHaveBeenCalledTimes(1);
            });

            it("should call /structures if no establishment found", async () => {
                mockSendRequest.mockResolvedValueOnce({ data: true, identite: { date_modif_siren: "smthg" } });
                await apiAssoService.findAssociationBySiren(SIREN);
                expect(mockSendRequest).toHaveBeenCalledWith(`/api/structure/${SIREN}`);
            });

            it("should return null if result without date", async () => {
                const expected = null;
                mockSendRequest.mockResolvedValueOnce({ data: true, etablissement: { length: 1 } });
                const actual = await apiAssoService.findAssociationBySiren(SIREN);
                expect(actual).toBe(expected);
            });

            it("should return null if structure identite has empty properties", async () => {
                mockedObjectHelper.hasEmptyProperties.mockReturnValueOnce(true);
                // @ts-expect-error: mock wrong api response
                const STRUCTURE: SirenStructureDto = { identite: { date_modif_siren: null, nom: null, id_rna: null } };
                mockSendRequest.mockResolvedValueOnce(STRUCTURE);
                const actual = await apiAssoService.findAssociationBySiren(SIREN);
                expect(actual).toBe(null);
            });

            it("should use adapter", async () => {
                const expected = ASSO_WITH_STRUCTURES;
                await apiAssoService.findAssociationBySiren(SIREN);
                expect(ApiAssoDtoAdapter.sirenStructureToAssociation).toBeCalledWith(expected);
            });

            it("should call getDefaultDateModifSiren()", async () => {
                const STRUCTURE = {
                    ...ASSO_WITH_STRUCTURES,
                    identite: { date_modif_siren: undefined },
                };
                mockSendRequest.mockResolvedValueOnce(STRUCTURE);
                await apiAssoService.findAssociationBySiren(SIREN);
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
            const actual = apiAssoService.getDefaultDateModifSiren(structure);
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
            const actual = apiAssoService.getDefaultDateModifSiren(STRUCTURE);
            expect(actual).toEqual(expected);
        });
    });

    describe("getEstablishments part", () => {
        let findDocumentsMock: jest.SpyInstance;
        let findEstablishmentsBySirenMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error: mock private method
            findDocumentsMock = jest.spyOn(apiAssoService, "findDocuments");
            findEstablishmentsBySirenMock = jest.spyOn(apiAssoService, "findEstablishmentsBySiren");
        });

        afterAll(() => {
            findDocumentsMock.mockRestore();
        });

        describe("getEstablishments", () => {
            const SIREN = new Siren("000000000");
            const ASSOCIATION_ID = AssociationIdentifier.fromSiren(SIREN);
            const SIRET = SIREN.toSiret("00001");
            const ESTABLISHMENT_ID = EstablishmentIdentifier.fromSiret(SIRET, ASSOCIATION_ID);
            it("should call findEstablishmentsBySiren with Association identifier", async () => {
                findEstablishmentsBySirenMock.mockResolvedValueOnce([]);
                await apiAssoService.getEstablishments(ASSOCIATION_ID);
                expect(findEstablishmentsBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("should call findEstablishmentsBySiren with Establishment identifier", async () => {
                findEstablishmentsBySirenMock.mockResolvedValueOnce([]);
                await apiAssoService.getEstablishments(ESTABLISHMENT_ID);
                expect(findEstablishmentsBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("should filter establishments by siret", async () => {
                const expected = 1;
                findEstablishmentsBySirenMock.mockResolvedValueOnce([
                    { siret: [{ value: SIRET.value }] },
                    { siret: [{ value: SIREN.toSiret("00002").value }] },
                ]);
                const actual = await apiAssoService.getEstablishments(ESTABLISHMENT_ID);
                expect(actual).toHaveLength(expected);
            });
        });

        describe("findEstablishmentsBySiren", () => {
            const SIREN = new Siren("000000000");

            let mockSendRequest: jest.SpyInstance;
            let mockGetDefaultDateModifSiren: jest.SpyInstance;
            let toEstablishmentMock: jest.SpyInstance;

            beforeAll(() => {
                // @ts-expect-error sendRequest is private method
                mockSendRequest = jest.spyOn(apiAssoService, "sendRequest").mockReturnValue(fixtureAsso);
                mockGetDefaultDateModifSiren = jest
                    // @ts-expect-error: private method
                    .spyOn(apiAssoService, "getDefaultDateModifSiren")
                    // @ts-expect-error: mock
                    .mockReturnValue("1900-01-01");
                toEstablishmentMock = jest
                    .spyOn(ApiAssoDtoAdapter, "toEstablishment")
                    .mockImplementation(data => data as unknown as Establishment);
            });

            afterAll(() => {
                mockSendRequest.mockRestore();
                mockGetDefaultDateModifSiren.mockRestore();
                toEstablishmentMock.mockRestore();
            });

            it("should send a request", async () => {
                await apiAssoService.findEstablishmentsBySiren(SIREN);

                expect(mockSendRequest).toHaveBeenCalledTimes(1);
            });

            it("should return empty array", async () => {
                mockSendRequest.mockResolvedValueOnce(null);
                const actual = await apiAssoService.findEstablishmentsBySiren(SIREN);
                expect(actual).toHaveLength(0);
            });

            it("should return empty array if structure.identite has empty properties", async () => {
                mockSendRequest.mockResolvedValueOnce({
                    date_modif_siren: null,
                    id_siren: null,
                });
                const actual = await apiAssoService.findEstablishmentsBySiren(SIREN);
                expect(actual).toHaveLength(0);
            });

            it("should call adapter", async () => {
                await apiAssoService.findEstablishmentsBySiren(SIREN);
                expect(toEstablishmentMock).toHaveBeenCalledTimes(2);
            });

            it("should call getDefaultDateModifSiren()", async () => {
                const STRUCTURE = { ...fixtureAsso, identite: { date_modif_siren: undefined } };
                mockSendRequest.mockResolvedValueOnce(STRUCTURE);
                await apiAssoService.findEstablishmentsBySiren(SIREN);
                expect(mockGetDefaultDateModifSiren).toHaveBeenCalledWith(STRUCTURE);
            });
        });
    });

    describe("Documents part", () => {
        afterAll(() => {
            httpGetSpy.mockReset();
        });
        beforeAll(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            apiAssoService.requestCache.destroy();

            httpGetSpy = jest.spyOn(axios, "get").mockResolvedValue({
                status: 200,
                data: fixtureAsso,
            });
        });

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
                const actual = apiAssoService.filterRnaDocuments(documents);

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
                const actual = apiAssoService.filterRnaDocuments(documents);

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
                const actual = apiAssoService.filterDacDocuments(documents);

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
                const actual = apiAssoService.filterDacDocuments(documents);

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
                const actual = apiAssoService.filterRibsInDacDocuments(documents);

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
                const actual = apiAssoService.filterActiveDacDocuments(documents);

                expect(actual).toEqual(expected);
            });
        });

        describe("findDocuments", () => {
            const SIREN = new Siren("123456789");
            const ASSOCIATION_ID = AssociationIdentifier.fromSiren(SIREN);

            // @ts-expect-error: mock
            const mockFilterRnaDocuments = jest.spyOn(apiAssoService, "filterRnaDocuments");
            // @ts-expect-error: mock
            const mockFilterActiveDacDocuments = jest.spyOn(apiAssoService, "filterActiveDacDocuments");
            // @ts-expect-error: mock
            const mockFilterDacDocuments = jest.spyOn(apiAssoService, "filterDacDocuments");
            // @ts-expect-error: mock
            const mockFilterRibsInDacDocuments = jest.spyOn(apiAssoService, "filterRibsInDacDocuments");
            // @ts-expect-error: mock
            const fetchDocumentsMock: jest.SpyInstance = jest.spyOn(apiAssoService, "fetchDocuments");

            beforeAll(() => {
                // @ts-expect-error filterRnaDocuments has private method
                mockFilterRnaDocuments.mockImplementation(() => []);
                // @ts-expect-error filterActiveDacDocuments has private method
                mockFilterActiveDacDocuments.mockImplementation(() => []);
                // @ts-expect-error filterDacDocuments has private method
                mockFilterDacDocuments.mockImplementation(() => []);
                // @ts-expect-error filterRibsInDacDocuments has private method
                mockFilterRibsInDacDocuments.mockImplementation(() => []);
                // @ts-expect-error mockSendRequest is private method
                mockSendRequest = jest.spyOn(apiAssoService, "sendRequest");
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
                await apiAssoService.findDocuments(ASSOCIATION_ID);

                expect(mockFilterRnaDocuments).toHaveBeenCalledWith(expected);
            });

            it("should call filterRnaDocuments with empty array", async () => {
                const expected = [];

                const documents = {
                    document_rna: expected,
                } as unknown as DocumentsDto;

                fetchDocumentsMock.mockResolvedValueOnce(documents);

                // @ts-expect-error findDocuments has private method
                await apiAssoService.findDocuments(ASSOCIATION_ID);

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
                await apiAssoService.findDocuments(ASSOCIATION_ID);

                expect(mockFilterActiveDacDocuments).toHaveBeenCalledWith(expected, ASSOCIATION_ID);
            });

            it("should call filterActiveDacDocuments with empty array", async () => {
                const expected = [];

                const documents = {
                    document_dac: expected,
                } as unknown as DocumentsDto;

                fetchDocumentsMock.mockResolvedValueOnce(documents);

                // @ts-expect-error findDocuments has private method
                await apiAssoService.findDocuments(ASSOCIATION_ID);

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
                await apiAssoService.findDocuments(ASSOCIATION_ID);

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
                await apiAssoService.findDocuments(ASSOCIATION_ID);

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
                await apiAssoService.findDocuments(ASSOCIATION_ID);

                expect(ApiAssoDtoAdapter.rnaDocumentToDocument).toHaveBeenCalledWith(expected);
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
                await apiAssoService.findDocuments(ASSOCIATION_ID);

                expect(ApiAssoDtoAdapter.dacDocumentToDocument).toHaveBeenCalledWith(expected);
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
                ApiAssoDtoAdapter.dacDocumentToDocument.mockImplementationOnce(data => data);

                // @ts-expect-error findDocuments has private method
                await apiAssoService.findDocuments(ASSOCIATION_ID);

                expect(ApiAssoDtoAdapter.dacDocumentToRib).toHaveBeenCalledWith(expected);
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
                findDocumentsMock = jest.spyOn(apiAssoService, "findDocuments");
            });

            afterAll(() => {
                findDocumentsMock.mockRestore();
            });

            it("should call findDocuments", async () => {
                findDocumentsMock.mockResolvedValueOnce([]);
                await apiAssoService.getDocuments(ASSOCIATION_ID);
                expect(findDocumentsMock).toHaveBeenCalledWith(ASSOCIATION_ID);
            });

            it("should call findDocuments with establishment identifier", async () => {
                findDocumentsMock.mockResolvedValueOnce([]);
                await apiAssoService.getDocuments(ESTABLISHMENT_ID);
                expect(findDocumentsMock).toHaveBeenCalledWith(ASSOCIATION_ID);
            });

            it("should filter documents by siret", async () => {
                const expected = 1;
                findDocumentsMock.mockResolvedValueOnce([
                    { __meta__: { siret: SIRET.value } },
                    { __meta__: { siret: SIREN.toSiret("00002").value } },
                ]);
                const actual = await apiAssoService.getDocuments(ESTABLISHMENT_ID);
                expect(actual).toHaveLength(expected);
            });
        });
    });
});
