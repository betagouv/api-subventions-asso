import axios from "axios";
import Association from "../../../../src/modules/associations/@types/Association";
import Etablissement from "../../../../src/modules/etablissements/@types/Etablissement";
import ApiAssoDtoAdapter from "../../../../src/modules/providers/apiAsso/adapters/ApiAssoDtoAdapter";
import apiAssoService from "../../../../src/modules/providers/apiAsso/apiAsso.service"
import { fixtureAsso } from "./__fixtures__/ApiAssoStructureFixture";

describe("ApiAssoService", () => {
    const axiosMock = jest.spyOn(axios, "get");
    const adapterAssoMock = jest.spyOn(ApiAssoDtoAdapter, "toAssociation").mockImplementation((r) => [{
        ...r,
        denomination: [{ value: r.identite.nom, provider: "TEST" }],
        date_modification: [{ value: new Date() }]
    }] as unknown[] as Association[]);
    const adapterEtablissementMock = jest.spyOn(ApiAssoDtoAdapter, "toEtablissement").mockImplementation((r) => ({...r, siret: [{value: r.id_siret }]}) as unknown as Etablissement);

    afterAll(() => {
        adapterAssoMock.mockReset();
        adapterEtablissementMock.mockReset();
    })

    describe("Association Provider Part", () => {

        afterAll(() => {
            axiosMock.mockReset();
        })

        describe("getAssociationsBySiren", () =>  {

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
        });

        describe("getAssociationsBySiret", () =>  {

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

        });

        describe("getAssociationsByRna", () =>  {

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
        })


        describe("getEtablissementsBySiren", () => {
            it('should be return two etablissements', async () => {
                const expected = 2;
                const actual = await apiAssoService.getEtablissementsBySiren("509221941");
    
                expect(actual).toHaveLength(expected);
            })
        })
    })
});