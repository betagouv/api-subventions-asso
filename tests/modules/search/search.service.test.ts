import OsirisActionEntity from "../../../src/modules/osiris/entities/OsirisActionEntity";
import osirisService from "../../../src/modules/osiris/osiris.service";
import searchService from "../../../src/modules/search/search.service";
import RnaProvider from "../../../src/modules/search/providers/rna.provider";
import SiretProvider from "../../../src/modules/search/providers/siret.provider";
import OsirisRequestEntity from "../../../src/modules/osiris/entities/OsirisRequestEntity";

describe("SearchService", () => {
    const spys: jest.SpyInstance<unknown>[] = [];
    beforeAll(() => {
        spys.push(
            jest.spyOn(RnaProvider, "findByRna"),
            jest.spyOn(RnaProvider, "findBySiret"),
            jest.spyOn(SiretProvider, "findBySiret"),
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
            RnaProvider.findBySiret.mockImplementationOnce(() => null);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            RnaProvider.findByRna.mockImplementationOnce(() => null);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            SiretProvider.findBySiret.mockImplementationOnce(() => null);

            expect(await searchService.getBySiret("FAKE_SIRET")).toMatchObject({
                requests: [
                    {
                        legalInformations: { siret: "FAKE_SIRET", rna: "RNA", name: "NAME"},
                        actions: [action]
                    },
                ],
                siretAPI: null,
                rnaAPI: {
                    rna: null,
                    siret: null
                },
            })
        })

        it('should returns file contains actions', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            RnaProvider.findBySiret.mockImplementationOnce(() => ({ a: 1, b: 2 }));

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            RnaProvider.findByRna.mockImplementationOnce(() => ({ a: 5, b: 6 }));

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            SiretProvider.findBySiret.mockImplementationOnce(() => ({ a: 3, b: 4 }));

            expect(await searchService.getBySiret("FAKE_SIRET")).toMatchObject({
                requests: [
                    {
                        legalInformations: { siret: "FAKE_SIRET", rna: "RNA", name: "NAME"},
                        actions: [action]
                    },
                ],
                siretAPI: { a: 3, b: 4 },
                rnaAPI: {
                    siret: { a: 1, b: 2 },
                    rna: { a: 5, b: 6 }
                },
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
            RnaProvider.findBySiret.mockImplementationOnce(() => null);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            RnaProvider.findByRna.mockImplementationOnce(() => null);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            SiretProvider.findBySiret.mockImplementationOnce(() => null);

            expect(await searchService.getByRna("RNA")).toMatchObject({
                requests: [
                    {
                        legalInformations: { siret: "FAKE_SIRET", rna: "RNA", name: "NAME"},
                        actions: [action]
                    },
                ],
                siretAPI: null,
                rnaAPI: {
                    rna: null,
                    siret: null
                },
            })
        })

        it('should returns file contains actions', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            RnaProvider.findBySiret.mockImplementationOnce(() => ({ a: 1, b: 2 }));

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            RnaProvider.findByRna.mockImplementationOnce(() => ({ a: 5, b: 6 }));

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            SiretProvider.findBySiret.mockImplementationOnce(() => ({ a: 3, b: 4 }));

            expect(await searchService.getByRna("RNA")).toMatchObject({
                requests: [
                    {
                        legalInformations: { siret: "FAKE_SIRET", rna: "RNA", name: "NAME"},
                        actions: [action]
                    },
                ],
                siretAPI: { a: 3, b: 4 },
                rnaAPI: {
                    siret: { a: 1, b: 2 },
                    rna: { a: 5, b: 6 }
                },
            })
        })

    });
});