/* eslint-disable @typescript-eslint/no-explicit-any */
import { StructureIdentifiersEnum } from '../../@enums/StructureIdentifiersEnum';
import FormaterHelper from '../../shared/helpers/FormaterHelper';
import * as IdentifierHelper from '../../shared/helpers/IdentifierHelper';
import associationsService from "./associations.service";
import { DemandeSubvention } from '@api-subventions-asso/dto';
import subventionService from '../subventions/subventions.service';
import * as providers from '../providers';
import etablissementService from '../etablissements/etablissements.service';
import rnaSirenService from '../open-data/rna-siren/rnaSiren.service';

jest.mock('../providers/index');

const DEFAULT_PROVIDERS = providers.default;

describe("AssociationService", () => {
    const IDENTIFIER = "IDENTIFIER";
    const getAssociationByRnaSpy = jest.spyOn(associationsService, "getAssociationByRna");
    const getAssociationBySirenSpy = jest.spyOn(associationsService, "getAssociationBySiren");
    const getAssociationBySiretSpy = jest.spyOn(associationsService, "getAssociationBySiret");
    const getIdentifierTypeSpy = jest.spyOn(IdentifierHelper, "getIdentifierType");
    const getByAssociationMock = jest.spyOn(subventionService, "getDemandesByAssociation");
    const getEtablissementsBySirenMock = jest.spyOn(etablissementService, "getEtablissementsBySiren");
    const rnaSirenServiceGetSirenMock = jest.spyOn(rnaSirenService, "getSiren");
    
    let formatDataMock: jest.SpyInstance;
    beforeAll(() => {
        formatDataMock = jest.spyOn(FormaterHelper, "formatData").mockImplementation(data => data as any);
    })

    afterAll(() => {
        formatDataMock.mockRestore();
    })

    // Could not find a way to restore manual mock (from __mocks__) after being changed in a single test (cf: getAssociationBySiren)
    // @ts-expect-error: mock
    // eslint-disable-next-line import/namespace
    afterEach(() => providers.default = DEFAULT_PROVIDERS)
    
    describe("getAssociation()", () => {
        it("should call getAssociationByRna", async () => {
            getAssociationByRnaSpy.mockImplementationOnce(jest.fn());
            getIdentifierTypeSpy.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            await associationsService.getAssociation(IDENTIFIER);
            expect(getAssociationByRnaSpy).toHaveBeenCalledWith(IDENTIFIER);
        });
        it("should call getAssociationBySiren", async () => {
            getAssociationBySirenSpy.mockImplementationOnce(jest.fn());
            getIdentifierTypeSpy.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            await associationsService.getAssociation(IDENTIFIER);
            expect(getAssociationBySirenSpy).toHaveBeenCalledWith(IDENTIFIER);
        });
        it("should call getAssociationBySiret", async () => {
            getAssociationBySiretSpy.mockImplementationOnce(jest.fn());
            getIdentifierTypeSpy.mockImplementationOnce(() => StructureIdentifiersEnum.siret);
            await associationsService.getAssociation(IDENTIFIER);
            expect(getAssociationBySiretSpy).toHaveBeenCalledWith(IDENTIFIER);
        });
        it("should throw an error when type is invalid", async () => {
            getIdentifierTypeSpy.mockImplementationOnce(() => null);
            try {
                await associationsService.getAssociation(IDENTIFIER);
            } catch (e: any) {
                const expected = "You must give a valid RNA, SIREN or SIRET number."
                const actual = e.message;
                expect(actual).toEqual(expected);
            }
        })
    });
    
    describe("isAssociationsProvider()", () => {
        it("should return true", () => {
            const actual = associationsService.isAssociationsProvider({ isAssociationsProvider: true });
            expect(actual).toBeTruthy();
        }),
        it("should return true", () => {
            const actual = associationsService.isAssociationsProvider({ isAssociationsProvider: false });
            expect(actual).toBeFalsy();
        })
    })
    
    describe("getAssociationBySiren()", () => {
        it('should return null', async () => {
            // @ts-expect-error: mock
            // eslint-disable-next-line import/namespace
            providers.default =  { "A": { getAssociationsBySiren: () => null }, "B": { getAssociationsBySiren: () => null } };
            const actual = await associationsService.getAssociationBySiren(IDENTIFIER);
            const expected = null;
            expect(actual).toBe(expected);
        });

        it('should return associations and filter null', async () => {
            const actual = await associationsService.getAssociationBySiren(IDENTIFIER);
            expect(actual).toHaveLength(2);
        });
    })

    describe("getAssociationBySiret()", () => {
        it('should return null', async () => {
            // @ts-expect-error: mock
            // eslint-disable-next-line import/namespace
            providers.default =  { "A": { getAssociationsBySiret: () => null }, "B": { getAssociationsBySiret: () => null } };
            const actual = await associationsService.getAssociationBySiret(IDENTIFIER);
            const expected = null;
            expect(actual).toBe(expected);
        });

        it('should return association data', async () => {
            const actual = await associationsService.getAssociationBySiret(IDENTIFIER);
            expect(actual).toHaveLength(2);
        });
    })

    describe("getAssociationByRna()", () => {
        it('should return null', async () => {
            // @ts-expect-error: mock
            // eslint-disable-next-line import/namespace
            providers.default =  { "A": { getAssociationsByRna: () => null }, "B": { getAssociationsByRna: () => null } };
            const actual = await associationsService.getAssociationByRna(IDENTIFIER);
            const expected = null;
            expect(actual).toBe(expected);
        });

        it('should return association data', async () => {
            const actual = await associationsService.getAssociationByRna(IDENTIFIER);
            expect(actual).toHaveLength(2);
        });
    })

    describe("getSubventions()", () => {
        it("should call DemandeSubventionService.getByAssociation()", async () => {
            getByAssociationMock.mockImplementationOnce(() => Promise.resolve([{}] as DemandeSubvention[]));
            await associationsService.getSubventions(IDENTIFIER);
            expect(getByAssociationMock).toHaveBeenCalledWith(IDENTIFIER);
        })
    })


    describe("getEtablissements()", () => {
        it("should call etablissementService.getEtablissementsBySiren()", async () => {
            getEtablissementsBySirenMock.mockImplementationOnce(() => Promise.resolve([]));
            getIdentifierTypeSpy.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            await associationsService.getEtablissements(IDENTIFIER);
            expect(getEtablissementsBySirenMock).toHaveBeenCalledWith(IDENTIFIER);
        })

        it("should call search siren match with rna", async () => {
            const expected = "SIREN";
            getEtablissementsBySirenMock.mockImplementationOnce(() => Promise.resolve([]));
            getIdentifierTypeSpy.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            rnaSirenServiceGetSirenMock.mockImplementationOnce(() => Promise.resolve(expected));
            await associationsService.getEtablissements(IDENTIFIER);
            expect(getEtablissementsBySirenMock).toHaveBeenCalledWith(expected);
        })

        it("should return empty array (siren not matching with rna)", async () => {
            const expected = 0;
            getEtablissementsBySirenMock.mockImplementationOnce(() => Promise.resolve([]));
            getIdentifierTypeSpy.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            rnaSirenServiceGetSirenMock.mockImplementationOnce(() => Promise.resolve(null));
            const actual = await associationsService.getEtablissements(IDENTIFIER);
            expect(actual).toHaveLength(expected);
        })

        it("should return empty array (EtablissementService return null)", async () => {
            const expected = 0;
            getEtablissementsBySirenMock.mockImplementationOnce(() => Promise.resolve(null));
            getIdentifierTypeSpy.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            const actual = await associationsService.getEtablissements(IDENTIFIER);
            expect(actual).toHaveLength(expected);
        })

        it("should throw error (identifiers type not accepted)", async () => {
            const expected = "You must provide a valid SIREN or RNA";
            getIdentifierTypeSpy.mockImplementationOnce(() => StructureIdentifiersEnum.siret);
            expect(associationsService.getEtablissements(IDENTIFIER)).rejects.toThrowError(expected)
        })

        it("should throw error (identifiers type not fund)", async () => {
            const expected = "You must provide a valid SIREN or RNA";
            getIdentifierTypeSpy.mockImplementationOnce(() => null);
            expect(associationsService.getEtablissements(IDENTIFIER)).rejects.toThrowError(expected)
        })
    })
});