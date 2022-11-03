import searchService from "../../../src/modules/search/search.service";
import associationsService from "../../../src/modules/associations/associations.service";
import etablissementService from "../../../src/modules/etablissements/etablissements.service";
import subventionsService from '../subventions/subventions.service';
import { Association, DemandeSubvention } from '@api-subventions-asso/dto';
import versementsService from '../versements/versements.service';

const SIRET = "SIRET";
// @ts-expect-error: mock
const DEMANDES_SUBVENTIONS = [{ siret: SIRET }] as DemandeSubvention[];

describe("SearchService", () => {
    describe("getBySiret", () => {
        const getAssociationBySiretMock = jest.spyOn(associationsService, "getAssociationBySiret");
        const getEtablissementMock = jest.spyOn(etablissementService, "getEtablissement");
        const getDemandesByEtablissementMock = jest.spyOn(subventionsService, "getDemandesByEtablissement");
        const aggregateVersementsByEtablissementSearchMock = jest.spyOn(versementsService, "aggregateVersementsByEtablissementSearch");
        it('should returns file contains actions', async () => {
            const ASSOCIATION = {} as Association;
            const ETABLISSEMENT = { siret: SIRET };
            // @ts-expect-error: mock
            getEtablissementMock.mockImplementationOnce(async () => ETABLISSEMENT);
            getDemandesByEtablissementMock.mockImplementationOnce(async () => DEMANDES_SUBVENTIONS)
            getAssociationBySiretMock.mockImplementationOnce(async () => ASSOCIATION);
            aggregateVersementsByEtablissementSearchMock.mockImplementationOnce(async etablissement => etablissement)
            const expected = {
                ...ETABLISSEMENT,
                association: {},
                demandes_subventions: DEMANDES_SUBVENTIONS,
                versements: []
            };
            const actual = await searchService.getBySiret(SIRET);
            expect(actual).toEqual(expected);
        })

    });
});