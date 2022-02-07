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
            jest.spyOn(entrepriseApiSerivce, "findAssociationBySiren"),
            jest.spyOn(osirisService, "findBySiret"),
            jest.spyOn(osirisService, "findByRna"),
        )
    });

    afterAll(() => {
        spys.forEach(spy => spy.mockReset());
    });

    describe("getBySiret", () => {

        const request = new OsirisRequestEntity({ siret: "FAKE_SIRET", rna: "RNA", name: "NAME"}, { osirisId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID", ej: "", amountAwarded: 0, dateCommission: new Date()}, {}, undefined, []);
        const action =  new OsirisActionEntity({ osirisActionId: "OSIRISID", compteAssoId: "COMPTEASSOID"}, {}, undefined);
        beforeEach(async () => {
            await osirisService.addRequest(request);
            await osirisService.addAction(action);
        });

        it('should returns file contains actions', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findRnaDataBySiret.mockImplementationOnce(() => ({ a: 1, b: 2 }));

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findAssociationBySiren.mockImplementationOnce(() => ({ unite_legale: { 
                d: 12,
                c: 14,
                etablissements: [{
                    siret: "FAKE_SIRET"
                }]
            }}));

            expect(await searchService.getBySiret("FAKE_SIRET")).toMatchObject({
                siret: "FAKE_SIRET",
                demandes_subventions: [
                    {
                        budgetLines: [],
                        indexedData: { siret: "FAKE_SIRET", rna: "RNA", name: "NAME"},
                        details: [{
                            legalInformations: { siret: "FAKE_SIRET", rna: "RNA", name: "NAME"},
                            actions: [action]
                        }]
                    },
                ],
                association: {
                    d: 12,
                    c: 14,
                    etablissements: [{
                        siret: "FAKE_SIRET"
                    }]
                },
            })
        })

    });

    describe("getByRna", () => {

        const request = new OsirisRequestEntity({ siret: "FAKE_SIRET", rna: "RNA", name: "NAME"}, { osirisId: "FAKE_ID_2", compteAssoId: "COMPTEASSOID", ej: "", amountAwarded: 0, dateCommission: new Date()}, {}, undefined, []);
        const action =  new OsirisActionEntity({ osirisActionId: "OSIRISID", compteAssoId: "COMPTEASSOID"}, {}, undefined);
        beforeEach(async () => {
            await osirisService.addRequest(request);
            await osirisService.addAction(action);
        });

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
            
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            entrepriseApiSerivce.findAssociationBySiren.mockImplementationOnce(() => ({ unite_legale: { 
                d: 12,
                c: 14,
                etablissements: [{
                    siret: "FAKE_SIRET"
                }]
            }}));


            expect(await searchService.getByRna("RNA")).toMatchObject({
                d: 12,
                c: 14,
                etablissements: [{
                    siret: "FAKE_SIRET",
                    demandes_subventions: [
                        {
                            budgetLines: [],
                            indexedData: { siret: "FAKE_SIRET", rna: "RNA", name: "NAME"},
                            details: [{
                                legalInformations: { siret: "FAKE_SIRET", rna: "RNA", name: "NAME"},
                                actions: [action]
                            }]
                        },
                    ]
                }],
            })
        })
    });
});