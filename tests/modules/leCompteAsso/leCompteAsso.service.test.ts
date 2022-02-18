/* eslint-disable @typescript-eslint/no-explicit-any */
import { SiretDataInterface } from "../../../src/modules/external/@types/SiretDataInterface";
import entrepriseApiService from "../../../src/modules/external/entreprise-api.service";
import dataEntrepriseService from "../../../src/modules/providers/dataEntreprise/dataEntreprise.service";
import ILeCompteAssoPartialRequestEntity from "../../../src/modules/providers/leCompteAsso/@types/ILeCompteAssoPartialRequestEntity"
import ILeCompteAssoRequestInformations from "../../../src/modules/providers/leCompteAsso/@types/ILeCompteAssoRequestInformations";
import leCompteAssoService from "../../../src/modules/providers/leCompteAsso/leCompteAsso.service";
import rnaSirenService from "../../../src/modules/rna-siren/rnaSiren.service";
import RequestEntity from "../../../src/modules/search/entities/RequestEntity";
import searchService from "../../../src/modules/search/search.service";
import ProviderValueAdapter from "../../../src/shared/adapters/ProviderValueAdapter";

describe("leCompteAssoService", () => {
    describe("validate", () => {
        it("should validate data", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"} as ILeCompteAssoRequestInformations, data: {}};
            expect(leCompteAssoService.validEntity(entity)).toMatchObject({ success: true });
        });

        it("should reject validation because siret is wrong", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "000000000000aa", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"} as ILeCompteAssoRequestInformations, data: {}};

            expect(leCompteAssoService.validEntity(entity)).toMatchObject({
                success: false,
                message: 'INVALID SIRET FOR 000000000000aa',
                data: {
                    siret: '000000000000aa',
                    name: 'HELLO WORLD'
                }
            });
        });

        it("should reject validation because name is wrong", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: ""}, providerInformations: { compteAssoId: "21-000000"} as ILeCompteAssoRequestInformations, data: {}};

            expect(leCompteAssoService.validEntity(entity)).toMatchObject({ 
                success: false,
                message: 'INVALID NAME FOR ',
                data: { 
                    siret: '00000000000000',
                    name: ''
                }
            });
        });

        it("should reject validation because compteAssoId is wrong", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "00000000000000"} as ILeCompteAssoRequestInformations, data: {}};

            expect(leCompteAssoService.validEntity(entity)).toMatchObject({ 
                success: false,
                message: 'INVALID COMPTE ASSO ID FOR HELLO WORLD',
                data: { 
                    "compteAssoId": "00000000000000",
                }
            });
        });
    });

    describe("addRequest", () => {
        
        let dataEntrepriseServiceFindAssociationBySiren: jest.SpyInstance<Promise<unknown>>;

        beforeEach(() => {
            dataEntrepriseServiceFindAssociationBySiren = jest.spyOn(dataEntrepriseService, "findAssociationBySiren");
        });

        afterEach(() => {
            dataEntrepriseServiceFindAssociationBySiren.mockClear();
        })

        afterAll(() => {
            dataEntrepriseServiceFindAssociationBySiren.mockReset();
        })

        it("should be find rna in localdb and save data in database", async () => {
            dataEntrepriseServiceFindAssociationBySiren.mockImplementation(() => Promise.resolve({
                rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date()),
            }));

            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"} as ILeCompteAssoRequestInformations, data: {}};

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({ 
                state: "created",
                result: { legalInformations: { rna: "FAKE_RNA"} }
            });
        });

        it("should be update in database", async () => {
            dataEntrepriseServiceFindAssociationBySiren.mockImplementation(() => Promise.resolve({
                rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date()),
            }));

            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"} as ILeCompteAssoRequestInformations, data: {}};

            await leCompteAssoService.addRequest(entity)
            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({ 
                state: "updated",
                result: { legalInformations: { rna: "FAKE_RNA"} }
            });
        });

        it("should be find rna in siret api and save data in database", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"} as ILeCompteAssoRequestInformations, data: {}};
            
            dataEntrepriseServiceFindAssociationBySiren.mockImplementation(() => Promise.resolve({
                rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date()),
            }));

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({ 
                state: "created",
                result: { legalInformations: { rna: "FAKE_RNA"} }
            });
        });

        it("should be reject because legalCategory is wrong", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"} as ILeCompteAssoRequestInformations, data: {}};
            
            dataEntrepriseServiceFindAssociationBySiren.mockImplementation(() => Promise.resolve({
                rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                categorie_juridique: ProviderValueAdapter.toProviderValues("0000", "test", new Date()),
            }));

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({ 
                state: "rejected",
                result: {
                    "code": 10,
                    "data":  {
                        "name": "HELLO WORLD",
                        "siret": "00000000000000",
                    },
                    "message": "The company is not in legal cateries accepted",
                }
            });
        });


        it("should be reject because rna not found", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"} as ILeCompteAssoRequestInformations, data: {}};
            dataEntrepriseServiceFindAssociationBySiren.mockImplementation(() => Promise.resolve(null));

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({ 
                state: "rejected",
                result: {
                    "code": 11,
                    "data": {
                        "name": "HELLO WORLD",
                        "siret": "00000000000000",
                    },
                    "message": "RNA not found",
                }
            });
        });
    });

    describe("findBySiret", () => {
        let dataEntrepriseServiceFindAssociationBySiren: jest.SpyInstance<Promise<unknown>>
        beforeEach(() => {
            dataEntrepriseServiceFindAssociationBySiren = jest.spyOn(dataEntrepriseService, "findAssociationBySiren");
            dataEntrepriseServiceFindAssociationBySiren.mockImplementation(() => Promise.resolve({
                rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date()),
            }));
        });

        afterEach(() => {
            dataEntrepriseServiceFindAssociationBySiren.mockReset();
        })
        
        afterAll(() => {
            dataEntrepriseServiceFindAssociationBySiren.mockClear();
        })

        it("should be found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"} as ILeCompteAssoRequestInformations, data: {}};

            await leCompteAssoService.addRequest(entity);

            expect((await leCompteAssoService.findBySiret("00000000000000"))[0]).toMatchObject(entity);
        });

        it("should be not found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"} as ILeCompteAssoRequestInformations, data: {}};

            await leCompteAssoService.addRequest(entity);

            expect((await leCompteAssoService.findBySiret("00000000000001"))).toHaveLength(0);
        });
    });

    describe("findByRna", () => {
        let dataEntrepriseServiceFindAssociationBySiren: jest.SpyInstance<Promise<unknown>>
        beforeEach(() => {
            dataEntrepriseServiceFindAssociationBySiren = jest.spyOn(dataEntrepriseService, "findAssociationBySiren");
            dataEntrepriseServiceFindAssociationBySiren.mockImplementation(() => Promise.resolve({
                rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date()),
            }));
        });

        afterEach(() => {
            dataEntrepriseServiceFindAssociationBySiren.mockReset();
        })
        
        afterAll(() => {
            dataEntrepriseServiceFindAssociationBySiren.mockClear();
        })

        it("should be found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"} as ILeCompteAssoRequestInformations, data: {}};

            await leCompteAssoService.addRequest(entity);

            expect((await leCompteAssoService.findByRna("FAKE_RNA"))[0]).toMatchObject(entity);
        });

        it("should be not found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"} as ILeCompteAssoRequestInformations, data: {}};

            await leCompteAssoService.addRequest(entity);

            expect((await leCompteAssoService.findByRna("00000000000001"))).toHaveLength(0);
        });
    });
});