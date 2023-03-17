import axios from "axios";
import { Association, Etablissement } from "@api-subventions-asso/dto";
import ApiAssoDtoAdapter from "./adapters/ApiAssoDtoAdapter";
import apiAssoService from "./apiAsso.service";
import { DacDtoDocument, DacSiret, DtoDocument, RnaDtoDocument } from "./__fixtures__/DtoDocumentFixture";
import { ApiAssoDocumentFixture } from "./__fixtures__/ApiAssoDocumentFixture";
import associationNameService from "../../association-name/associationName.service";
import { sirenStructureFixture } from "./__fixtures__/SirenStructureFixture";
import { rnaStructureFixture } from "./__fixtures__/RnaStructureFixture";
import {
    fixtureAsso,
    fixtureDocumentDac,
    fixtureDocumentRna,
    fixtureEtablissements
} from "./__fixtures__/ApiAssoStructureFixture";

jest.mock("../../../shared/EventManager");

describe("ApiAssoService", () => {
    let axiosMock = jest.spyOn(axios, "get");
    const adapterRnaDocumentMock = jest.spyOn(ApiAssoDtoAdapter, "rnaDocumentToDocument");
    const adapterDacDocumentMock = jest.spyOn(ApiAssoDtoAdapter, "dacDocumentToDocument");
    const adapterEtablissementMock = jest
        .spyOn(ApiAssoDtoAdapter, "toEtablissement")
        .mockImplementation(r => ({ ...r, siret: [{ value: r.id_siret }] } as unknown as Etablissement));
    // @ts-expect-error: mock private method
    let sendRequestMock = jest.spyOn(apiAssoService, "sendRequest") as jest.SpyInstance<any | null>;
    // @ts-expect-error: mock private method
    const findDocumentsMock = jest.spyOn(apiAssoService, "findDocuments") as jest.SpyInstance<any | null>;

    let associationNameUpsert: jest.SpyInstance;

    const RNA = "W750000000";

    beforeAll(() => {
        // @ts-expect-error resolve value can must be an mongo updateObject, so just disable ts
        associationNameUpsert = jest.spyOn(associationNameService, "upsert").mockResolvedValue({});
    });

    afterAll(() => {
        adapterEtablissementMock.mockReset();
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
                    data: expected
                })
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
                    data: 1
                })
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

    describe("findDocuments", () => {
        it("should return documents", async () => {
            const expected = DtoDocument;
            sendRequestMock.mockImplementationOnce(async () => ApiAssoDocumentFixture);
            adapterDacDocumentMock.mockImplementationOnce(() => DacDtoDocument);
            adapterRnaDocumentMock.mockImplementationOnce(() => RnaDtoDocument);
            // @ts-expect-error: test private method
            const actual = await apiAssoService.findDocuments(RNA);
            expect(actual).toEqual(expected);
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

            it("should be return one association", async () => {
                const expected = 1;
                const actual = await apiAssoService.getAssociationsBySiren("509221941");

                expect(actual).toHaveLength(expected);
            });

            it("should be return one association, because rna structure not found", async () => {
                const expected = 1;
                getGroupedIdentifiersMock.mockResolvedValue({ siren: "509221941", rna: "W000000000" });
                const actual = await apiAssoService.getAssociationsBySiren("509221941");

                expect(actual).toHaveLength(expected);
            });

            it("should be return two associations (With rna asso)", async () => {
                const expected = 2;
                getGroupedIdentifiersMock.mockResolvedValue({ siren: "509221941", rna: "W000000000" });
                findAssociationByRnaMock.mockResolvedValueOnce(rnaStructureFixture);
                const actual = await apiAssoService.getAssociationsBySiren("509221941");

                expect(actual).toHaveLength(expected);
            });

            it("should be return association", async () => {
                const expected = [sirenStructureFixture];
                const actual = await apiAssoService.getAssociationsBySiren("509221941");

                expect(actual).toEqual(expected);
            });

            it("should be return null", async () => {
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

            it("should be return one association", async () => {
                const expected = 1;
                const actual = await apiAssoService.getAssociationsBySiret("50922194100000");

                expect(actual).toHaveLength(expected);
            });

            it("should be return association", async () => {
                const expected = [expect.objectContaining(sirenStructureFixture)];
                const actual = await apiAssoService.getAssociationsBySiret("50922194100000");

                expect(actual).toEqual(expected);
            });

            it("should be return null", async () => {
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

            it("should be return one association", async () => {
                const expected = 1;
                const actual = await apiAssoService.getAssociationsByRna("W000000000");

                expect(actual).toHaveLength(expected);
            });

            it("should be return one association, because siren structure not found", async () => {
                const expected = 1;
                getGroupedIdentifiersMock.mockResolvedValue({ siren: "509221941", rna: "W000000000" });
                const actual = await apiAssoService.getAssociationsByRna("W000000000");

                expect(actual).toHaveLength(expected);
            });

            it("should be return two associations (With siren asso)", async () => {
                const expected = 2;
                getGroupedIdentifiersMock.mockResolvedValue({ siren: "509221941", rna: "W000000000" });
                findAssociationBySirenMock.mockResolvedValueOnce(sirenStructureFixture);
                const actual = await apiAssoService.getAssociationsByRna("W000000000");

                expect(actual).toHaveLength(expected);
            });

            it("should be return association", async () => {
                const expected = [rnaStructureFixture];
                const actual = await apiAssoService.getAssociationsByRna("W000000000");

                expect(actual).toEqual(expected);
            });

            it("should be return null", async () => {
                const expected = null;

                findAssociationByRnaMock.mockResolvedValueOnce(null);

                const actual = await apiAssoService.getAssociationsByRna("W000000000");
                expect(actual).toBe(expected);
            });
        });

        describe("findAssociationByRna", () => {
            const RNA = "W000000000";
            let sendRequestMock: jest.SpyInstance;
            let rnaStructureToAssoMock: jest.SpyInstance;

            beforeAll(() => {
                // @ts-ignore sendRequest is private Method
                sendRequestMock = jest.spyOn(apiAssoService, "sendRequest").mockResolvedValue(null);
                rnaStructureToAssoMock = jest
                    .spyOn(ApiAssoDtoAdapter, "rnaStructureToAssociation")
                    .mockImplementation(data => data as Association);
            });

            afterAll(() => {
                rnaStructureToAssoMock.mockRestore();
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

                expect(rnaStructureToAssoMock).toBeCalledWith(expected);
            });
        });

        describe("findAssociationBySiren", () => {
            const SIREN = "000000000";
            let sendRequestMock: jest.SpyInstance;
            let sirenStructureToAssoMock: jest.SpyInstance;

            beforeAll(() => {
                // @ts-ignore sendRequest is private Method
                sendRequestMock = jest.spyOn(apiAssoService, "sendRequest").mockResolvedValue(null);
                sirenStructureToAssoMock = jest
                    .spyOn(ApiAssoDtoAdapter, "sirenStructureToAssociation")
                    .mockImplementation(data => data as Association);
            });

            afterAll(() => {
                sirenStructureToAssoMock.mockRestore();
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

                expect(sirenStructureToAssoMock).toBeCalledWith(expected);
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

            it("should be return one etablissement", async () => {
                const expected = 1;
                const actual = await apiAssoService.getEtablissementsBySiret(SIRET);
                expect(actual).toHaveLength(expected);
            });

            it("should be return null", async () => {
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

            it("should be return one etablissement", async () => {
                const expected = 1;
                const actual = await apiAssoService.getEtablissementsBySiren(SIREN);

                expect(actual).toHaveLength(expected);
            });

            it("should be return null", async () => {
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

            it("should retrun null", async () => {
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
                data: fixtureAsso
            });
        });

        describe("filterRnaDocuments", () => {
            it("should keep just right type", () => {
                const expected = [
                    {
                        sous_type: "MD",
                        annee: 2022,
                        time: 0
                    }
                ];

                const documents = [
                    ...expected,
                    {
                        sous_type: "WRONG",
                        annee: 2022,
                        time: 0
                    }
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
                        time: 0
                    }
                ];

                const documents = [
                    ...expected,
                    {
                        sous_type: "MD",
                        annee: 2021,
                        time: 0
                    }
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
                            type: "RFA"
                        },
                        time_depot: new Date().toString()
                    }
                ];

                const documents = [
                    ...expected,
                    {
                        meta: {
                            type: "WRONG"
                        },
                        time_depot: new Date().toString()
                    }
                ];

                // @ts-ignore filterDacDocuments has private method
                const actual = apiAssoService.filterDacDocuments(documents);

                expect(actual).toEqual(expected);
            });

            it("should keep just most recent", () => {
                const expected = [
                    {
                        meta: {
                            type: "RFA"
                        },
                        time_depot: new Date().toString()
                    }
                ];

                const documents = [
                    ...expected,
                    {
                        meta: {
                            type: "RFA"
                        },
                        time_depot: new Date(2021, 1).toString()
                    }
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
                            iban: ""
                        },
                        url: "FAKE_URL"
                    }
                ];

                const documents = [
                    ...expected,
                    {
                        meta: {
                            type: "WRONG"
                        }
                    }
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
                            etat: "courant"
                        }
                    },
                    {
                        meta: {
                            etat: "courant"
                        }
                    }
                ];

                const documents = [
                    ...expected,
                    {
                        meta: {
                            etat: "WRONG"
                        }
                    }
                ];

                // @ts-ignore filterActiveDacDocuments has private method
                const actual = apiAssoService.filterActiveDacDocuments(documents);

                expect(actual).toEqual(expected);
            });
        });

        describe("findDocuments", () => {
            const IDENTIFIER = "123456789";

            let filterRnaDocumentsMock: jest.SpyInstance;
            let filterActiveDacDocumentsMock: jest.SpyInstance;
            let filterDacDocumentsMock: jest.SpyInstance;
            let filterRibsInDacDocumentsMock: jest.SpyInstance;
            let rnaDocumentToDocumentMock: jest.SpyInstance;
            let dacDocumentToDocumentMock: jest.SpyInstance;
            let dacDocumentToRibMock: jest.SpyInstance;

            beforeAll(() => {
                // @ts-ignore filterRnaDocuments has private method
                filterRnaDocumentsMock = jest.spyOn(apiAssoService, "filterRnaDocuments");
                // @ts-ignore filterActiveDacDocuments has private method
                filterActiveDacDocumentsMock = jest.spyOn(apiAssoService, "filterActiveDacDocuments");
                // @ts-ignore filterDacDocuments has private method
                filterDacDocumentsMock = jest.spyOn(apiAssoService, "filterDacDocuments");
                // @ts-ignore filterRibsInDacDocuments has private method
                filterRibsInDacDocumentsMock = jest.spyOn(apiAssoService, "filterRibsInDacDocuments");
                rnaDocumentToDocumentMock = jest.spyOn(ApiAssoDtoAdapter, "rnaDocumentToDocument");
                dacDocumentToDocumentMock = jest.spyOn(ApiAssoDtoAdapter, "dacDocumentToDocument");
                dacDocumentToRibMock = jest.spyOn(ApiAssoDtoAdapter, "dacDocumentToRib");
                // @ts-ignore sendRequestMock is private method
                sendRequestMock = jest.spyOn(apiAssoService, "sendRequest");
            });

            afterAll(() => {
                filterRnaDocumentsMock.mockReset();
                filterActiveDacDocumentsMock.mockReset();
                filterDacDocumentsMock.mockReset();
                filterRibsInDacDocumentsMock.mockReset();
                rnaDocumentToDocumentMock.mockReset();
                dacDocumentToDocumentMock.mockReset();
                dacDocumentToRibMock.mockReset();
            });

            it("should call filterRnaDocuments with document_rna", async () => {
                const expected = [
                    {
                        sous_type: "PV"
                    }
                ];

                sendRequestMock.mockResolvedValueOnce({
                    asso: {
                        documents: {
                            document_rna: expected
                        }
                    }
                });

                filterRnaDocumentsMock.mockImplementationOnce(() => []);
                filterActiveDacDocumentsMock.mockImplementationOnce(() => []);
                filterDacDocumentsMock.mockImplementationOnce(() => []);
                filterRibsInDacDocumentsMock.mockImplementationOnce(() => []);

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(filterRnaDocumentsMock).toHaveBeenCalledWith(expected);
            });

            it("should call filterRnaDocuments with empty array", async () => {
                const expected = [];

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {}
                    }
                }));

                filterRnaDocumentsMock.mockImplementationOnce(() => []);
                filterActiveDacDocumentsMock.mockImplementationOnce(() => []);
                filterDacDocumentsMock.mockImplementationOnce(() => []);
                filterRibsInDacDocumentsMock.mockImplementationOnce(() => []);

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(filterRnaDocumentsMock).toHaveBeenCalledWith(expected);
            });

            it("should call filterActiveDacDocuments with document_dac", async () => {
                const expected = [
                    {
                        meta: {
                            type: "RFA"
                        }
                    }
                ];

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {
                            document_dac: expected
                        }
                    }
                }));

                filterRnaDocumentsMock.mockImplementationOnce(() => []);
                filterActiveDacDocumentsMock.mockImplementationOnce(() => []);
                filterDacDocumentsMock.mockImplementationOnce(() => []);
                filterRibsInDacDocumentsMock.mockImplementationOnce(() => []);

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(filterActiveDacDocumentsMock).toHaveBeenCalledWith(expected, IDENTIFIER);
            });

            it("should call filterActiveDacDocuments with empty array", async () => {
                const expected = [];

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {}
                    }
                }));

                filterRnaDocumentsMock.mockImplementationOnce(() => []);
                filterActiveDacDocumentsMock.mockImplementationOnce(() => []);
                filterDacDocumentsMock.mockImplementationOnce(() => []);
                filterRibsInDacDocumentsMock.mockImplementationOnce(() => []);

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(filterActiveDacDocumentsMock).toHaveBeenCalledWith(expected, IDENTIFIER);
            });

            it("should call filterDacDocuments with actives document_dac", async () => {
                const expected = [
                    {
                        meta: {
                            type: "RFA"
                        }
                    }
                ];

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {
                            document_dac: expected
                        }
                    }
                }));

                filterRnaDocumentsMock.mockImplementationOnce(() => []);
                filterActiveDacDocumentsMock.mockImplementationOnce(data => data);
                filterDacDocumentsMock.mockImplementationOnce(() => []);
                filterRibsInDacDocumentsMock.mockImplementationOnce(() => []);

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(filterDacDocumentsMock).toHaveBeenCalledWith(expected);
            });

            it("should call filterRibsInDacDocuments with actives document_dac", async () => {
                const expected = [
                    {
                        meta: {
                            type: "RFA"
                        }
                    }
                ];

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {
                            document_dac: expected
                        }
                    }
                }));

                filterRnaDocumentsMock.mockImplementationOnce(() => []);
                filterActiveDacDocumentsMock.mockImplementationOnce(data => data);
                filterDacDocumentsMock.mockImplementationOnce(() => []);
                filterRibsInDacDocumentsMock.mockImplementationOnce(() => []);

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(filterRibsInDacDocumentsMock).toHaveBeenCalledWith(expected);
            });

            it("should call ApiAssoDtoAdapter.rnaDocumentToDocument with document_rna", async () => {
                const expected = {
                    sous_type: "PV"
                };

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {
                            document_rna: [expected]
                        }
                    }
                }));

                filterRnaDocumentsMock.mockImplementationOnce(data => data);
                filterActiveDacDocumentsMock.mockImplementationOnce(() => []);
                filterDacDocumentsMock.mockImplementationOnce(() => []);
                filterRibsInDacDocumentsMock.mockImplementationOnce(() => []);
                rnaDocumentToDocumentMock.mockImplementationOnce(data => data);

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(rnaDocumentToDocumentMock).toHaveBeenCalledWith(expected);
            });

            it("should call ApiAssoDtoAdapter.dacDocumentToDocument with document_dac", async () => {
                const expected = {
                    meta: {
                        type: "RFA"
                    }
                };

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {
                            document_dac: [expected]
                        }
                    }
                }));

                filterRnaDocumentsMock.mockImplementationOnce(() => []);
                filterActiveDacDocumentsMock.mockImplementationOnce(data => data);
                filterDacDocumentsMock.mockImplementationOnce(data => data);
                filterRibsInDacDocumentsMock.mockImplementationOnce(() => []);
                dacDocumentToDocumentMock.mockImplementationOnce(data => data);

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(dacDocumentToDocumentMock).toHaveBeenCalledWith(expected);
            });

            it("should call ApiAssoDtoAdapter.dacDocumentToDocument with ribs document_dac", async () => {
                const expected = {
                    meta: {
                        type: "RIB"
                    }
                };

                sendRequestMock.mockImplementationOnce(() => ({
                    asso: {
                        documents: {
                            document_dac: [expected]
                        }
                    }
                }));

                filterRnaDocumentsMock.mockImplementationOnce(() => []);
                filterActiveDacDocumentsMock.mockImplementationOnce(data => data);
                filterRibsInDacDocumentsMock.mockImplementationOnce(data => data);
                filterDacDocumentsMock.mockImplementationOnce(() => []);
                dacDocumentToDocumentMock.mockImplementationOnce(data => data);
                dacDocumentToRibMock.mockImplementationOnce(data => data);

                // @ts-ignore findDocuments has private method
                await apiAssoService.findDocuments(IDENTIFIER);

                expect(dacDocumentToRibMock).toHaveBeenCalledWith(expected);
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
