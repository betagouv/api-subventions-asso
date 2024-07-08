import axios from "axios";
import { Association, Etablissement } from "dto";
import ApiAssoDtoAdapter from "./adapters/ApiAssoDtoAdapter";
import apiAssoService from "./apiAsso.service";
import { DacDtoDocument, DacSiret, DtoDocument, RnaDtoDocument } from "./__fixtures__/DtoDocumentFixture";
import { sirenStructureFixture } from "./__fixtures__/SirenStructureFixture";
import { rnaStructureFixture } from "./__fixtures__/RnaStructureFixture";
import { fixtureAsso } from "./__fixtures__/ApiAssoStructureFixture";
import { SirenStructureDto } from "./dto/SirenStructureDto";
import * as ObjectHelper from "../../../shared/helpers/ObjectHelper";
import rnaSirenService from "../../rna-siren/rnaSiren.service";
import StructureDto from "./dto/StructureDto";
jest.mock("../../../shared/helpers/ObjectHelper");
const mockedObjectHelper = jest.mocked(ObjectHelper);

jest.mock("./adapters/ApiAssoDtoAdapter", () => ({
    rnaDocumentToDocument: jest.fn().mockImplementation(() => RnaDtoDocument),
    dacDocumentToDocument: jest.fn().mockImplementation(() => DacDtoDocument),
    dacDocumentToRib: jest.fn(),
    toEtablissement: r => ({ ...r, siret: [{ value: r.id_siret }] } as unknown as Etablissement),
    rnaStructureToAssociation: jest.fn().mockImplementation(data => data),
    sirenStructureToAssociation: jest.fn().mockImplementation(data => data),
}));

describe("ApiAssoService", () => {
    let httpGetSpy: jest.SpyInstance;
    // @ts-expect-error: mock private method
    let mockSendRequest = jest.spyOn(apiAssoService, "sendRequest") as jest.SpyInstance<any | null>;
    // @ts-expect-error: mock private method
    const findDocumentsMock = jest.spyOn(apiAssoService, "findDocuments") as jest.SpyInstance<any | null>;

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
        // @ts-expect-error http is private attribute
        httpGetSpy = jest.spyOn(apiAssoService.http, "get");
    });

    describe("sendRequest", () => {
        // @ts-ignore
        const cache = apiAssoService.requestCache;
        const cacheHasMock = jest.spyOn(cache, "has");
        const cacheGetMock = jest.spyOn(cache, "get");

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
            httpGetSpy.mockResolvedValueOnce({
                status: 200,
                data: expected,
            });
            cacheHasMock.mockImplementationOnce(() => false);

            // @ts-ignore
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
            cacheHasMock.mockImplementationOnce(() => false);

            // @ts-ignore
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
            cacheHasMock.mockImplementationOnce(() => false);

            // @ts-ignore
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        });

        it("should return null (error is throw)", async () => {
            const expected = null;
            httpGetSpy.mockImplementationOnce(() => {
                throw new Error("Error test");
            });
            cacheHasMock.mockImplementationOnce(() => false);

            // @ts-ignore
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        });
    });

    describe("findRnaSirenByIdentifiers", () => {
        const RNA = "W76009382";
        const SIREN = "954983829";

        beforeEach(() => {
            mockSendRequest.mockResolvedValue({ identite: { id_rna: RNA, id_siren: SIREN } });
        });

        afterAll(() => mockSendRequest.mockReset());

        it("should return undefined identifiers if identite is undefined", async () => {
            mockSendRequest.mockResolvedValueOnce({});
            const expected = { rna: undefined, siren: undefined };
            const actual = await apiAssoService.findRnaSirenByIdentifiers(RNA);
            expect(actual).toEqual(expected);
        });

        it("should return identifiers", async () => {
            const expected = { rna: RNA, siren: SIREN };
            const actual = await apiAssoService.findRnaSirenByIdentifiers(RNA);
            expect(actual).toEqual(expected);
        });
    });

    describe("fetchDocuments", () => {
        it("call sendRequest()", async () => {
            // @ts-expect-error: private method
            await apiAssoService.fetchDocuments(RNA);
            expect(mockSendRequest).toHaveBeenCalledWith(`/proxy_db_asso/documents/${RNA}`);
        });

        it("return documents", async () => {
            const expected = API_ASSO_RESPONSE.asso.documents;
            mockSendRequest.mockImplementationOnce(async () => API_ASSO_RESPONSE);
            // @ts-expect-error: private method
            const actual = await apiAssoService.fetchDocuments(RNA);
            expect(actual).toEqual(expected);
        });

        it("does not fail if no result from axios", async () => {
            const expected = undefined;
            mockSendRequest.mockImplementationOnce(async () => null);
            // @ts-expect-error: private method
            const test = async () => await apiAssoService.fetchDocuments(RNA);
            await expect(test).resolves;
        });
    });

    describe("Association Provider Part", () => {
        describe("getAssociationsBySiren", () => {
            let findAssociationBySirenMock: jest.SpyInstance;
            let findRnaSirenMock: jest.SpyInstance;
            let findAssociationByRnaMock: jest.SpyInstance;

            beforeAll(() => {
                findAssociationBySirenMock = jest
                    .spyOn(apiAssoService, "findAssociationBySiren")
                    // @ts-ignore because previous line is ignored this line is not happy
                    .mockResolvedValue(sirenStructureFixture);
                findRnaSirenMock = jest.spyOn(rnaSirenService, "find").mockResolvedValue(null);
                findAssociationByRnaMock = jest.spyOn(apiAssoService, "findAssociationByRna").mockResolvedValue(null);
            });

            afterAll(() => {
                findAssociationBySirenMock.mockRestore();
                findRnaSirenMock.mockRestore();
                findAssociationByRnaMock.mockRestore();
            });

            it("should return one association", async () => {
                const expected = 1;
                const actual = await apiAssoService.getAssociationsBySiren("509221941");

                expect(actual).toHaveLength(expected);
            });

            it("should return one association, because rna structure not found", async () => {
                const expected = 1;
                findRnaSirenMock.mockResolvedValue([{ siren: "509221941", rna: "W000000000" }]);
                const actual = await apiAssoService.getAssociationsBySiren("509221941");

                expect(actual).toHaveLength(expected);
            });

            it("should return two associations (With rna asso)", async () => {
                const expected = 2;
                findRnaSirenMock.mockResolvedValue([{ siren: "509221941", rna: "W000000000" }]);
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
            let findRnaSirenMock: jest.SpyInstance;
            let findAssociationByRnaMock: jest.SpyInstance;

            beforeAll(() => {
                findAssociationByRnaMock = jest
                    .spyOn(apiAssoService, "findAssociationByRna")
                    // @ts-ignore because previous line is ignored this line is not happy
                    .mockResolvedValue(rnaStructureFixture);
                findRnaSirenMock = jest.spyOn(rnaSirenService, "find").mockResolvedValue(null);
                findAssociationBySirenMock = jest
                    .spyOn(apiAssoService, "findAssociationBySiren")
                    // @ts-ignore because previous line is ignored this line is not happy
                    .mockResolvedValue(null);
            });

            afterAll(() => {
                findAssociationByRnaMock.mockRestore();
                findRnaSirenMock.mockRestore();
                findAssociationBySirenMock.mockRestore();
            });

            it("should return one association", async () => {
                const expected = 1;
                const actual = await apiAssoService.getAssociationsByRna("W000000000");

                expect(actual).toHaveLength(expected);
            });

            it("should return one association, because siren structure not found", async () => {
                const expected = 1;
                findRnaSirenMock.mockResolvedValue([{ siren: "509221941", rna: "W000000000" }]);
                const actual = await apiAssoService.getAssociationsByRna("W000000000");

                expect(actual).toHaveLength(expected);
            });

            it("should return two associations (With siren asso)", async () => {
                const expected = 2;
                findRnaSirenMock.mockResolvedValue([{ siren: "509221941", rna: "W000000000" }]);
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
            let mockSendRequest: jest.SpyInstance;

            beforeAll(() => {
                mockedObjectHelper.hasEmptyProperties.mockReturnValue(false);
                // @ts-ignore sendRequest is private Method
                mockSendRequest = jest.spyOn(apiAssoService, "sendRequest").mockResolvedValue(null);
            });

            afterAll(() => {
                mockSendRequest.mockRestore();
            });

            it("should send a request", async () => {
                // @ts-ignore findAssociationByRna is private method
                await apiAssoService.findAssociationByRna(RNA);

                expect(mockSendRequest).toHaveBeenCalledTimes(1);
            });

            it("should return null if result without date", async () => {
                const expected = null;
                mockSendRequest.mockResolvedValue({ data: true, identite: { date_modif_rna: null } });
                // @ts-ignore findAssociationByRna is private method
                const actual = await apiAssoService.findAssociationByRna(RNA);

                expect(actual).toBe(expected);
            });

            it("should return null if structure.identite has empty properties", async () => {
                mockedObjectHelper.hasEmptyProperties.mockReturnValueOnce(true);
                const expected = null;
                mockSendRequest.mockResolvedValue({ data: true, identite: {} });
                // @ts-ignore findAssociationByRna is private method
                const actual = await apiAssoService.findAssociationByRna(RNA);
                expect(actual).toBe(expected);
            });

            it("should use adapter", async () => {
                const expected = { data: true, identite: { date_modif_rna: "smthg" } };
                mockSendRequest.mockResolvedValue(expected);
                // @ts-ignore findAssociationByRna is private method
                await apiAssoService.findAssociationByRna(RNA);

                expect(ApiAssoDtoAdapter.rnaStructureToAssociation).toBeCalledWith(expected);
            });
        });

        describe("findAssociationBySiren", () => {
            const SIREN = "000000000";
            const ASSO_WITH_STRUCTURES = {
                data: true,
                identite: { date_modif_siren: "smthg" },
                etablissement: { length: 1 },
            };
            let mockSendRequest: jest.SpyInstance;
            let mockGetDefaultDateModifSiren: jest.SpyInstance;

            beforeAll(() => {
                mockedObjectHelper.hasEmptyProperties.mockReturnValue(false);
                // @ts-ignore sendRequest is private Method
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
                await apiAssoService.findAssociationBySiren(RNA);
                expect(mockSendRequest).toHaveBeenCalledWith(`/api/structure/${RNA}`);
            });

            it("should return null if result without date", async () => {
                const expected = null;
                mockSendRequest.mockResolvedValueOnce({ data: true, etablissement: { length: 1 } });
                const actual = await apiAssoService.findAssociationBySiren(RNA);
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

            let mockSendRequest: jest.SpyInstance;
            let mockGetDefaultDateModifSiren: jest.SpyInstance;
            let toEtablissementMock: jest.SpyInstance;

            beforeAll(() => {
                // @ts-ignore sendRequest is private method
                mockSendRequest = jest.spyOn(apiAssoService, "sendRequest").mockReturnValue(fixtureAsso);
                mockGetDefaultDateModifSiren = jest
                    // @ts-expect-error: private method
                    .spyOn(apiAssoService, "getDefaultDateModifSiren")
                    // @ts-expect-error:
                    .mockReturnValue("1900-01-01");
                toEtablissementMock = jest
                    .spyOn(ApiAssoDtoAdapter, "toEtablissement")
                    .mockImplementation(data => data as unknown as Etablissement);
            });

            afterAll(() => {
                mockSendRequest.mockRestore();
                mockGetDefaultDateModifSiren.mockRestore();
                toEtablissementMock.mockRestore();
            });

            it("should send a request", async () => {
                // @ts-ignore findEtablissementsBySiren is private method
                await apiAssoService.findEtablissementsBySiren(SIREN);

                expect(mockSendRequest).toBeCalledTimes(1);
            });

            it("should return null", async () => {
                mockSendRequest.mockResolvedValueOnce(null);
                // @ts-ignore findEtablissementsBySiren is private method
                const actual = await apiAssoService.findEtablissementsBySiren(SIREN);

                expect(actual).toBe(null);
            });

            it("should return null if structure.identite has empty properties", async () => {
                mockSendRequest.mockResolvedValueOnce({
                    date_modif_siren: null,
                    id_siren: null,
                });
                // @ts-ignore findEtablissementsBySiren is private method
                const actual = await apiAssoService.findEtablissementsBySiren(SIREN);

                expect(actual).toBe(null);
            });

            it("should call adapter", async () => {
                // @ts-ignore findEtablissementsBySiren is private method
                await apiAssoService.findEtablissementsBySiren(SIREN);

                expect(toEtablissementMock).toHaveBeenCalledTimes(2);
            });

            it("should call getDefaultDateModifSiren()", async () => {
                const STRUCTURE = { ...fixtureAsso, identite: { date_modif_siren: undefined } };
                mockSendRequest.mockResolvedValueOnce(STRUCTURE);
                // @ts-expect-error: private method
                await apiAssoService.findEtablissementsBySiren(SIREN);
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
            // @ts-ignore
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
                // @ts-ignore mockSendRequest is private method
                mockSendRequest = jest.spyOn(apiAssoService, "sendRequest");
            });

            it("should call filterRnaDocuments with document_rna", async () => {
                const expected = [
                    {
                        sous_type: "PV",
                    },
                ];

                mockSendRequest.mockResolvedValueOnce({
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

                mockSendRequest.mockImplementationOnce(() => ({
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

                mockSendRequest.mockImplementationOnce(() => ({
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

                mockSendRequest.mockImplementationOnce(() => ({
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

                mockSendRequest.mockImplementationOnce(() => ({
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

                mockSendRequest.mockImplementationOnce(() => ({
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

                mockSendRequest.mockImplementationOnce(() => ({
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

                mockSendRequest.mockImplementationOnce(() => ({
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

                mockSendRequest.mockImplementationOnce(() => ({
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
