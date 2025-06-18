import ProviderValueAdapter from "../../../shared/adapters/ProviderValueAdapter";
import avisSituationInseeService from "./avisSituationInsee.service";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import Siren from "../../../identifierObjects/Siren";

describe("AvisSituationInseeService", () => {
    describe("getInseeEtablissementsBySiren", () => {
        let httpGetSpy: jest.SpyInstance;
        // @ts-expect-error requestCache is private attribute
        const cacheGetMock = jest.spyOn(avisSituationInseeService.requestCache, "get");
        // @ts-expect-error requestCache is private attribute
        const cacheAddMock = jest.spyOn(avisSituationInseeService.requestCache, "add");
        // @ts-expect-error requestCache is private attribute
        const cacheHasMock = jest.spyOn(avisSituationInseeService.requestCache, "has");

        const SIREN = new Siren("000000000");

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
            const actual = await avisSituationInseeService.getInseeEtablissementsBySiren(SIREN);

            expect(actual).toBe(expected);
        });

        it("should return object because value is save in cache", async () => {
            const expected = { 42: "youpi" };
            // @ts-expect-error: mock
            cacheGetMock.mockImplementationOnce(() => [expected]);
            cacheHasMock.mockImplementationOnce(() => true);
            // @ts-expect-error getInseeEtablissementsBySiren is private method
            const actual = await avisSituationInseeService.getInseeEtablissementsBySiren(SIREN);

            expect(actual).toBe(expected);
        });

        it("should return false because axios throw error", async () => {
            const expected = false;
            cacheHasMock.mockImplementationOnce(() => false);
            httpGetSpy.mockImplementationOnce(() => {
                throw new Error();
            });
            // @ts-expect-error getInseeEtablissementsBySiren is private method
            const actual = await avisSituationInseeService.getInseeEtablissementsBySiren(SIREN);

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
            const actual = await avisSituationInseeService.getInseeEtablissementsBySiren(SIREN);

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
            await avisSituationInseeService.getInseeEtablissementsBySiren(SIREN);

            expect(cacheAddMock).toHaveBeenCalledWith(SIREN.value, expected);
        });

        it("should return false returned by axios", async () => {
            const expected = false;
            cacheHasMock.mockImplementationOnce(() => false);
            httpGetSpy.mockImplementationOnce(async () => ({
                status: 404,
                data: false,
            }));
            // @ts-expect-error getInseeEtablissementsBySiren is private method
            const actual = await avisSituationInseeService.getInseeEtablissementsBySiren(SIREN);

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
            await avisSituationInseeService.getInseeEtablissementsBySiren(SIREN);

            expect(cacheAddMock).toHaveBeenCalledWith(SIREN.value, expected);
        });
    });

    describe("getDocuments", () => {
        const getInseeEtablissementsBySirenMock: jest.SpyInstance = jest.spyOn(
            avisSituationInseeService,
            // @ts-expect-error: mock private method
            "getInseeEtablissementsBySiren",
        );

        const IDENTIFIER = AssociationIdentifier.fromSiren(new Siren("000000000"));

        it("should return emtpy array because file not found in insee", async () => {
            getInseeEtablissementsBySirenMock.mockImplementationOnce(async () => false);

            const actual = await avisSituationInseeService.getDocuments(IDENTIFIER);

            expect(actual).toHaveLength(0);
        });

        it("should return empty array because nic not found", async () => {
            getInseeEtablissementsBySirenMock.mockImplementationOnce(async () => ({
                etablissements: [
                    {
                        etablissementSiege: false,
                        nic: "11111",
                    },
                ],
            }));

            const actual = await avisSituationInseeService.getDocuments(IDENTIFIER);

            expect(actual).toHaveLength(0);
        });

        it("should return result computed url with given siren and found nic", async () => {
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

            const actual = await avisSituationInseeService.getDocuments(IDENTIFIER);

            expect(actual).toEqual(expected);
        });
    });
});
