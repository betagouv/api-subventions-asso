import subventiaService from "../providers/subventia/subventia.service";
import subventionsService from "../subventions/subventions.service";
import versementsService from "../versements/versements.service";
import etablissementService from "./etablissements.service";

describe("EtablissementsService", () => {
    describe("getVersements", () => {
        const getVersementsBySiretMock = jest.spyOn(versementsService, "getVersementsBySiret");
        const SIRET = '000000000000000';

        it('should call versement service', async () => {
            getVersementsBySiretMock.mockImplementation(async () => []);

            await etablissementService.getVersements(SIRET);

            expect(getVersementsBySiretMock).toHaveBeenCalledWith(SIRET);
        })
    });

    describe("getSubventions", () => {
        const getDemandesByEtablissementMock = jest.spyOn(subventionsService, "getDemandesByEtablissement");
        const SIRET = '000000000000000';

        it('should call subventions service', async () => {
            getDemandesByEtablissementMock.mockImplementation(async () => []);

            await etablissementService.getSubventions(SIRET);

            expect(getDemandesByEtablissementMock).toHaveBeenCalledWith(SIRET);
        })
    });
})