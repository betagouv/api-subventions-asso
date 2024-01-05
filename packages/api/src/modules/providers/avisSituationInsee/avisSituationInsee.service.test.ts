import ProviderValueAdapter from "../../../shared/adapters/ProviderValueAdapter";
import avisSituationInseeService from "./avisSituationInsee.service";
import rnaSirenService from "../../rna-siren/rnaSiren.service";
import RnaSirenEntity from "../../../entities/RnaSirenEntity";

describe("AvisSituationInseeService", () => {
    describe("getInseeEtablissementsBySiren", () => {
        let httpGetSpy: jest.SpyInstance;
        // @ts-expect-error requestCache is private attribute
        const cacheGetMock = jest.spyOn(avisSituationInseeService.requestCache, "get");
        // @ts-expect-error requestCache is private attribute
        const cacheAddMock = jest.spyOn(avisSituationInseeService.requestCache, "add");
        // @ts-expect-error requestCache is private attribute
        const cacheHasMock = jest.spyOn(avisSituationInseeService.requestCache, "has");

        beforeAll(() => {
            // @ts-expect-error http is private method
            httpGetSpy = jest.spyOn(avisSituationInseeService.http, "get");
        });

        beforeEach(() => {
            // @ts-expect-error requestCache is private attribute
            avisSituationInseeService.requestCache.collection.clear();
        });

        it("should return false because value is save in cache", async () => {
            const expected = false;
            cacheGetMock.mockImplementationOnce(() => [false]);
            cacheHasMock.mockImplementationOnce(() => true);
            // @ts-expect-error getInseeEtablissementsBySiren is private method
            const actual = await avisSituationInseeService.getInseeEtablissementsBySiren("");

            expect(actual).toBe(expected);
        });

        it("should return object because value is save in cache", async () => {
            const expected = { 42: "youpi" };
            cacheGetMock.mockImplementationOnce(() => [expected as unknown as any]);
            cacheHasMock.mockImplementationOnce(() => true);
            // @ts-expect-error getInseeEtablissementsBySiren is private method
            const actual = await avisSituationInseeService.getInseeEtablissementsBySiren("");

            expect(actual).toBe(expected);
        });

        it("should return false because axios throw error", async () => {
            const expected = false;
            cacheHasMock.mockImplementationOnce(() => false);
            httpGetSpy.mockImplementationOnce(() => {
                throw new Error();
            });
            // @ts-expect-error getInseeEtablissementsBySiren is private method
            const actual = await avisSituationInseeService.getInseeEtablissementsBySiren("");

            expect(actual).toBe(expected);
        });

        it("should return object returned by axios", async () => {
            const expected = { 42: "youpi" };
            cacheHasMock.mockImplementationOnce(() => false);
            httpGetSpy.mockImplementationOnce(async () => ({
                status: 200,
                data: expected,
            }));
            // @ts-expect-error getInseeEtablissementsBySiren is private method
            const actual = await avisSituationInseeService.getInseeEtablissementsBySiren("");

            expect(actual).toBe(expected);
        });

        it("should save object in cache", async () => {
            const expected = { 42: "youpi" };
            cacheHasMock.mockImplementationOnce(() => false);
            httpGetSpy.mockImplementationOnce(async () => ({
                status: 200,
                data: expected,
            }));
            // @ts-expect-error getInseeEtablissementsBySiren is private method
            await avisSituationInseeService.getInseeEtablissementsBySiren("SIREN");

            expect(cacheAddMock).toHaveBeenCalledWith("SIREN", expected);
        });

        it("should return false returned by axios", async () => {
            const expected = false;
            cacheHasMock.mockImplementationOnce(() => false);
            httpGetSpy.mockImplementationOnce(async () => ({
                status: 404,
                data: false,
            }));
            // @ts-expect-error getInseeEtablissementsBySiren is private method
            const actual = await avisSituationInseeService.getInseeEtablissementsBySiren("");

            expect(actual).toBe(expected);
        });

        it("should save false in cache", async () => {
            const expected = false;
            cacheHasMock.mockImplementationOnce(() => false);
            httpGetSpy.mockImplementationOnce(async () => ({
                status: 404,
                data: expected,
            }));
            // @ts-expect-error getInseeEtablissementsBySiren is private method
            await avisSituationInseeService.getInseeEtablissementsBySiren("SIREN");

            expect(cacheAddMock).toHaveBeenCalledWith("SIREN", expected);
        });
    });

    describe("getDocumentsBySiren", () => {
        const getInseeEtablissementsBySirenMock = jest.spyOn<
            any,
            // @ts-expect-error getInseeEtablissementsBySiren is private method
            Promise<
                | {
                      etablissements: {
                          nic: string;
                          etablissementSiege: boolean;
                      }[];
                  }
                | false
            >
        >(avisSituationInseeService, "getInseeEtablissementsBySiren");

        it("should return null because file not found in insee", async () => {
            getInseeEtablissementsBySirenMock.mockImplementationOnce(async () => false);

            const expected = null;

            const actual = await avisSituationInseeService.getDocumentsBySiren("");

            expect(actual).toBe(expected);
        });

        it("should return null because nic not found", async () => {
            getInseeEtablissementsBySirenMock.mockImplementationOnce(async () => ({
                etablissements: [
                    {
                        etablissementSiege: false,
                        nic: "11111",
                    },
                ],
            }));

            const expected = null;

            const actual = await avisSituationInseeService.getDocumentsBySiren("");

            expect(actual).toBe(expected);
        });

        it("should return null because nic not found", async () => {
            getInseeEtablissementsBySirenMock.mockImplementationOnce(async () => ({
                etablissements: [
                    {
                        etablissementSiege: true,
                        nic: "11111",
                    },
                ],
            }));

            const expected = [
                {
                    type: ProviderValueAdapter.toProviderValue(
                        "Avis Situation Insee",
                        avisSituationInseeService.provider.name,
                        expect.any(Date),
                    ),
                    url: ProviderValueAdapter.toProviderValue(
                        `/document/avis_situation_api/?url=https%3A%2F%2Fapi-avis-situation-sirene.insee.fr%2Fidentification%2Fpdf%2F00000000011111`,
                        avisSituationInseeService.provider.name,
                        expect.any(Date),
                    ),
                    nom: ProviderValueAdapter.toProviderValue(
                        `Avis Situation Insee (00000000011111)`,
                        avisSituationInseeService.provider.name,
                        expect.any(Date),
                    ),
                    __meta__: {
                        siret: "00000000011111",
                    },
                },
            ];

            const actual = await avisSituationInseeService.getDocumentsBySiren("000000000");

            expect(actual).toEqual(expected);
        });
    });

    describe("getDocumentsBySiret", () => {
        const getInseeEtablissementsBySirenMock = jest.spyOn<
            any,
            // @ts-expect-error getInseeEtablissementsBySiren is private method
            Promise<
                | {
                      etablissements: {
                          nic: string;
                          etablissementSiege: boolean;
                      }[];
                  }
                | false
            >
        >(avisSituationInseeService, "getInseeEtablissementsBySiren");

        it("should return null because file not found in insee", async () => {
            getInseeEtablissementsBySirenMock.mockImplementationOnce(async () => false);

            const expected = null;

            const actual = await avisSituationInseeService.getDocumentsBySiret("");

            expect(actual).toBe(expected);
        });

        it("should return null because nic not found", async () => {
            getInseeEtablissementsBySirenMock.mockImplementationOnce(async () => ({
                etablissements: [
                    {
                        etablissementSiege: true,
                        nic: "11111",
                    },
                ],
            }));

            const expected = [
                {
                    type: ProviderValueAdapter.toProviderValue(
                        "Avis Situation Insee",
                        avisSituationInseeService.provider.name,
                        expect.any(Date),
                    ),
                    url: ProviderValueAdapter.toProviderValue(
                        `https://api-avis-situation-sirene.insee.fr/identification/pdf/00000000011111`,
                        avisSituationInseeService.provider.name,
                        expect.any(Date),
                    ),
                    nom: ProviderValueAdapter.toProviderValue(
                        `Avis Situation Insee (00000000011111)`,
                        avisSituationInseeService.provider.name,
                        expect.any(Date),
                    ),
                    __meta__: {
                        siret: "00000000011111",
                    },
                },
            ];

            const actual = await avisSituationInseeService.getDocumentsBySiret("00000000011111");

            expect(actual).toEqual(expected);
        });
    });

    describe("getDocumentByRna", () => {
        const findMock = jest.spyOn(rnaSirenService, "find");
        const getDocumentsBySirenMock = jest.spyOn(avisSituationInseeService, "getDocumentsBySiren");

        it("should return null because siren not found", async () => {
            findMock.mockResolvedValueOnce(null);

            const expected = null;
            const actual = await avisSituationInseeService.getDocumentsByRna("");

            expect(actual).toBe(expected);
        });

        it("should call getDocumentsBySiren with founded siren", async () => {
            const expected = "000000000";
            findMock.mockResolvedValueOnce([new RnaSirenEntity("", expected)]);
            getDocumentsBySirenMock.mockImplementation(async () => ({} as any));

            await avisSituationInseeService.getDocumentsByRna("");

            expect(avisSituationInseeService.getDocumentsBySiren).toHaveBeenCalledWith(expected);
        });

        it("should return getDocumentsBySiren anwser", async () => {
            findMock.mockResolvedValueOnce([new RnaSirenEntity("", "000000000")]);
            getDocumentsBySirenMock.mockImplementation(async () => expected as any);

            const expected = { imTest: true };
            const actual = await avisSituationInseeService.getDocumentsByRna("");

            expect(actual).toBe(expected);
        });
    });
});
