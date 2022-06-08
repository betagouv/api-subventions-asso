import searchService from "../../../src/modules/search/search.service";
import associationsService from "../../../src/modules/associations/associations.service";
import etablissementService from "../../../src/modules/etablissements/etablissements.service";
import subventionsService from '../subventions/subventions.service';
import { Association, DemandeSubvention, Etablissement } from '@api-subventions-asso/dto';
import versementsService from '../versements/versements.service';
import rnaSirenService from '../open-data/rna-siren/rnaSiren.service';

const SIRET = "SIRET";
const SIREN = "SIREN";
const RNA = "RNA";
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

    describe("getByRna", () => {
        const getSirenMock = jest.spyOn(rnaSirenService, "getSiren");
        const getAssociationByRnaMock = jest.spyOn(associationsService, "getAssociationByRna");
        it('should returns file contains actions', async () => {
            // @ts-expect-error: mock
            getAssociationByRnaMock.mockImplementationOnce(async () => ({ rna: RNA }));
            getSirenMock.mockImplementationOnce(jest.fn());

            const expected = { rna: RNA, etablissements: [] };
            const actual = await searchService.getByRna(RNA);
            expect(actual).toEqual(expected);
        });
    });

    describe("getBySiren", () => {
        const getAssociationBySirenMock = jest.spyOn(associationsService, "getAssociationBySiren");
        const getEtablissementsBySirenMock = jest.spyOn(etablissementService, "getEtablissementsBySiren");
        const getDemandesByAssociationMock = jest.spyOn(subventionsService, "getDemandesByAssociation");
        const aggregateVersementsByAssoSearchMock = jest.spyOn(versementsService, "aggregateVersementsByAssoSearch");
        it('should returns file contains actions', async () => {
            const ETABLISSEMENTS = [{ siret: SIRET, demandes_subventions: DEMANDES_SUBVENTIONS, versements: [] }];
            // @ts-expect-error: mock
            getEtablissementsBySirenMock.mockImplementationOnce(() => (ETABLISSEMENTS));
            // @ts-expect-error: mock
            getAssociationBySirenMock.mockImplementationOnce(() => ({ siren: SIREN }));
            getDemandesByAssociationMock.mockImplementationOnce(async () => DEMANDES_SUBVENTIONS);
            aggregateVersementsByAssoSearchMock.mockImplementationOnce(async association => association);

            const expected = {
                siren: SIREN,
                etablissements: ETABLISSEMENTS,
                versements: []
            };
            const actual = await searchService.getBySiren(SIREN);
            expect(actual).toEqual(expected);
        })
    });
});