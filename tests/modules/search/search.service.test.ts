import OsirisActionEntity from "../../../src/modules/osiris/entities/OsirisActionEntity";
import osirisService from "../../../src/modules/osiris/osiris.service";
import searchService from "../../../src/modules/search/search.service";
import OsirisRequestEntity from "../../../src/modules/osiris/entities/OsirisRequestEntity";
import entrepriseApiSerivce from "../../../src/modules/external/entreprise-api.service";

describe("SearchService", () => {
    const spys: jest.SpyInstance<unknown>[] = [];
    beforeAll(() => {
        spys.push(
            jest.spyOn(entrepriseApiSerivce, "findRnaDataByRna"),
            jest.spyOn(entrepriseApiSerivce, "findRnaDataBySiret"),
            jest.spyOn(entrepriseApiSerivce, "findSiretDataBySiret"),
            jest.spyOn(osirisService, "findBySiret"),
            jest.spyOn(osirisService, "findByRna"),
        )
    });

    afterAll(() => {
        spys.forEach(spy => spy.mockReset());
    });

    describe("getBySiret", () => {

        const request = new OsirisRequestEntity({ siret: "FAKE_SIRET", rna: "RNA", name: "NAME"}, { osirisId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID"}, {}, undefined, []);
        const action =  new OsirisActionEntity({ osirisActionId: "OSIRISID", compteAssoId: "COMPTEASSOID"}, {}, undefined);
        beforeEach(async () => {
            await osirisService.addRequest(request);
            await osirisService.addAction(action);
        });

        it('should returns file contains actions but no provider data', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findRnaDataBySiret.mockImplementationOnce(() => null);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findRnaDataByRna.mockImplementationOnce(() => null);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findSiretDataBySiret.mockImplementationOnce(() => null);

            expect(await searchService.getBySiret("FAKE_SIRET")).toMatchObject({
                requests: [
                    [{
                        legalInformations: { siret: "FAKE_SIRET", rna: "RNA", name: "NAME"},
                        actions: [action]
                    }],
                ],
                entrepriseApi: {
                    association: {
                        rna: null,
                        siret: null
                    },
                    entreprise: null,
                }
            })
        })

        it('should returns file contains actions', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findRnaDataBySiret.mockImplementationOnce(() => ({ a: 1, b: 2 }));

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findRnaDataByRna.mockImplementationOnce(() => ({ a: 5, b: 6 }));

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findSiretDataBySiret.mockImplementationOnce(() => ({ a: 3, b: 4 }));

            expect(await searchService.getBySiret("FAKE_SIRET")).toMatchObject({
                requests: [
                    [{
                        legalInformations: { siret: "FAKE_SIRET", rna: "RNA", name: "NAME"},
                        actions: [action]
                    }],
                ],
                entrepriseApi: {
                    association: {
                        siret: { a: 1, b: 2 },
                        rna: { a: 5, b: 6 }
                    },

                    entreprise: { a: 3, b: 4 },
                }
            })
        })

    });

    describe("getByRna", () => {

        const request = new OsirisRequestEntity({ siret: "FAKE_SIRET", rna: "RNA", name: "NAME"}, { osirisId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID"}, {}, undefined, []);
        const action =  new OsirisActionEntity({ osirisActionId: "OSIRISID", compteAssoId: "COMPTEASSOID"}, {}, undefined);
        beforeEach(async () => {
            await osirisService.addRequest(request);
            await osirisService.addAction(action);
        });

        it('should returns file contains actions but no provider data', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findRnaDataBySiret.mockImplementationOnce(() => null);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findRnaDataByRna.mockImplementationOnce(() => null);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findSiretDataBySiret.mockImplementationOnce(() => null);

            expect(await searchService.getByRna("RNA")).toMatchObject({
                requests: [
                    [{
                        legalInformations: { siret: "FAKE_SIRET", rna: "RNA", name: "NAME"},
                        actions: [action]
                    }],
                ],
                entrepriseApi: {
                    association: {
                        rna: null,
                        siret: null,
                    },
                    entreprise: null
                }
            })
        })

        it('should returns file contains actions', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findRnaDataBySiret.mockImplementationOnce(() => ({ a: 1, b: 2 }));

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findRnaDataByRna.mockImplementationOnce(() => ({ a: 5, b: 6 }));

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findSiretDataBySiret.mockImplementationOnce(() => ({ a: 3, b: 4 }));

            expect(await searchService.getByRna("RNA")).toMatchObject({
                requests: [
                    [{
                        legalInformations: { siret: "FAKE_SIRET", rna: "RNA", name: "NAME"},
                        actions: [action]
                    }],
                ],
                entrepriseApi: {
                    association: {
                        siret: { a: 1, b: 2 },
                        rna: { a: 5, b: 6 }
                    },
                    entreprise: { a: 3, b: 4 },
                }
            })
        })

    });
});