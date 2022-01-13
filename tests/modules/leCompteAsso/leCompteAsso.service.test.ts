import RnaInterface from "../../../src/modules/external/interfaces/RnaInterface";
import { SiretDataInterface } from "../../../src/modules/external/interfaces/SiretDataInterface";
import rnaService from "../../../src/modules/external/rna.service";
import siretService from "../../../src/modules/external/siret.service";
import ILeCompteAssoPartialRequestEntity from "../../../src/modules/leCompteAsso/@types/ILeCompteAssoPartialRequestEntity"
import leCompteAssoService from "../../../src/modules/leCompteAsso/leCompteAsso.service";
import RequestEntity from "../../../src/modules/search/entities/RequestEntity";
import searchService from "../../../src/modules/search/search.service";

describe("leCompteAssoService", () => {
    describe("validate", () => {
        it("should validate data", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"}, data: {}};
            expect(leCompteAssoService.validEntity(entity)).toMatchObject({ success: true });
        });

        it("should reject validation because siret is wrong", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "000000000000aa", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"}, data: {}};

            expect(leCompteAssoService.validEntity(entity)).toMatchObject({
                success: false,
                msg: 'INVALID SIRET FOR 000000000000aa',
                data: {
                    siret: '000000000000aa',
                    name: 'HELLO WORLD'
                }
            });
        });

        it("should reject validation because name is wrong", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: ""}, providerInformations: { compteAssoId: "21-000000"}, data: {}};

            expect(leCompteAssoService.validEntity(entity)).toMatchObject({ 
                success: false,
                msg: 'INVALID NAME FOR ',
                data: { 
                    siret: '00000000000000',
                    name: ''
                }
            });
        });

        it("should reject validation because compteAssoId is wrong", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "00000000000000"}, data: {}};

            expect(leCompteAssoService.validEntity(entity)).toMatchObject({ 
                success: false,
                msg: 'INVALID COMPTE ASSO ID FOR HELLO WORLD',
                data: { 
                    "compteAssoId": "00000000000000",
                }
            });
        });
    });

    describe("addRequest", () => {
        let findRequestsBySiretMock: jest.SpyInstance<Promise<any>, any>;
        let siretServiceFindBySiretMock: jest.SpyInstance<Promise<any>, any>;
        let rnaServiceFindBySiretMock: jest.SpyInstance<Promise<any>, any>

        beforeEach(() => {
            findRequestsBySiretMock = jest.spyOn(searchService, "findRequestsBySiret");
            siretServiceFindBySiretMock = jest.spyOn(siretService, "findBySiret");
            rnaServiceFindBySiretMock = jest.spyOn(rnaService, "findBySiret");
        });

        afterEach(() => {
            findRequestsBySiretMock.mockClear();
            siretServiceFindBySiretMock.mockClear();
            rnaServiceFindBySiretMock.mockClear();
        });

        afterAll(() => {
            findRequestsBySiretMock.mockReset();
            siretServiceFindBySiretMock.mockReset();
            rnaServiceFindBySiretMock.mockReset();
        })

        it("should be find rna in localdb and save data in database", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            findRequestsBySiretMock.mockImplementationOnce((siret) => Promise.resolve([{legalInformations: {rna: "FAKE_RNA"}}]) as Promise<RequestEntity[]>);
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"}, data: {}};

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({ 
                state: "created",
                result: { legalInformations: { rna: "FAKE_RNA"} }
            });
        });

        it("should be update in database", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            findRequestsBySiretMock.mockImplementationOnce((siret) => Promise.resolve([{legalInformations: {rna: "FAKE_RNA"}}]) as Promise<RequestEntity[]>);
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"}, data: {}};

            await leCompteAssoService.addRequest(entity)
            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({ 
                state: "updated",
                result: { legalInformations: { rna: "FAKE_RNA"} }
            });
        });

        it("should be find rna in siret api and save data in database", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"}, data: {}};
            
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            findRequestsBySiretMock.mockImplementationOnce((siret) => Promise.resolve([]));
            siretServiceFindBySiretMock.mockImplementationOnce(siret => Promise.resolve({
                etablissement: {
                    siret,
                    unite_legale: { 
                        identifiant_association: "FAKE_RNA",
                        categorie_juridique: "9220"
                    }
                }
            }));

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({ 
                state: "created",
                result: { legalInformations: { rna: "FAKE_RNA"} }
            });
        });

        it("should be reject because legalCategory is wrong", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"}, data: {}};
            
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            findRequestsBySiretMock.mockImplementationOnce((siret) => Promise.resolve([]));
            siretServiceFindBySiretMock.mockImplementationOnce(siret => Promise.resolve({
                etablissement: {
                    siret,
                    unite_legale: { 
                        identifiant_association: null,
                        categorie_juridique: "0000"
                    }
                } 
            } as unknown as SiretDataInterface));

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({ 
                state: "rejected",
                result: {
                    "code": 10,
                    "data":  {
                        "legalCategory": "0000",
                        "name": "HELLO WORLD",
                        "siret": "00000000000000",
                    },
                    "msg": "The company is not in legal cateries accepted",
                }
            });
        });

        it("should be find rna in rna api and save data in database", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"}, data: {}};
            
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            findRequestsBySiretMock.mockImplementationOnce((siret) => Promise.resolve([]));
            siretServiceFindBySiretMock.mockImplementationOnce(siret => Promise.resolve({
                etablissement: {
                    siret,
                    unite_legale: { 
                        identifiant_association: null,
                        categorie_juridique: "9220"
                    }
                }
            } as unknown as SiretDataInterface));

            rnaServiceFindBySiretMock.mockImplementationOnce(siret => Promise.resolve({
                association: {
                    siret,
                    id_association: "FAKE_RNA",
                }
            }));

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({ 
                state: "created",
                result: { legalInformations: { rna: "FAKE_RNA"} }
            });
        });

        it("should be reject because rna not found", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"}, data: {}};
            
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            findRequestsBySiretMock.mockImplementationOnce((siret) => Promise.resolve([]));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            siretServiceFindBySiretMock.mockImplementationOnce(siret => Promise.resolve(null));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            rnaServiceFindBySiretMock.mockImplementationOnce(siret => Promise.resolve(null));

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({ 
                state: "rejected",
                result: {
                    "code": 11,
                    "data": {
                        "name": "HELLO WORLD",
                        "siret": "00000000000000",
                    },
                    "msg": "RNA not found",
                }
            });
        });
    });

    describe("findBySiret", () => {
        let findRequestsBySiretMock: jest.SpyInstance<Promise<RequestEntity[]>, [siret: string]>;

        beforeEach(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            findRequestsBySiretMock = jest.spyOn(searchService, "findRequestsBySiret").mockImplementationOnce((siret) => Promise.resolve([{legalInformations: {rna: "FAKE_RNA"}}]) as Promise<RequestEntity[]>);
        });

        afterEach(() => {
            findRequestsBySiretMock.mockClear();
        });

        afterAll(() => {
            findRequestsBySiretMock.mockReset();
        })

        it("should be found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"}, data: {}};

            await leCompteAssoService.addRequest(entity);

            expect((await leCompteAssoService.findBySiret("00000000000000"))[0]).toMatchObject(entity);
        });

        it("should be not found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"}, data: {}};

            await leCompteAssoService.addRequest(entity);

            expect((await leCompteAssoService.findBySiret("00000000000001"))).toHaveLength(0);
        });
    });

    describe("findByRna", () => {
        let findRequestsBySiretMock: jest.SpyInstance<Promise<RequestEntity[]>, [siret: string]>;

        beforeEach(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            findRequestsBySiretMock = jest.spyOn(searchService, "findRequestsBySiret").mockImplementationOnce((siret) => Promise.resolve([{legalInformations: {rna: "FAKE_RNA"}}]) as Promise<RequestEntity[]>);
        });

        afterEach(() => {
            findRequestsBySiretMock.mockClear();
        });

        afterAll(() => {
            findRequestsBySiretMock.mockReset();
        })

        it("should be found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"}, data: {}};

            await leCompteAssoService.addRequest(entity);

            expect((await leCompteAssoService.findByRna("FAKE_RNA"))[0]).toMatchObject(entity);
        });

        it("should be not found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {legalInformations: { siret: "00000000000000", name: "HELLO WORLD"}, providerInformations: { compteAssoId: "21-000000"}, data: {}};

            await leCompteAssoService.addRequest(entity);

            expect((await leCompteAssoService.findByRna("00000000000001"))).toHaveLength(0);
        });
    });
});