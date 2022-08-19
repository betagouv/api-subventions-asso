import axios from "axios";
import { Association, Etablissement } from "@api-subventions-asso/dto"
import ApiAssoDtoAdapter from "./adapters/ApiAssoDtoAdapter";
import apiAssoService from "./apiAsso.service"
import { fixtureAsso, fixtureDocumentDac, fixtureDocumentRna, fixtureEtablissements } from "./__fixtures__/ApiAssoStructureFixture";

jest.mock('../../../shared/EventManager');

describe("ApiAssoService", () => {
    const axiosMock = jest.spyOn(axios, "get");
    const adapterAssoMock = jest.spyOn(ApiAssoDtoAdapter, "toAssociation").mockImplementation((r) => [{
        ...r,
        denomination_rna: [{ value: r.identite.nom, provider: "TEST" }],
        date_modification_rna: [{ value: new Date(Date.UTC(2022, 0, 1)) }]
    }] as unknown[] as Association[]);
    const adapterEtablissementMock = jest.spyOn(ApiAssoDtoAdapter, "toEtablissement").mockImplementation((r) => ({ ...r, siret: [{ value: r.id_siret }] }) as unknown as Etablissement);

    afterAll(() => {
        adapterAssoMock.mockReset();
        adapterEtablissementMock.mockReset();
    })

    describe("sendRequest", () => {
        // @ts-ignore
        const cache = apiAssoService.requestCache;
        const cacheHasMock = jest.spyOn(cache, "has");
        const cacheGetMock = jest.spyOn(cache, "get");

        afterAll(() => {
            cacheHasMock.mockClear();
            cacheGetMock.mockClear();
        })

        it("should return cache data", async () => {
            const expected = "FAKEDATA";

            cacheHasMock.mockImplementationOnce(() => true);
            cacheGetMock.mockImplementationOnce(() => [expected]);

            // @ts-ignore
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        })

        it("should return api data", async () => {
            const expected = "FAKEDATA";
            axiosMock.mockImplementationOnce(() => Promise.resolve({
                status: 200,
                data: expected
            }))
            cacheHasMock.mockImplementationOnce(() => false);

            // @ts-ignore
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        })


        it("should return null (wrong status code)", async () => {
            const expected = null;
            axiosMock.mockImplementationOnce(() => Promise.resolve({
                status: 404,
                data: 1
            }))
            cacheHasMock.mockImplementationOnce(() => false);

            // @ts-ignore
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        })

        it("should return null (error is throw)", async () => {
            const expected = null;
            axiosMock.mockImplementationOnce(() => { throw new Error("Error test") });
            cacheHasMock.mockImplementationOnce(() => false);

            // @ts-ignore
            const actual = await apiAssoService.sendRequest("fake/route");
            expect(actual).toBe(expected);
        })
    })

    describe("findFullScopeAssociation", () => {
        // @ts-ignore
        const sirenCache = apiAssoService.dataSirenCache;
        const sirenCacheHasMock = jest.spyOn(sirenCache, "has");
        const sirenCacheGetMock = jest.spyOn(sirenCache, "get") as jest.SpyInstance<any>;
        const sirenCacheAddMock = jest.spyOn(sirenCache, "add") as jest.SpyInstance<any>;

        // @ts-ignore
        const rnaCache = apiAssoService.dataRnaCache;
        const rnaCacheHasMock = jest.spyOn(rnaCache, "has");
        const rnaCacheGetMock = jest.spyOn(rnaCache, "get") as jest.SpyInstance<any>;
        const rnaCacheAddMock = jest.spyOn(rnaCache, "add") as jest.SpyInstance<any>;

        // @ts-ignore
        const sendRequestMock = jest.spyOn(apiAssoService, "sendRequest") as jest.SpyInstance<any | null>;

        afterAll(() => {
            sirenCacheHasMock.mockClear();
            sirenCacheGetMock.mockClear();
            sirenCacheAddMock.mockClear();

            rnaCacheHasMock.mockClear();
            rnaCacheGetMock.mockClear();
            rnaCacheAddMock.mockClear();
        });

        it("should return data (cached by sirenCache)", async () => {
            const expected = "FAKE_DATA";
            sirenCacheHasMock.mockImplementationOnce(() => true);
            sirenCacheGetMock.mockImplementationOnce(() => [expected]);

            // @ts-ignore
            const actual = await apiAssoService.findFullScopeAssociation("ID");

            expect(actual).toBe(expected);
        })

        it("should return data (cached by rnaCache)", async () => {
            const expected = "FAKE_DATA";
            sirenCacheHasMock.mockImplementationOnce(() => false);
            rnaCacheHasMock.mockImplementationOnce(() => true);
            rnaCacheGetMock.mockImplementationOnce(() => [expected]);

            // @ts-ignore
            const actual = await apiAssoService.findFullScopeAssociation("ID");

            expect(actual).toBe(expected);
        })

        it("should return null", async () => {
            const expected = null;
            sirenCacheHasMock.mockImplementationOnce(() => false);
            rnaCacheHasMock.mockImplementationOnce(() => false);
            sendRequestMock.mockImplementationOnce(() => Promise.resolve(null))
            // @ts-ignore
            const actual = await apiAssoService.findFullScopeAssociation("ID");

            expect(actual).toBe(expected);
        })

        it("should return data with etablisements", async () => {

            sirenCacheHasMock.mockImplementationOnce(() => false);
            rnaCacheHasMock.mockImplementationOnce(() => false);
            sendRequestMock.mockImplementationOnce(() => Promise.resolve(fixtureAsso));
            const expected = fixtureEtablissements.length;
            // @ts-ignore
            const actual = (await apiAssoService.findFullScopeAssociation("ID"))?.etablissements.length;
            expect(actual).toEqual(expected)
        })

        it("should return data with documents", async () => {
            sirenCacheHasMock.mockImplementationOnce(() => false);
            rnaCacheHasMock.mockImplementationOnce(() => false);
            sendRequestMock.mockImplementationOnce(() => Promise.resolve(fixtureAsso));
            const expected = fixtureDocumentRna.length + fixtureDocumentDac.length;
            // @ts-ignore
            const actual = (await apiAssoService.findFullScopeAssociation("ID"))?.documents.length;
            expect(actual).toEqual(expected)
        })

        it("should save data in rna cache", async () => {
            sirenCacheHasMock.mockImplementationOnce(() => false);
            rnaCacheHasMock.mockImplementationOnce(() => false);
            sendRequestMock.mockImplementationOnce(() => Promise.resolve(fixtureAsso))
            // @ts-ignore
            const result = await apiAssoService.findFullScopeAssociation("ID");

            const expected = ["W00000000", result];
            expect(rnaCacheAddMock).toHaveBeenCalledWith(...expected);
        })

        it("should save data in siren cache", async () => {
            sirenCacheHasMock.mockImplementationOnce(() => false);
            rnaCacheHasMock.mockImplementationOnce(() => false);
            sendRequestMock.mockImplementationOnce(() => Promise.resolve(fixtureAsso))
            // @ts-ignore
            const result = await apiAssoService.findFullScopeAssociation("ID");

            const expected = ["509221941", result]
            expect(sirenCacheAddMock).toHaveBeenCalledWith(...expected);
        })
    })

    describe("Association Provider Part", () => {

        afterAll(() => {
            axiosMock.mockReset();
        })

        describe("getAssociationsBySiren", () => {

            beforeEach(() => {
                axiosMock.mockImplementationOnce(() => Promise.resolve({
                    status: 200,
                    data: fixtureAsso
                }))
            })

            it('should be return one association', async () => {
                const expected = 1;
                const actual = await apiAssoService.getAssociationsBySiren("509221941");

                expect(actual).toHaveLength(expected);
            })

            it('should be return association', async () => {
                const expected = [expect.objectContaining(fixtureAsso)];
                const actual = await apiAssoService.getAssociationsBySiren("509221941");

                expect(actual).toEqual(expected);
            })

            it('should be return null', async () => {
                const expected = null;
                //@ts-ignore
                jest.spyOn(apiAssoService, "findFullScopeAssociation").mockImplementationOnce(() => Promise.resolve(null))

                const actual = await apiAssoService.getAssociationsBySiren("00");
                expect(actual).toBe(expected);
            })
        });

        describe("getAssociationsBySiret", () => {

            beforeEach(() => {
                axiosMock.mockImplementationOnce(() => Promise.resolve({
                    status: 200,
                    data: fixtureAsso
                }))
            })

            it('should be return one association', async () => {
                const expected = 1;
                const actual = await apiAssoService.getAssociationsBySiret("50922194100000");

                expect(actual).toHaveLength(expected);
            })

            it('should be return association', async () => {
                const expected = [expect.objectContaining(fixtureAsso)];
                const actual = await apiAssoService.getAssociationsBySiret("50922194100000");

                expect(actual).toEqual(expected);
            })

            it('should be return null', async () => {
                const expected = null;
                //@ts-ignore
                jest.spyOn(apiAssoService, "findFullScopeAssociation").mockImplementationOnce(() => Promise.resolve(null))

                const actual = await apiAssoService.getAssociationsBySiret("00");
                expect(actual).toBe(expected);
            })
        });

        describe("getAssociationsByRna", () => {

            beforeEach(() => {
                axiosMock.mockImplementationOnce(() => Promise.resolve({
                    status: 200,
                    data: fixtureAsso
                }))
            })

            it('should be return one associations', async () => {
                const expected = 1;
                const actual = await apiAssoService.getAssociationsByRna("W0000000");

                expect(actual).toHaveLength(expected);
            })

            it('should be return association', async () => {
                const expected = [expect.objectContaining(fixtureAsso)];
                const actual = await apiAssoService.getAssociationsByRna("W0000000");

                expect(actual).toEqual(expected);
            })

            it('should be return null', async () => {
                const expected = null;
                //@ts-ignore
                jest.spyOn(apiAssoService, "findFullScopeAssociation").mockImplementationOnce(() => Promise.resolve(null))

                const actual = await apiAssoService.getAssociationsByRna("00");
                expect(actual).toBe(expected);
            })
        });
    })

    describe("Etablissement part", () => {
        afterAll(() => {
            axiosMock.mockReset();
        })
        beforeAll(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            apiAssoService.dataSirenCache.destroy();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            apiAssoService.dataRnaCache.destroy();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            apiAssoService.requestCache.destroy();

            axiosMock.mockImplementationOnce(() => Promise.resolve({
                status: 200,
                data: fixtureAsso
            }))
        })

        describe("getEtablissementsBySiret", () => {
            it('should be return one etablissement', async () => {
                const expected = 1;
                const actual = await apiAssoService.getEtablissementsBySiret("50922194100000");

                expect(actual).toHaveLength(expected);
            })

            it('should be return null', async () => {
                const expected = null;
                //@ts-ignore
                jest.spyOn(apiAssoService, "findFullScopeAssociation").mockImplementationOnce(() => Promise.resolve(null))

                const actual = await apiAssoService.getEtablissementsBySiret("00");
                expect(actual).toBe(expected);
            })
        })


        describe("getEtablissementsBySiren", () => {
            it('should be return two etablissements', async () => {
                const expected = 2;
                const actual = await apiAssoService.getEtablissementsBySiren("509221941");

                expect(actual).toHaveLength(expected);
            })

            it('should be return null', async () => {
                const expected = null;
                //@ts-ignore
                jest.spyOn(apiAssoService, "findFullScopeAssociation").mockImplementationOnce(() => Promise.resolve(null))

                const actual = await apiAssoService.getEtablissementsBySiren("00");
                expect(actual).toBe(expected);
            })
        })
    })

    describe("Documents part", () => {
        afterAll(() => {
            axiosMock.mockReset();
        })
        beforeAll(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            apiAssoService.dataSirenCache.destroy();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            apiAssoService.dataRnaCache.destroy();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            apiAssoService.requestCache.destroy();

            axiosMock.mockImplementationOnce(() => Promise.resolve({
                status: 200,
                data: fixtureAsso
            }))
        })

        describe("getDocumentsBySiret", () => {
            it('should be return one document', async () => {
                const expected = 1;
                const actual = await apiAssoService.getDocumentsBySiret("50922194100000");

                expect(actual).toHaveLength(expected);
            })

            it('should be return null', async () => {
                const expected = null;
                //@ts-ignore
                jest.spyOn(apiAssoService, "findFullScopeAssociation").mockImplementationOnce(() => Promise.resolve(null))

                const actual = await apiAssoService.getDocumentsBySiret("00");
                expect(actual).toBe(expected);
            })
        })


        describe("getDocumentsBySiren", () => {
            it('should be return 2 documents', async () => {
                const expected = 2;
                const actual = await apiAssoService.getDocumentsBySiren("509221941");

                expect(actual).toHaveLength(expected);
            })

            it('should be return null', async () => {
                const expected = null;
                //@ts-ignore
                jest.spyOn(apiAssoService, "findFullScopeAssociation").mockImplementationOnce(() => Promise.resolve(null))

                const actual = await apiAssoService.getDocumentsBySiren("00");
                expect(actual).toBe(expected);
            })
        })

        describe("getDocumentsByRna", () => {
            it('should be return 2 documents', async () => {
                const expected = 2;
                const actual = await apiAssoService.getDocumentsByRna("W00000000");

                expect(actual).toHaveLength(expected);
            })

            it('should be return null', async () => {
                const expected = null;
                //@ts-ignore
                jest.spyOn(apiAssoService, "findFullScopeAssociation").mockImplementationOnce(() => Promise.resolve(null))

                const actual = await apiAssoService.getDocumentsByRna("00");
                expect(actual).toBe(expected);
            })
        })
    })
});