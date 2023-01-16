import dataEntrepriseService from "../../../src/modules/providers/dataEntreprise/dataEntreprise.service";
import ILeCompteAssoPartialRequestEntity from "../../../src/modules/providers/leCompteAsso/@types/ILeCompteAssoPartialRequestEntity";
import ILeCompteAssoRequestInformations from "../../../src/modules/providers/leCompteAsso/@types/ILeCompteAssoRequestInformations";
import leCompteAssoService from "../../../src/modules/providers/leCompteAsso/leCompteAsso.service";
import leCompteAssoRepository from "../../../src/modules/providers/leCompteAsso/repositories/leCompteAsso.repository";
import ProviderValueAdapter from "../../../src/shared/adapters/ProviderValueAdapter";
import EventManager from "../../../src/shared/EventManager";

describe("leCompteAssoService", () => {
    describe("validate", () => {
        it("should validate data", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000"
                } as ILeCompteAssoRequestInformations,
                data: {}
            };
            expect(leCompteAssoService.validEntity(entity)).toMatchObject({
                success: true
            });
        });

        it("should reject validation because siret is wrong", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "000000000000aa", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000"
                } as ILeCompteAssoRequestInformations,
                data: {}
            };

            expect(leCompteAssoService.validEntity(entity)).toMatchObject({
                success: false,
                message: "INVALID SIRET FOR 000000000000aa",
                data: {
                    siret: "000000000000aa",
                    name: "HELLO WORLD"
                }
            });
        });

        it("should reject validation because name is wrong", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "" },
                providerInformations: {
                    compteAssoId: "21-000000"
                } as ILeCompteAssoRequestInformations,
                data: {}
            };

            expect(leCompteAssoService.validEntity(entity)).toMatchObject({
                success: false,
                message: "INVALID NAME FOR ",
                data: {
                    siret: "00000000000000",
                    name: ""
                }
            });
        });

        it("should reject validation because compteAssoId is wrong", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "00000000000000"
                } as ILeCompteAssoRequestInformations,
                data: {}
            };

            expect(leCompteAssoService.validEntity(entity)).toMatchObject({
                success: false,
                message: "INVALID COMPTE ASSO ID FOR HELLO WORLD",
                data: {
                    compteAssoId: "00000000000000"
                }
            });
        });
    });

    describe("addRequest", () => {
        const eventManagerMock = jest
            .spyOn(EventManager, "call")
            .mockImplementation((name, value) => Promise.resolve({ name, value }));
        let dataEntrepriseServiceFindAssociationBySiren: jest.SpyInstance<Promise<unknown>>;

        beforeEach(() => {
            dataEntrepriseServiceFindAssociationBySiren = jest.spyOn(dataEntrepriseService, "findAssociationBySiren");
        });

        afterEach(() => {
            dataEntrepriseServiceFindAssociationBySiren.mockClear();
        });

        afterAll(() => {
            dataEntrepriseServiceFindAssociationBySiren.mockReset();
            eventManagerMock.mockReset();
        });

        it("should find rna in localdb and save data in database", async () => {
            dataEntrepriseServiceFindAssociationBySiren.mockImplementation(() =>
                Promise.resolve({
                    rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                    categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date())
                })
            );

            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000"
                } as ILeCompteAssoRequestInformations,
                data: {}
            };

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({
                state: "created",
                result: { legalInformations: { rna: "FAKE_RNA" } }
            });
        });

        it("should update in database", async () => {
            dataEntrepriseServiceFindAssociationBySiren.mockImplementation(() =>
                Promise.resolve({
                    rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                    categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date())
                })
            );

            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000"
                } as ILeCompteAssoRequestInformations,
                data: {}
            };

            await leCompteAssoService.addRequest(entity);
            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({
                state: "updated",
                result: { legalInformations: { rna: "FAKE_RNA" } }
            });
        });

        it("should find rna in siret api and save data in database", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000"
                } as ILeCompteAssoRequestInformations,
                data: {}
            };

            dataEntrepriseServiceFindAssociationBySiren.mockImplementation(() =>
                Promise.resolve({
                    rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                    categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date())
                })
            );

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({
                state: "created",
                result: { legalInformations: { rna: "FAKE_RNA" } }
            });
        });

        it("should reject because legalCategory is wrong", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000"
                } as ILeCompteAssoRequestInformations,
                data: {}
            };

            dataEntrepriseServiceFindAssociationBySiren.mockImplementation(() =>
                Promise.resolve({
                    rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                    categorie_juridique: ProviderValueAdapter.toProviderValues("0000", "test", new Date())
                })
            );

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({
                state: "rejected",
                result: {
                    code: 10,
                    data: {
                        name: "HELLO WORLD",
                        siret: "00000000000000"
                    },
                    message: "The company is not in legal cateries accepted"
                }
            });
        });

        it("should reject because rna not found", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000"
                } as ILeCompteAssoRequestInformations,
                data: {}
            };
            dataEntrepriseServiceFindAssociationBySiren.mockImplementation(() => Promise.resolve(null));

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({
                state: "rejected",
                result: {
                    code: 11,
                    data: {
                        name: "HELLO WORLD",
                        siret: "00000000000000"
                    },
                    message: "RNA not found"
                }
            });
        });

        it("should call EventManager", async () => {
            // @ts-expect-error: Jest mock
            jest.spyOn(leCompteAssoRepository, "findByCompteAssoId").mockImplementationOnce(() =>
                Promise.resolve({ legalInformations: { rna: RNA } })
            );
            const LAST_UPDATE = new Date();
            const RNA = "RNA";
            const SIREN = "SIREN";
            const NAME = "NAME";
            const PARTIAL_ENTITY = {
                legalInformations: { siret: SIREN, name: NAME },
                providerInformations: {
                    compeAssoId: "",
                    transmis_le: LAST_UPDATE
                } as unknown as ILeCompteAssoRequestInformations,
                data: {}
            };
            await leCompteAssoService.addRequest(PARTIAL_ENTITY);
            expect(eventManagerMock).toHaveBeenCalledTimes(2);
            expect(eventManagerMock).toHaveBeenNthCalledWith(1, "rna-siren.matching", [{ rna: RNA, siren: SIREN }]);
            expect(eventManagerMock).toHaveBeenNthCalledWith(2, "association-name.matching", [
                {
                    rna: RNA,
                    siren: SIREN,
                    name: NAME,
                    provider: leCompteAssoService.provider.name,
                    lastUpdate: LAST_UPDATE
                }
            ]);
        });
    });

    describe("findBySiret", () => {
        let dataEntrepriseServiceFindAssociationBySiren: jest.SpyInstance<Promise<unknown>>;
        beforeEach(() => {
            dataEntrepriseServiceFindAssociationBySiren = jest.spyOn(dataEntrepriseService, "findAssociationBySiren");
            dataEntrepriseServiceFindAssociationBySiren.mockImplementation(() =>
                Promise.resolve({
                    rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                    categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date())
                })
            );
        });

        afterEach(() => {
            dataEntrepriseServiceFindAssociationBySiren.mockReset();
        });

        afterAll(() => {
            dataEntrepriseServiceFindAssociationBySiren.mockClear();
        });

        it("should be found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000"
                } as ILeCompteAssoRequestInformations,
                data: {}
            };

            await leCompteAssoService.addRequest(entity);

            expect((await leCompteAssoService.findBySiret("00000000000000"))[0]).toMatchObject(entity);
        });

        it("should be not found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000"
                } as ILeCompteAssoRequestInformations,
                data: {}
            };

            await leCompteAssoService.addRequest(entity);

            expect(await leCompteAssoService.findBySiret("00000000000001")).toHaveLength(0);
        });
    });

    describe("findByRna", () => {
        let dataEntrepriseServiceFindAssociationBySiren: jest.SpyInstance<Promise<unknown>>;
        beforeEach(() => {
            dataEntrepriseServiceFindAssociationBySiren = jest.spyOn(dataEntrepriseService, "findAssociationBySiren");
            dataEntrepriseServiceFindAssociationBySiren.mockImplementation(() =>
                Promise.resolve({
                    rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                    categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date())
                })
            );
        });

        afterEach(() => {
            dataEntrepriseServiceFindAssociationBySiren.mockReset();
        });

        afterAll(() => {
            dataEntrepriseServiceFindAssociationBySiren.mockClear();
        });

        it("should be found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000"
                } as ILeCompteAssoRequestInformations,
                data: {}
            };

            await leCompteAssoService.addRequest(entity);

            expect((await leCompteAssoService.findByRna("FAKE_RNA"))[0]).toMatchObject(entity);
        });

        it("should be not found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000"
                } as ILeCompteAssoRequestInformations,
                data: {}
            };

            await leCompteAssoService.addRequest(entity);

            expect(await leCompteAssoService.findByRna("00000000000001")).toHaveLength(0);
        });
    });
});
