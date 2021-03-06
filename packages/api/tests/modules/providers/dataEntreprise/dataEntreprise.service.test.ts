import axios from "axios";
import dataEntrepriseService from "../../../../src/modules/providers/dataEntreprise/dataEntreprise.service";
import ProviderValueAdapter from "../../../../src/shared/adapters/ProviderValueAdapter";
import EventManager from '../../../../src/shared/EventManager';

describe("DataEntrepriseService", () => {
    const now = new Date();
    const toPVs = (value: unknown, provider = "TEST") => ProviderValueAdapter.toProviderValues(value, provider, now);
    const spyEventManager = jest.spyOn(EventManager, "call").mockImplementation((name, value) => Promise.resolve({name, value}));
    
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dataEntrepriseService.requestCache.destroy();
    })

    afterEach(() => {
        spyEventManager.mockClear();
    })

    describe("findAssociationByRna", () => {
        const RNA = "RNA";
        const SIRET = "SIRET";
        const LAST_UPDATE = now;
        const DATA = { association: {id_association: "ID_ASSO", siret: SIRET, titre: "TITRE", updated_at: LAST_UPDATE}}
        it("should called api", async () => {
            
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => (Promise.resolve({data: DATA})));

            const result = await dataEntrepriseService.findAssociationByRna(RNA);

            expect(mock).toHaveBeenCalled();
            expect(result).toMatchObject({
                rna: toPVs("ID_ASSO", "<Base RNA> EntrepriseData <https://entreprise.data.gouv.fr>")
            })
        });

        it("should return null if error", async () => {
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject("ERROR"));

            const result = await dataEntrepriseService.findAssociationByRna(RNA);

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(null)
        });
        it("should call EventManager ", async () => {
            // @ts-expect-error: Jest mock
            jest.spyOn(dataEntrepriseService, "sendRequest").mockImplementationOnce(async () => Promise.resolve(DATA));
            await dataEntrepriseService.findAssociationByRna(RNA);
            expect(spyEventManager).toHaveBeenCalledTimes(2);
            expect(spyEventManager).toHaveBeenNthCalledWith(1, "rna-siren.matching", [{ rna: RNA, siren: DATA.association.siret }]);
            expect(spyEventManager).toHaveBeenNthCalledWith(2, "association-name.matching", [{rna: RNA, siren:DATA.association.siret, name: DATA.association.titre, provider: dataEntrepriseService.provider.name, lastUpdate: DATA.association.updated_at}]);
        })
    });

    describe("findEtablissementBySiret", () => {
        const RNA = "RNA";
        const SIRET = "SIRET";
        const NAME = "NAME";
        const LAST_UPDATE = now;
        const DATA = { etablissement: {siret: SIRET, unite_legale: { identifiant_association: RNA, denomination: NAME }, updated_at: LAST_UPDATE }}
        
        it("should call the API", async () => {
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(async () => Promise.resolve({data: DATA}));
            const result = await dataEntrepriseService.findEtablissementBySiret(SIRET);
            expect(mock).toHaveBeenCalled();
            expect(result).toMatchObject({
                siret: toPVs(SIRET, "<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>")
            })
        });

        it("should return null if error", async () => {
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject("ERROR"));
            const result = await dataEntrepriseService.findEtablissementBySiret(SIRET);
            expect(mock).toHaveBeenCalled();
            expect(result).toBe(null)
        });
        it("should call EventManager ", async () => {
            // @ts-expect-error: Jest mock
            jest.spyOn(dataEntrepriseService, "sendRequest").mockImplementationOnce(async () => Promise.resolve(DATA));
            await dataEntrepriseService.findEtablissementBySiret(SIRET);
            expect(spyEventManager).toHaveBeenCalledTimes(2);
            expect(spyEventManager).toHaveBeenNthCalledWith(1, "rna-siren.matching", [{ rna: RNA, siren: SIRET }]);
            expect(spyEventManager).toHaveBeenNthCalledWith(2, "association-name.matching", [{rna: RNA, siren: SIRET, name: NAME, provider: dataEntrepriseService.provider.name, lastUpdate: LAST_UPDATE}]);
            spyEventManager
        })
    });

    describe("findAssociationBySiren", () => {
        const SIREN = "SIREN";
        const RNA = "RNA";
        const NAME = "NAME";
        const LAST_UPDATE = now;
        const DATA = { unite_legale: { updated_at: LAST_UPDATE, siren: SIREN, identifiant_association: RNA, denomination: NAME, etablissement_siege: {}, etablissements: [] }}
        it("should call the API", async () => {

            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => (Promise.resolve({data: DATA})));

            const result = await dataEntrepriseService.findAssociationBySiren(SIREN);

            expect(mock).toHaveBeenCalled();
            expect(result).toMatchObject(
                {
                    siren: toPVs(SIREN, "<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>")
                }
            )
        });

        it("should return null if error", async () => {
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject("ERROR"));

            const result = await dataEntrepriseService.findAssociationBySiren(SIREN);

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(null)
        });

        it("should call EventManager ", async () => {
            // @ts-expect-error: Jest mock
            jest.spyOn(dataEntrepriseService, "sendRequest").mockImplementationOnce(async () => Promise.resolve(DATA));
            await dataEntrepriseService.findAssociationBySiren(SIREN);
            expect(spyEventManager).toHaveBeenCalledTimes(2);
            expect(spyEventManager).toHaveBeenNthCalledWith(1, "rna-siren.matching", [{ rna: RNA, siren: SIREN }]);
            expect(spyEventManager).toHaveBeenNthCalledWith(2, "association-name.matching", [{rna: RNA, siren: SIREN, name: NAME, provider: dataEntrepriseService.provider.name, lastUpdate: LAST_UPDATE}]);
        })
    });

});