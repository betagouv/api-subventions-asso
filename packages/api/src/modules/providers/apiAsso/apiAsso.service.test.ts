import axios from "axios";
import { Association, Etablissement } from "@api-subventions-asso/dto";
import ApiAssoDtoAdapter from "./adapters/ApiAssoDtoAdapter";
import apiAssoService from "./apiAsso.service";
import { DacDtoDocument, DacSiret, DtoDocument, RnaDtoDocument } from "./__fixtures__/DtoDocumentFixture";
import associationNameService from "../../association-name/associationName.service";
import { sirenStructureFixture } from "./__fixtures__/SirenStructureFixture";
import { rnaStructureFixture } from "./__fixtures__/RnaStructureFixture";
import { fixtureAsso } from "./__fixtures__/ApiAssoStructureFixture";

jest.mock("../../../shared/EventManager");
jest.mock("./adapters/ApiAssoDtoAdapter", () => ({
    rnaDocumentToDocument: jest.fn().mockImplementation(() => RnaDtoDocument),
    dacDocumentToDocument: jest.fn().mockImplementation(() => DacDtoDocument),
    dacDocumentToRib: jest.fn(),
    toEtablissement: r => ({ ...r, siret: [{ value: r.id_siret }] } as unknown as Etablissement),
    rnaStructureToAssociation: jest.fn().mockImplementation(data => data),
    sirenStructureToAssociation: jest.fn().mockImplementation(data => data),
}));

describe("ApiAssoService", () => {
    let axiosMock = jest.spyOn(axios, "get");
    // @ts-expect-error: mock private method
    let sendRequestMock = jest.spyOn(apiAssoService, "sendRequest") as jest.SpyInstance<any | null>;
    // @ts-expect-error: mock private method
    let mockFetchDocuments = jest.spyOn(apiAssoService, "fetchDocuments") as jest.SpyInstance<any | null>;
    // @ts-expect-error: mock private method
    const findDocumentsMock = jest.spyOn(apiAssoService, "findDocuments") as jest.SpyInstance<any | null>;

    let associationNameUpsert: jest.SpyInstance;

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
        // @ts-expect-error  mock mongodb return value
        associationNameUpsert = jest.spyOn(associationNameService, "upsert").mockResolvedValue({});
    });

    afterAll(() => {
        associationNameUpsert.mockReset();
    });

    describe("sendRequest", () => {
        // @ts-ignore
        const cache = apiAssoService.requestCache;
        const cacheHasMock = jest.spyOn(cache, "has");
        const cacheGetMock = jest.spyOn(cache, "get");

        afterAll(() => {
            cacheHasMock.mockClear();
            cacheGetMock.mockClear();
        });

        it("should return cache data", async () => {
            const expected = "FAKEDATA";

            cacheHasMock.mockImplementationOnce(() => true);
            cacheGetMock.mockImplementationOnce(() => [expected]);

            // @ts-ignore
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        });

        it("should return api data", async () => {
            const expected = "FAKEDATA";
            axiosMock.mockImplementationOnce(() =>
                Promise.resolve({
                    status: 200,
                    data: expected,
                }),
            );
            cacheHasMock.mockImplementationOnce(() => false);

            // @ts-ignore
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        });

        it("should return null (wrong status code)", async () => {
            const expected = null;
            axiosMock.mockImplementationOnce(() =>
                Promise.resolve({
                    status: 404,
                    data: 1,
                }),
            );
            cacheHasMock.mockImplementationOnce(() => false);

            // @ts-ignore
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        });

        it("should return null (error is throw)", async () => {
            const expected = null;
            axiosMock.mockImplementationOnce(() => {
                throw new Error("Error test");
            });
            cacheHasMock.mockImplementationOnce(() => false);

            // @ts-ignore
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        });
    });

    describe("fetchDocuments", () => {
        it("call sendRequest()", async () => {
            // @ts-expect-error: private method
            await apiAssoService.fetchDocuments(RNA);
            expect(sendRequestMock).toHaveBeenCalledWith(`/proxy_db_asso/documents/${RNA}`);
        });

        it("return documents", async () => {
            const expected = API_ASSO_RESPONSE.asso.documents;
            sendRequestMock.mockImplementationOnce(async () => API_ASSO_RESPONSE);
            // @ts-expect-error: private method
            const actual = await apiAssoService.fetchDocuments(RNA);
            expect(actual).toEqual(expected);
        });

        it("does not fail if no result from axios", async () => {
            const expected = undefined;
            sendRequestMock.mockImplementationOnce(async () => null);
            // @ts-expect-error: private method
            const test = async () => await apiAssoService.fetchDocuments(RNA);
            await expect(test).resolves;
        });
    });

    describe("Association Provider Part", () => {
        describe("getAssociationsBySiren", () => {
            let findAssociationBySirenMock: jest.SpyInstance;
            let getGroupedIdentifiersMock: jest.SpyInstance;
            let findAssociationByRnaMock: jest.SpyInstance;

            beforeAll(() => {
                findAssociationBySirenMock = jest
                    // @ts-expect-error findAssociationBySiren is private method
                    .spyOn(apiAssoService, "findAssociationBySiren")
                    // @ts-ignore because previous line is ignored this line is not happy
                    .mockResolvedValue(sirenStructureFixture);
                getGroupedIdentifiersMock = jest
                    .spyOn(associationNameService, "getGroupedIdentifiers")
                    .mockImplementation(async siren => ({ siren, rna: undefined }));
                // @ts-expect-error findAssociationByRna is private method
                findAssociationByRnaMock = jest.spyOn(apiAssoService, "findAssociationByRna").mockResolvedValue(null);
            });

            afterAll(() => {
                findAssociationBySirenMock.mockRestore();
                getGroupedIdentifiersMock.mockRestore();
                findAssociationByRnaMock.mockRestore();
            });

            it("should return one association", async () => {
                const expected = 1;
                const actual = await apiAssoService.getAssociationsBySiren("509221941");

                expect(actual).toHaveLength(expected);
            });

            it("should return one association, because rna structure not found", async () => {
                const expected = 1;
                getGroupedIdentifiersMock.mockResolvedValue({ siren: "509221941", rna: "W000000000" });
                const actual = await apiAssoService.getAssociationsBySiren("509221941");

                expect(actual).toHaveLength(expected);
            });

            it("should return two associations (With rna asso)", async () => {
                const expected = 2;
                getGroupedIdentifiersMock.mockResolvedValue({ siren: "509221941", rna: "W000000000" });
                findAssociationByRnaMock.mockResolvedValueOnce(rnaStructureFixture);
                const actual = await apiAssoService.getAssociationsBySiren("509221941");

                expect(actual).toHaveLength(expected);
            });

            it("should return association", async () => {
                const expected = [sirenStructureFixture];
                const actual = await apiAssoService.getAssociationsBySiren("509221941");

                expect(actual).toEqual(expected);
            });

            it("should return null", async () => {
                const expected = null;

                findAssociationBySirenMock.mockResolvedValueOnce(null);

                const actual = await apiAssoService.getAssociationsBySiren("00");
                expect(actual).toBe(expected);
            });
        });

        describe("getAssociationsBySiret", () => {
            let getAssociationsBySirenMock: jest.SpyInstance;

            beforeAll(() => {
                getAssociationsBySirenMock = jest
                    .spyOn(apiAssoService, "getAssociationsBySiren")
                    .mockResolvedValue([sirenStructureFixture as unknown as Association]);
            });

            afterAll(() => {
                getAssociationsBySirenMock.mockRestore();
            });

            it("should return one association", async () => {
                const expected = 1;
                const actual = await apiAssoService.getAssociationsBySiret("50922194100000");

                expect(actual).toHaveLength(expected);
            });

            it("should return association", async () => {
                const expected = [expect.objectContaining(sirenStructureFixture)];
                const actual = await apiAssoService.getAssociationsBySiret("50922194100000");

                expect(actual).toEqual(expected);
            });

            it("should return null", async () => {
                const expected = null;
                getAssociationsBySirenMock.mockResolvedValue(expected);
                const actual = await apiAssoService.getAssociationsBySiret("00");
                expect(actual).toBe(expected);
            });
        });

        describe("getAssociationsByRna", () => {
            let findAssociationBySirenMock: jest.SpyInstance;
            let getGroupedIdentifiersMock: jest.SpyInstance;
            let findAssociationByRnaMock: jest.SpyInstance;

            beforeAll(() => {
                findAssociationByRnaMock = jest
                    // @ts-expect-error findAssociationBySiren is private method
                    .spyOn(apiAssoService, "findAssociationByRna")
                    // @ts-ignore because previous line is ignored this line is not happy
                    .mockResolvedValue(rnaStructureFixture);
                getGroupedIdentifiersMock = jest
                    .spyOn(associationNameService, "getGroupedIdentifiers")
                    .mockImplementation(async rna => ({ siren: undefined, rna }));
                findAssociationBySirenMock = jest
                    // @ts-expect-error findAssociationByRna is private method
                    .spyOn(apiAssoService, "findAssociationBySiren")
                    // @ts-ignore because previous line is ignored this line is not happy
                    .mockResolvedValue(null);
            });

            afterAll(() => {
                findAssociationByRnaMock.mockRestore();
                getGroupedIdentifiersMock.mockRestore();
                findAssociationBySirenMock.mockRestore();
            });

            it("should return one association", async () => {
                const expected = 1;
                const actual = await apiAssoService.getAssociationsByRna("W000000000");

                expect(actual).toHaveLength(expected);
            });

            it("should return one association, because siren structure not found", async () => {
                const expected = 1;
                getGroupedIdentifiersMock.mockResolvedValue({ siren: "509221941", rna: "W000000000" });
                const actual = await apiAssoService.getAssociationsByRna("W000000000");

                expect(actual).toHaveLength(expected);
            });

            it("should return two associations (With siren asso)", async () => {
                const expected = 2;
                getGroupedIdentifiersMock.mockResolvedValue({ siren: "509221941", rna: "W000000000" });
                findAssociationBySirenMock.mockResolvedValueOnce(sirenStructureFixture);
                const actual = await apiAssoService.getAssociationsByRna("W000000000");

                expect(actual).toHaveLength(expected);
            });

            it("should return association", async () => {
                const expected = [rnaStructureFixture];
                const actual = await apiAssoService.getAssociationsByRna("W000000000");

                expect(actual).toEqual(expected);
            });

            it("should return null", async () => {
                const expected = null;

                findAssociationByRnaMock.mockResolvedValueOnce(null);

                const actual = await apiAssoService.getAssociationsByRna("W000000000");
                expect(actual).toBe(expected);
            });
        });

        describe("findAssociationByRna", () => {
            const RNA = "W000000000";
            let sendRequestMock: jest.SpyInstance;

            beforeAll(() => {
                // @ts-ignore sendRequest is private Method
                sendRequestMock = jest.spyOn(apiAssoService, "sendRequest").mockResolvedValue(null);
            });

            afterAll(() => {
                sendRequestMock.mockRestore();
            });

            it("should send a request", async () => {
                // @ts-ignore findAssociationByRna is private method
                await apiAssoService.findAssociationByRna(RNA);

                expect(sendRequestMock).toHaveBeenCalledTimes(1);
            });

            it("should use adapter", async () => {
                const expected = { data: true };
                sendRequestMock.mockResolvedValue(expected);
                // @ts-ignore findAssociationByRna is private method
                await apiAssoService.findAssociationByRna(RNA);

                expect(ApiAssoDtoAdapter.rnaStructureToAssociation).toBeCalledWith(expected);
            });
        });

        describe("findAssociationBySiren", () => {
            const SIREN = "000000000";
            let sendRequestMock: jest.SpyInstance;

            beforeAll(() => {
                // @ts-ignore sendRequest is private Method
                sendRequestMock = jest.spyOn(apiAssoService, "sendRequest").mockResolvedValue(null);
            });

            afterAll(() => {
                sendRequestMock.mockRestore();
            });

            it("should send a request", async () => {
                // @ts-ignore findAssociationBySiren is private method
                await apiAssoService.findAssociationBySiren(SIREN);

                expect(sendRequestMock).toHaveBeenCalledTimes(1);
            });

            it("should use adapter", async () => {
                const expected = { data: true };
                sendRequestMock.mockResolvedValue(expected);
                // @ts-ignore findAssociationBySiren is private method
                await apiAssoService.findAssociationBySiren(SIREN);

                expect(ApiAssoDtoAdapter.sirenStructureToAssociation).toBeCalledWith(expected);
            });
        });
    });

    describe("Etablissement part", () => {
        describe("getEtablissementsBySiret", () => {
            const SIRET = "00000000000000";

            let getEtablissementsBySirenMock: jest.SpyInstance;

            beforeAll(() => {
                getEtablissementsBySirenMock = jest
                    .spyOn(apiAssoService, "getEtablissementsBySiren")
                    .mockResolvedValue([{ siret: [{ value: SIRET }] } as unknown as Etablissement]);
            });

            afterAll(() => {
                getEtablissementsBySirenMock.mockRestore();
            });

            it("should return one etablissement", async () => {
                const expected = 1;
                const actual = await apiAssoService.getEtablissementsBySiret(SIRET);
                expect(actual).toHaveLength(expected);
            });

            it("should return null", async () => {
                const expected = null;
                getEtablissementsBySirenMock.mockReturnValueOnce(null);
                const actual = await apiAssoService.getEtablissementsBySiret(SIRET);
                expect(actual).toBe(expected);
            });
        });

        describe("getEtablissementsBySiren", () => {
            const SIREN = "000000000";
            const etablissement: Etablissement = [{ siret: [{ value: SIREN + "00000" }] }] as unknown as Etablissement;

            let findEtablissementsBySirenMock: jest.SpyInstance;

            beforeAll(() => {
                findEtablissementsBySirenMock = jest
                    // @ts-ignore findEtablissementsBySiren is private method
                    .spyOn(apiAssoService, "findEtablissementsBySiren")
                    // @ts-ignore because previous line is ignored this line is not happy
                    .mockResolvedValue([etablissement]);
            });

            afterAll(() => {
                findEtablissementsBySirenMock.mockRestore();
            });

            it("should return one etablissement", async () => {
                const expected = 1;
                const actual = await apiAssoService.getEtablissementsBySiren(SIREN);

                expect(actual).toHaveLength(expected);
            });

            it("should return null", async () => {
                const expected = null;

                findEtablissementsBySirenMock.mockResolvedValueOnce(null);

                const actual = await apiAssoService.getEtablissementsBySiren(SIREN);
                expect(actual).toBe(expected);
            });
        });

        describe("findEtablissementsBySiren", () => {
            const SIREN = "000000000";

            let sendRequestMock: jest.SpyInstance;
            let saveStructureInAssociationNameMock: jest.SpyInstance;
            let toEtablissementMock: jest.SpyInstance;

            beforeAll(() => {
                // @ts-ignore sendRequest is private method
                sendRequestMock = jest.spyOn(apiAssoService, "sendRequest").mockReturnValue(fixtureAsso);
                saveStructureInAssociationNameMock = jest
                    // @ts-ignore saveStructureInAssociationName is private method
                    .spyOn(apiAssoService, "saveStructureInAssociationName")
                    // @ts-ignore because previous line is ignored this line is not happy
                    .mockResolvedValue();
                toEtablissementMock = jest
                    .spyOn(ApiAssoDtoAdapter, "toEtablissement")
                    .mockImplementation(data => data as unknown as Etablissement);
            });

            afterAll(() => {
                sendRequestMock.mockRestore();
                saveStructureInAssociationNameMock.mockRestore();
                toEtablissementMock.mockRestore();
            });

            it("should send a request", async () => {
                // @ts-ignore findEtablissementsBySiren is private method
                await apiAssoService.findEtablissementsBySiren(SIREN);

                expect(sendRequestMock).toBeCalledTimes(1);
            });

            it("should return null", async () => {
                sendRequestMock.mockResolvedValueOnce(null);
                // @ts-ignore findEtablissementsBySiren is private method
                const actual = await apiAssoService.findEtablissementsBySiren(SIREN);

                expect(actual).toBe(null);
            });

            it("should call saveStructureInAssociationName", async () => {
                // @ts-ignore findEtablissementsBySiren is private method
                await apiAssoService.findEtablissementsBySiren(SIREN);

                expect(saveStructureInAssociationNameMock).toHaveBeenCalledTimes(1);
            });

            it("should call adapter", async () => {
                // @ts-ignore findEtablissementsBySiren is private method
                await apiAssoService.findEtablissementsBySiren(SIREN);

                expect(toEtablissementMock).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe("Documents part", () => {
        afterAll(() => {
            axiosMock.mockReset();
        });
        beforeAll(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            apiAssoService.requestCache.destroy();

            axiosMock = jest.spyOn(axios, "get").mockResolvedValue({
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

                // @ts-ignore filterRnaDocuments has private method
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

                // @ts-ignore filterRnaDocuments has private method
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

                // @ts-ignore filterDacDocuments has private method
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

                // @ts-ignore filterDacDocuments has private method
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

                // @ts-ignore filterRibsInDacDocuments has private method
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

                // @ts-ignore filterActiveDacDocuments has private method
                const actual = apiAssoService.filterActiveDacDocuments(documents);

                expect(actual).toEqual(expected);
            });
        });

        describe("findDocuments", () => {
            const IDENTIFIER = "123456789";

            // @ts-expect-error: mock
            const mockFilterRnaDocuments = jest.spyOn(apiAssoService, "filterRnaDocuments");
            // @ts-expect-error: mock
            const mockFilterActiveDacDocuments = jest.spyOn(apiAssoService, "filterActiveDacDocuments");
            // @ts-expect-error: mock
            const mockFilterDacDocuments = jest.spyOn(apiAssoService, "filterDacDocuments");
            // @ts-expect-error: mock
            const mockFilterRibsInDacDocuments = jest.spyOn(apiAssoService, "filterRibsInDacDocuments");

            beforeAll(() => {
                // @ts-ignore filterRnaDocuments has private method
                mockFilterRnaDocuments.mockImplementation(() => []);
                // @ts-ignore filterActiveDacDocuments has private method
                mockFilterActiveDacDocuments.mockImplementation(() => []);
                // @ts-ignore filterDacDocuments has private method
                mockFilterDacDocuments.mockImplementation(() => []);
                // @ts-ignore filterRibsInDacDocuments has private method
                mockFilterRibsInDacDocuments.mockImplementation(() => []);
                // @ts-ignore sendRequestMock is private method
                sendRequestMock = jest.spyOn(apiAssoService, "sendRequest");
            });

            it("should call filterRnaDocuments with document_rna", async () => {
                const expected = [
                    {
                        sous_type: "PV",
                    },
                ];

                sendRequestMock.mockResolvedValueOnce({
                    asso: {
                        documents: {
                            document_rna: expected,
                        },
                    },
                });

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(mockFilterRnaDocuments).toHaveBeenCalledWith(expected);
            });

            it("should call filterRnaDocuments with empty array", async () => {
                const expected = [];

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {},
                    },
                }));

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

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

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {
                            document_dac: expected,
                        },
                    },
                }));

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(mockFilterActiveDacDocuments).toHaveBeenCalledWith(expected, IDENTIFIER);
            });

            it("should call filterActiveDacDocuments with empty array", async () => {
                const expected = [];

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {},
                    },
                }));

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(mockFilterActiveDacDocuments).toHaveBeenCalledWith(expected, IDENTIFIER);
            });

            it("should call filterDacDocuments with actives document_dac", async () => {
                const expected = [
                    {
                        meta: {
                            type: "RFA",
                        },
                    },
                ];

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {
                            document_dac: expected,
                        },
                    },
                }));

                // @ts-expect-error: mock
                mockFilterActiveDacDocuments.mockImplementationOnce(data => data);

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

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

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {
                            document_dac: expected,
                        },
                    },
                }));

                // @ts-expect-error: mock
                mockFilterActiveDacDocuments.mockImplementationOnce(data => data);

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(mockFilterRibsInDacDocuments).toHaveBeenCalledWith(expected);
            });

            it("should call ApiAssoDtoAdapter.rnaDocumentToDocument with document_rna", async () => {
                const expected = {
                    sous_type: "PV",
                };

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {
                            document_rna: [expected],
                        },
                    },
                }));

                // @ts-expect-error: mock
                mockFilterRnaDocuments.mockImplementationOnce(data => data);

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(ApiAssoDtoAdapter.rnaDocumentToDocument).toHaveBeenCalledWith(expected);
            });

            it("should call ApiAssoDtoAdapter.dacDocumentToDocument with document_dac", async () => {
                const expected = {
                    meta: {
                        type: "RFA",
                    },
                };

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {
                            document_dac: [expected],
                        },
                    },
                }));

                // @ts-expect-error: mock
                mockFilterActiveDacDocuments.mockImplementationOnce(data => data);
                // @ts-expect-error: mock
                mockFilterDacDocuments.mockImplementationOnce(data => data);

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(ApiAssoDtoAdapter.dacDocumentToDocument).toHaveBeenCalledWith(expected);
            });

            it("should call ApiAssoDtoAdapter.dacDocumentToDocument with ribs document_dac", async () => {
                const expected = {
                    meta: {
                        type: "RIB",
                    },
                };

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {
                            document_dac: [expected],
                        },
                    },
                }));

                // @ts-expect-error: mock
                mockFilterActiveDacDocuments.mockImplementationOnce(data => data);
                // @ts-expect-error: mock
                mockFilterRibsInDacDocuments.mockImplementationOnce(data => data);
                // @ts-expect-error: mock
                ApiAssoDtoAdapter.dacDocumentToDocument.mockImplementationOnce(data => data);

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(ApiAssoDtoAdapter.dacDocumentToRib).toHaveBeenCalledWith(expected);
            });
        });

        describe("getDocumentsBySiret", () => {
            it("should return one document", async () => {
                findDocumentsMock.mockImplementationOnce(async () => DtoDocument);
                const expected = 1;
                const actual = await apiAssoService.getDocumentsBySiret(DacSiret);
                expect(actual).toHaveLength(expected);
            });

            it("should return null", async () => {
                const expected = null;
                findDocumentsMock.mockImplementationOnce(() => Promise.resolve(null));
                const actual = await apiAssoService.getDocumentsBySiret("");
                expect(actual).toBe(expected);
            });
        });

        describe("getDocumentsBySiren", () => {
            it("should return 2 documents", async () => {
                findDocumentsMock.mockImplementationOnce(async () => DtoDocument);
                const expected = 2;
                const actual = await apiAssoService.getDocumentsBySiren("");
                expect(actual).toHaveLength(expected);
            });

            it("should return null", async () => {
                findDocumentsMock.mockImplementationOnce(() => Promise.resolve(null));
                const expected = null;
                const actual = await apiAssoService.getDocumentsBySiren("");
                expect(actual).toBe(expected);
            });
        });

        describe("getDocumentsByRna", () => {
            it("should return 2 documents", async () => {
                findDocumentsMock.mockImplementationOnce(async () => DtoDocument);
                const expected = 2;
                const actual = await apiAssoService.getDocumentsByRna("");
                expect(actual).toHaveLength(expected);
            });

            it("should return null", async () => {
                findDocumentsMock.mockImplementationOnce(() => Promise.resolve(null));
                const expected = null;
                const actual = await apiAssoService.getDocumentsByRna("");
                expect(actual).toBe(expected);
            });
        });
    });
});
