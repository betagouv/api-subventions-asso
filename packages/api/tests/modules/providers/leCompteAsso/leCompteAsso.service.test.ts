import associationNameService from "../../../../src/modules/association-name/associationName.service";
import rnaSirenService from "../../../../src/modules/_open-data/rna-siren/rnaSiren.service";
import apiAssoService from "../../../../src/modules/providers/apiAsso/apiAsso.service";
import ILeCompteAssoPartialRequestEntity from "../../../../src/modules/providers/leCompteAsso/@types/ILeCompteAssoPartialRequestEntity";
import ILeCompteAssoRequestInformations from "../../../../src/modules/providers/leCompteAsso/@types/ILeCompteAssoRequestInformations";
import leCompteAssoService from "../../../../src/modules/providers/leCompteAsso/leCompteAsso.service";
import ProviderValueAdapter from "../../../../src/shared/adapters/ProviderValueAdapter";
import EventManager from "../../../../src/shared/EventManager";

describe("leCompteAssoService", () => {
    describe("validate", () => {
        it("should validate data", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000",
                } as ILeCompteAssoRequestInformations,
                data: {},
            };
            expect(leCompteAssoService.validEntity(entity)).toEqual(true);
        });

        it("should reject validation because siret is wrong", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "000000000000aa", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000",
                } as ILeCompteAssoRequestInformations,
                data: {},
            };

            expect(leCompteAssoService.validEntity(entity)).toMatchObject({
                message: "INVALID SIRET FOR 000000000000aa",
                data: {
                    siret: "000000000000aa",
                    name: "HELLO WORLD",
                },
            });
        });

        it("should reject validation because name is wrong", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "" },
                providerInformations: {
                    compteAssoId: "21-000000",
                } as ILeCompteAssoRequestInformations,
                data: {},
            };

            expect(leCompteAssoService.validEntity(entity)).toMatchObject({
                message: "INVALID NAME FOR ",
                data: {
                    siret: "00000000000000",
                    name: "",
                },
            });
        });

        it("should reject validation because compteAssoId is wrong", () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "00000000000000",
                } as ILeCompteAssoRequestInformations,
                data: {},
            };

            expect(leCompteAssoService.validEntity(entity)).toMatchObject({
                message: "INVALID COMPTE ASSO ID FOR HELLO WORLD",
                data: {
                    compteAssoId: "00000000000000",
                },
            });
        });
    });

    describe("addRequest", () => {
        const eventManagerMock = jest
            .spyOn(EventManager, "call")
            .mockImplementation((name, value) => Promise.resolve({ name, value }));
        let apiAssoServiceFindAssociationBySiren: jest.SpyInstance<Promise<unknown>>;
        let associationNameUpsertMock: jest.SpyInstance;
        let rnaSirenServiceMock: jest.SpyInstance;

        beforeEach(() => {
            apiAssoServiceFindAssociationBySiren = jest.spyOn(apiAssoService, "findAssociationBySiren");
            associationNameUpsertMock.mockClear();
        });

        afterEach(() => {
            apiAssoServiceFindAssociationBySiren.mockClear();
        });

        beforeAll(() => {
            // @ts-expect-error mock mongodb return value
            associationNameUpsertMock = jest.spyOn(associationNameService, "upsert").mockResolvedValue();
            rnaSirenServiceMock = jest.spyOn(rnaSirenService, "getRna");
        });

        afterAll(() => {
            apiAssoServiceFindAssociationBySiren.mockReset();
            eventManagerMock.mockReset();
            associationNameUpsertMock.mockRestore();
            rnaSirenServiceMock.mockRestore();
        });

        it("should find rna in localdb and save data in database", async () => {
            apiAssoServiceFindAssociationBySiren.mockImplementation(() =>
                Promise.resolve({
                    rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                    categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date()),
                }),
            );

            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000",
                } as ILeCompteAssoRequestInformations,
                data: {},
            };

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({
                state: "created",
                result: { legalInformations: { rna: "FAKE_RNA" } },
            });
        });

        it("should update in database", async () => {
            apiAssoServiceFindAssociationBySiren.mockImplementation(() =>
                Promise.resolve({
                    rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                    categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date()),
                }),
            );

            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000",
                } as ILeCompteAssoRequestInformations,
                data: {},
            };

            await leCompteAssoService.addRequest(entity);
            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({
                state: "updated",
                result: { legalInformations: { rna: "FAKE_RNA" } },
            });
        });

        it("should find rna in siret api and save data in database", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000",
                } as ILeCompteAssoRequestInformations,
                data: {},
            };

            apiAssoServiceFindAssociationBySiren.mockImplementation(() =>
                Promise.resolve({
                    rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                    categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date()),
                }),
            );

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({
                state: "created",
                result: { legalInformations: { rna: "FAKE_RNA" } },
            });
        });

        it("should reject because legalCategory is wrong", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000",
                } as ILeCompteAssoRequestInformations,
                data: {},
            };

            apiAssoServiceFindAssociationBySiren.mockImplementation(() =>
                Promise.resolve({
                    rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                    categorie_juridique: ProviderValueAdapter.toProviderValues("0000", "test", new Date()),
                }),
            );

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({
                state: "rejected",
                result: {
                    code: 10,
                    data: {
                        name: "HELLO WORLD",
                        siret: "00000000000000",
                    },
                    message: "The company is not in legal categories accepted",
                },
            });
        });

        it("should reject because rna not found", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000",
                } as ILeCompteAssoRequestInformations,
                data: {},
            };
            apiAssoServiceFindAssociationBySiren.mockImplementation(() => Promise.resolve(null));

            expect(await leCompteAssoService.addRequest(entity)).toMatchObject({
                state: "rejected",
                result: {
                    code: 11,
                    data: {
                        name: "HELLO WORLD",
                        siret: "00000000000000",
                    },
                    message: "RNA not found",
                },
            });
        });

        it("should call EventManager", async () => {
            const LAST_UPDATE = new Date();
            const RNA = "RNA";
            const SIREN = "SIREN";
            const NAME = "NAME";
            const PARTIAL_ENTITY = {
                legalInformations: { siret: SIREN, name: NAME },
                providerInformations: {
                    compeAssoId: "",
                    transmis_le: LAST_UPDATE,
                } as unknown as ILeCompteAssoRequestInformations,
                data: {},
            };
            rnaSirenServiceMock.mockResolvedValueOnce(RNA);
            apiAssoServiceFindAssociationBySiren.mockResolvedValueOnce({
                categorie_juridique: [{ value: "9210" }],
            });
            await leCompteAssoService.addRequest(PARTIAL_ENTITY);
            expect(eventManagerMock).toHaveBeenCalledTimes(1);
            expect(eventManagerMock).toHaveBeenNthCalledWith(1, "rna-siren.matching", [{ rna: RNA, siren: SIREN }]);
        });

        it("should call association name upsert", async () => {
            const LAST_UPDATE = new Date();
            const RNA = "RNA";
            const SIREN = "SIREN";
            const NAME = "NAME";
            const PARTIAL_ENTITY = {
                legalInformations: { siret: SIREN, name: NAME },
                providerInformations: {
                    compeAssoId: "",
                    transmis_le: LAST_UPDATE,
                } as unknown as ILeCompteAssoRequestInformations,
                data: {},
            };
            rnaSirenServiceMock.mockResolvedValueOnce(RNA);
            apiAssoServiceFindAssociationBySiren.mockResolvedValueOnce({
                categorie_juridique: [{ value: "9210" }],
            });
            await leCompteAssoService.addRequest(PARTIAL_ENTITY);
            expect(associationNameUpsertMock).toHaveBeenCalledTimes(1);
            expect(associationNameUpsertMock).toHaveBeenCalledWith({
                rna: RNA,
                siren: SIREN,
                name: NAME,
                provider: leCompteAssoService.provider.name,
                lastUpdate: LAST_UPDATE,
            });
        });
    });

    describe("findBySiret", () => {
        let apiAssoServiceFindAssociationBySiren: jest.SpyInstance<Promise<unknown>>;
        beforeEach(() => {
            apiAssoServiceFindAssociationBySiren = jest.spyOn(apiAssoService, "findAssociationBySiren");
            apiAssoServiceFindAssociationBySiren.mockImplementation(() =>
                Promise.resolve({
                    rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                    categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date()),
                }),
            );
        });

        afterEach(() => {
            apiAssoServiceFindAssociationBySiren.mockReset();
        });

        afterAll(() => {
            apiAssoServiceFindAssociationBySiren.mockClear();
        });

        it("should be found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000",
                } as ILeCompteAssoRequestInformations,
                data: {},
            };

            await leCompteAssoService.addRequest(entity);

            expect((await leCompteAssoService.findBySiret("00000000000000"))[0]).toMatchObject(entity);
        });

        it("should be not found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000",
                } as ILeCompteAssoRequestInformations,
                data: {},
            };

            await leCompteAssoService.addRequest(entity);

            expect(await leCompteAssoService.findBySiret("00000000000001")).toHaveLength(0);
        });
    });

    describe("findByRna", () => {
        let apiAssoServiceFindAssociationBySiren: jest.SpyInstance<Promise<unknown>>;
        beforeEach(() => {
            apiAssoServiceFindAssociationBySiren = jest.spyOn(apiAssoService, "findAssociationBySiren");
            apiAssoServiceFindAssociationBySiren.mockImplementation(() =>
                Promise.resolve({
                    rna: ProviderValueAdapter.toProviderValues("FAKE_RNA", "test", new Date()),
                    categorie_juridique: ProviderValueAdapter.toProviderValues("9220", "test", new Date()),
                }),
            );
        });

        afterEach(() => {
            apiAssoServiceFindAssociationBySiren.mockReset();
        });

        afterAll(() => {
            apiAssoServiceFindAssociationBySiren.mockClear();
        });

        it("should be found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000",
                } as ILeCompteAssoRequestInformations,
                data: {},
            };

            await leCompteAssoService.addRequest(entity);

            expect((await leCompteAssoService.findByRna("FAKE_RNA"))[0]).toMatchObject(entity);
        });

        it("should be not found entity", async () => {
            const entity: ILeCompteAssoPartialRequestEntity = {
                legalInformations: { siret: "00000000000000", name: "HELLO WORLD" },
                providerInformations: {
                    compteAssoId: "21-000000",
                } as ILeCompteAssoRequestInformations,
                data: {},
            };

            await leCompteAssoService.addRequest(entity);

            expect(await leCompteAssoService.findByRna("00000000000001")).toHaveLength(0);
        });
    });
});
