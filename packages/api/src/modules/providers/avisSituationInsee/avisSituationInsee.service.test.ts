import ProviderValueMapper from "../../../shared/mappers/provider-value.mapper";
import avisSituationInseeService from "./avisSituationInsee.service";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import Siren from "../../../identifierObjects/Siren";

describe("AvisSituationInseeService", () => {
    describe("getInseeEstablishmentsBySiren", () => {
        let httpGetSpy: jest.SpyInstance;
        // @ts-expect-error requestCache is private attribute
        const cacheGetMock = jest.spyOn(avisSituationInseeService.requestCache, "get");
        // @ts-expect-error requestCache is private attribute
        const cacheAddMock = jest.spyOn(avisSituationInseeService.requestCache, "add");

        const SIREN = new Siren("000000000");

        beforeAll(() => {
            httpGetSpy = jest.spyOn(avisSituationInseeService.http, "get");
        });

        beforeEach(() => {
            // @ts-expect-error requestCache is private attribute
            avisSituationInseeService.requestCache.collection.clear();
        });

        it("should return false because value is save in cache", async () => {
            const expected = false;
            cacheGetMock.mockImplementationOnce(() => false);
            // @ts-expect-error getInseeEstablishmentsBySiren is private method
            const actual = await avisSituationInseeService.getInseeEstablishmentsBySiren(SIREN);

            expect(actual).toBe(expected);
        });

        it("should return object because value is save in cache", async () => {
            const expected = { 42: "youpi" };
            // @ts-expect-error: mock
            cacheGetMock.mockImplementationOnce(() => expected);
            // @ts-expect-error getInseeEstablishmentsBySiren is private method
            const actual = await avisSituationInseeService.getInseeEstablishmentsBySiren(SIREN);

            expect(actual).toBe(expected);
        });

        it("should return false because axios throw error", async () => {
            const expected = false;
            httpGetSpy.mockImplementationOnce(() => {
                throw new Error();
            });
            // @ts-expect-error getInseeEstablishmentsBySiren is private method
            const actual = await avisSituationInseeService.getInseeEstablishmentsBySiren(SIREN);

            expect(actual).toBe(expected);
        });

        it("should return object returned by axios", async () => {
            const expected = { 42: "youpi" };
            httpGetSpy.mockImplementationOnce(async () => ({
                status: 200,
                data: expected,
            }));
            // @ts-expect-error getInseeEstablishmentsBySiren is private method
            const actual = await avisSituationInseeService.getInseeEstablishmentsBySiren(SIREN);

            expect(actual).toBe(expected);
        });

        it("should save object in cache", async () => {
            const expected = { 42: "youpi" };
            httpGetSpy.mockImplementationOnce(async () => ({
                status: 200,
                data: expected,
            }));
            // @ts-expect-error getInseeEstablishmentsBySiren is private method
            await avisSituationInseeService.getInseeEstablishmentsBySiren(SIREN);

            expect(cacheAddMock).toHaveBeenCalledWith(SIREN.value, expected);
        });

        it("should return false returned by axios", async () => {
            const expected = false;
            httpGetSpy.mockImplementationOnce(async () => ({
                status: 404,
                data: false,
            }));
            // @ts-expect-error getInseeEstablishmentsBySiren is private method
            const actual = await avisSituationInseeService.getInseeEstablishmentsBySiren(SIREN);

            expect(actual).toBe(expected);
        });

        it("should save false in cache", async () => {
            const expected = false;
            httpGetSpy.mockImplementationOnce(async () => ({
                status: 404,
                data: expected,
            }));
            // @ts-expect-error getInseeEstablishmentsBySiren is private method
            await avisSituationInseeService.getInseeEstablishmentsBySiren(SIREN);

            expect(cacheAddMock).toHaveBeenCalledWith(SIREN.value, expected);
        });
    });

    describe("getDocuments", () => {
        const getInseeEstablishmentsBySirenMock: jest.SpyInstance = jest.spyOn(
            avisSituationInseeService,
            // @ts-expect-error: mock private method
            "getInseeEstablishmentsBySiren",
        );

        const IDENTIFIER = AssociationIdentifier.fromSiren(new Siren("000000000"));

        it("should return emtpy array because file not found in insee", async () => {
            getInseeEstablishmentsBySirenMock.mockImplementationOnce(async () => false);

            const actual = await avisSituationInseeService.getDocuments(IDENTIFIER);

            expect(actual).toHaveLength(0);
        });

        it("should return empty array because nic not found", async () => {
            getInseeEstablishmentsBySirenMock.mockImplementationOnce(async () => ({
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
            getInseeEstablishmentsBySirenMock.mockImplementationOnce(async () => ({
                etablissements: [
                    {
                        etablissementSiege: true,
                        nic: "11111",
                    },
                ],
            }));

            const expected = [
                {
                    type: ProviderValueMapper.toProviderValue(
                        "Avis Situation Insee",
                        avisSituationInseeService.meta.name,
                        expect.any(Date),
                    ),
                    url: ProviderValueMapper.toProviderValue(
                        `/document/avis_situation_api/?url=https%3A%2F%2Fapi-avis-situation-sirene.insee.fr%2Fidentification%2Fpdf%2F00000000011111`,
                        avisSituationInseeService.meta.name,
                        expect.any(Date),
                    ),
                    nom: ProviderValueMapper.toProviderValue(
                        `Avis Situation Insee (00000000011111)`,
                        avisSituationInseeService.meta.name,
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
