
import axios from 'axios';
import { StructureIdentifiersEnum } from '../../../@enums/StructureIdentifiersEnum';
import ProviderValueAdapter from '../../../shared/adapters/ProviderValueAdapter';
import * as IdentifierHelper from '../../../shared/helpers/IdentifierHelper';
import rnaSirenService from '../../open-data/rna-siren/rnaSiren.service';
import avisSituationInseeService from './avisSituationInsee.service';

describe("AvisSituationInseeService", () => {

    describe("getInseeEtablissements", () => {
        const getIdentifierTypeMock = jest.spyOn(IdentifierHelper, "getIdentifierType");
        const axiosGetMock = jest.spyOn(axios, "get");
        // @ts-expect-error requestCache is private attribute
        const cacheGetMock = jest.spyOn(avisSituationInseeService.requestCache, "get");
        // @ts-expect-error requestCache is private attribute
        const cacheAddMock = jest.spyOn(avisSituationInseeService.requestCache, "add");
        // @ts-expect-error requestCache is private attribute
        const cacheHasMock = jest.spyOn(avisSituationInseeService.requestCache, "has");

        beforeEach(() => {
            // @ts-expect-error requestCache is private attribute
            avisSituationInseeService.requestCache.collection.clear();
        })

        it("should return false because type is not valid", async () => {
            const expected = false;
            getIdentifierTypeMock.mockImplementationOnce(() => null);

            // @ts-expect-error getInseeEtablissements is private method
            const actual = await avisSituationInseeService.getInseeEtablissements("");

            expect(actual).toBe(expected)
        })

        it("should return false because value is save in cache", async () => {
            const expected = false;
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            cacheGetMock.mockImplementationOnce(() => [false]);
            cacheHasMock.mockImplementationOnce(() => true);
            // @ts-expect-error getInseeEtablissements is private method
            const actual = await avisSituationInseeService.getInseeEtablissements("");

            expect(actual).toBe(expected)
        })

        it("should return object because value is save in cache", async () => {
            const expected = { 42: "youpi" };
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            cacheGetMock.mockImplementationOnce(() => [expected as unknown as any]);
            cacheHasMock.mockImplementationOnce(() => true);
            // @ts-expect-error getInseeEtablissements is private method
            const actual = await avisSituationInseeService.getInseeEtablissements("");

            expect(actual).toBe(expected)
        })

        it("should return false because axios throw error", async () => {
            const expected = false;
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            cacheHasMock.mockImplementationOnce(() => false);
            axiosGetMock.mockImplementationOnce(() => { throw new Error() })
            // @ts-expect-error getInseeEtablissements is private method
            const actual = await avisSituationInseeService.getInseeEtablissements("");

            expect(actual).toBe(expected);
        })

        it("should return object returned by axios", async () => {
            const expected = { 42: "youpi" };
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            cacheHasMock.mockImplementationOnce(() => false);
            axiosGetMock.mockImplementationOnce(async () => ({
                status: 200,
                data: expected
            }))
            // @ts-expect-error getInseeEtablissements is private method
            const actual = await avisSituationInseeService.getInseeEtablissements("");

            expect(actual).toBe(expected);
        })


        it("should save object in cache", async () => {
            const expected = { 42: "youpi" };
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            cacheHasMock.mockImplementationOnce(() => false);
            axiosGetMock.mockImplementationOnce(async () => ({
                status: 200,
                data: expected
            }))
            // @ts-expect-error getInseeEtablissements is private method
            await avisSituationInseeService.getInseeEtablissements("SIREN");

            expect(cacheAddMock).toHaveBeenCalledWith("SIREN", expected);
        })

        it("should return false returned by axios", async () => {
            const expected = false;
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            cacheHasMock.mockImplementationOnce(() => false);
            axiosGetMock.mockImplementationOnce(async () => ({
                status: 404,
                data: false
            }))
            // @ts-expect-error getInseeEtablissements is private method
            const actual = await avisSituationInseeService.getInseeEtablissements("");

            expect(actual).toBe(expected);
        })


        it("should save false in cache", async () => {
            const expected = false;
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            cacheHasMock.mockImplementationOnce(() => false);
            axiosGetMock.mockImplementationOnce(async () => ({
                status: 404,
                data: expected
            }))
            // @ts-expect-error getInseeEtablissements is private method
            await avisSituationInseeService.getInseeEtablissements("SIREN");

            expect(cacheAddMock).toHaveBeenCalledWith("SIREN", expected);
        })
    })

    describe("getDocumentsBySiren", () => {
        // @ts-expect-error getInseeEtablissements is private method
        const getInseeEtablissementsMock = jest.spyOn<any, Promise<{
            etablissements: {
                nic: string,
                etablissementSiege: boolean
            }[]
        } | false>>(avisSituationInseeService, "getInseeEtablissements");

        it("should return null because file not found in insee", async () => {
            getInseeEtablissementsMock.mockImplementationOnce(async () => false);

            const expected = null;

            const actual = await avisSituationInseeService.getDocumentsBySiren("");

            expect(actual).toBe(expected);
        });

        it("should return null because nic not found", async () => {
            getInseeEtablissementsMock.mockImplementationOnce(async () => ({
                etablissements: [{
                    etablissementSiege: false,
                    nic: "11111"
                }]
            }));

            const expected = null;

            const actual = await avisSituationInseeService.getDocumentsBySiren("");

            expect(actual).toBe(expected);
        })

        it("should return null because nic not found", async () => {
            getInseeEtablissementsMock.mockImplementationOnce(async () => ({
                etablissements: [{
                    etablissementSiege: true,
                    nic: "11111"
                }]
            }));

            const expected = [{
                type: ProviderValueAdapter.toProviderValue('Avis Situation Insee', avisSituationInseeService.provider.name, expect.any(Date)),
                url: ProviderValueAdapter.toProviderValue(`https://api.avis-situation-sirene.insee.fr/identification/pdf/00000000011111`, avisSituationInseeService.provider.name, expect.any(Date)),
                nom: ProviderValueAdapter.toProviderValue(`Avis Situation Insee (00000000011111)`, avisSituationInseeService.provider.name, expect.any(Date)),
                __meta__: {
                    siret: "00000000011111"
                }
            }];

            const actual = await avisSituationInseeService.getDocumentsBySiren("000000000");

            expect(actual).toEqual(expected);
        })
    });

    describe("getDocumentsBySiret", () => {
        // @ts-expect-error getInseeEtablissements is private method
        const getInseeEtablissementsMock = jest.spyOn<any, Promise<{
            etablissements: {
                nic: string,
                etablissementSiege: boolean
            }[]
        } | false>>(avisSituationInseeService, "getInseeEtablissements");

        it("should return null because file not found in insee", async () => {
            getInseeEtablissementsMock.mockImplementationOnce(async () => false);

            const expected = null;

            const actual = await avisSituationInseeService.getDocumentsBySiret("");

            expect(actual).toBe(expected);
        });

        it("should return null because nic not found", async () => {
            getInseeEtablissementsMock.mockImplementationOnce(async () => ({
                etablissements: [{
                    etablissementSiege: true,
                    nic: "11111"
                }]
            }));

            const expected = [{
                type: ProviderValueAdapter.toProviderValue('Avis Situation Insee', avisSituationInseeService.provider.name, expect.any(Date)),
                url: ProviderValueAdapter.toProviderValue(`https://api.avis-situation-sirene.insee.fr/identification/pdf/00000000011111`, avisSituationInseeService.provider.name, expect.any(Date)),
                nom: ProviderValueAdapter.toProviderValue(`Avis Situation Insee (00000000011111)`, avisSituationInseeService.provider.name, expect.any(Date)),
                __meta__: {
                    siret: "00000000011111"
                }
            }];

            const actual = await avisSituationInseeService.getDocumentsBySiret("00000000011111");

            expect(actual).toEqual(expected);
        })
    });

    describe("getDocumentByRna", () => {
        const getSirenMock = jest.spyOn(rnaSirenService, "getSiren");
        const getDocumentsBySirenMock = jest.spyOn(avisSituationInseeService, "getDocumentsBySiren");

        it("should return null because siren not found", async () => {
            getSirenMock.mockImplementationOnce(async () => null);

            const expected = null;
            const actual = await avisSituationInseeService.getDocumentsByRna("");

            expect(actual).toBe(expected);
        })

        it("should call getDocumentsBySiren with founded siren", async () => {
            getSirenMock.mockImplementationOnce(async () => expected);
            getDocumentsBySirenMock.mockImplementation(async () => ({} as any))

            const expected = "000000000";
            await avisSituationInseeService.getDocumentsByRna("");

            expect(avisSituationInseeService.getDocumentsBySiren).toHaveBeenCalledWith(expected);
        })

        it("should return getDocumentsBySiren anwser", async () => {
            getSirenMock.mockImplementationOnce(async () => "000000000");
            getDocumentsBySirenMock.mockImplementation(async () => (expected as any))

            const expected = { imTest: true };
            const actual = await avisSituationInseeService.getDocumentsByRna("");

            expect(actual).toBe(expected);
        })
    })
});