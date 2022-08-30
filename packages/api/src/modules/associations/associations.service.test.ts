/* eslint-disable @typescript-eslint/no-explicit-any */
import { StructureIdentifiersEnum } from '../../@enums/StructureIdentifiersEnum';
import FormaterHelper from '../../shared/helpers/FormaterHelper';
import * as IdentifierHelper from '../../shared/helpers/IdentifierHelper';
import * as StringHelper from '../../shared/helpers/StringHelper';
import associationsService from "./associations.service";
import { Etablissement, Versement } from '@api-subventions-asso/dto';
import subventionService from '../subventions/subventions.service';
import * as providers from '../providers';
import etablissementService from '../etablissements/etablissements.service';
import rnaSirenService from '../open-data/rna-siren/rnaSiren.service';
import StructureIdentifiersError from '../../shared/errors/StructureIdentifierError';
import versementsService from '../versements/versements.service';
import documentsService from '../documents/documents.service';
import { Document } from '@api-subventions-asso/dto/search/Document';
import AssociationIdentifierError from '../../shared/errors/AssociationIdentifierError';
import Flux from '../../shared/Flux';
import { SubventionsFlux } from '../subventions/@types/SubventionsFlux';

jest.mock('../providers/index');

const DEFAULT_PROVIDERS = providers.default;

describe("AssociationService", () => {
    const RNA = "W000000001";
    const SIREN = "000000001";
    const SIRET = SIREN + "00001";
    const INVALID_IDENTIFIER = "Z0345";
    const getAssociationByRnaSpy = jest.spyOn(associationsService, "getAssociationByRna");
    const getAssociationBySirenSpy = jest.spyOn(associationsService, "getAssociationBySiren");
    const getAssociationBySiretSpy = jest.spyOn(associationsService, "getAssociationBySiret");
    const getIdentifierTypeMock = jest.spyOn(IdentifierHelper, "getIdentifierType");
    const getDemandesByAssociationMock = jest.spyOn(subventionService, "getDemandesByAssociation");
    const getVersementsByAssociationMock = jest.spyOn(versementsService, "getVersementsByAssociation");
    const getDocumentBySirenMock = jest.spyOn(documentsService, "getDocumentBySiren");
    const getDocumentByRnaMock = jest.spyOn(documentsService, "getDocumentByRna");
    const getEtablissementsBySirenMock = jest.spyOn(etablissementService, "getEtablissementsBySiren");
    const getEtablissementMock = jest.spyOn(etablissementService, "getEtablissement");
    const rnaSirenServiceGetSirenMock = jest.spyOn(rnaSirenService, "getSiren");
    // @ts-expect-error: mock private method
    const aggregateMock = jest.spyOn(associationsService, "aggregate");

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
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            await associationsService.getAssociation(RNA);
            expect(getAssociationByRnaSpy).toHaveBeenCalledWith(RNA);
        });
        it("should call getAssociationBySiren", async () => {
            getAssociationBySirenSpy.mockImplementationOnce((jest.fn()));
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            await associationsService.getAssociation(SIREN);
            expect(getAssociationBySirenSpy).toHaveBeenCalledWith(SIREN);
        });
        it("should call getAssociationBySiret", async () => {
            getAssociationBySiretSpy.mockImplementationOnce(jest.fn());
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siret);
            await associationsService.getAssociation(SIRET);
            expect(getAssociationBySiretSpy).toHaveBeenCalledWith(SIRET);
        });
        it("should throw a StructureIdentifierError when type is invalid", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => null);
            const expected = new StructureIdentifiersError();
            let actual;
            try {
                actual = await associationsService.getAssociation(INVALID_IDENTIFIER);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        })
    });

    describe("isAssociationsProvider()", () => {
        it("should return true", () => {
            const actual = associationsService.isAssociationsProvider({ isAssociationsProvider: true });
            expect(actual).toBeTruthy();
        })
        it("should return false", () => {
            const actual = associationsService.isAssociationsProvider({ isAssociationsProvider: false });
            expect(actual).toBeFalsy();
        })
    })

    describe("aggregate", () => {

        it('should throw StructureIdentifierError with invalid StructueIdentifier', async () => {
            const expected = new StructureIdentifiersError();
            let actual;
            try {
                // @ts-expect-error: unit test private method
                actual = await associationsService.aggregate(INVALID_IDENTIFIER);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });

        it("should call capitalizeFirstLetter()", () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            const capitalizeFirstLetterSpy = jest.spyOn(StringHelper, "capitalizeFirstLetter");
            // @ts-expect-error: mock
            associationsService.aggregate(RNA);
            expect(capitalizeFirstLetterSpy).toHaveBeenCalled();
        })
    })

    describe("getAssociationBySiren()", () => {
        it('should call aggregate', async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => []);
            await associationsService.getAssociationBySiren(SIREN);
            const actual = aggregateMock.mock.calls.length;
            expect(actual).toEqual(1);
        });
        it('should return null if aggregates return an empty array', async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => []);
            const expected = null;
            const actual = await associationsService.getAssociationBySiren(SIREN);
            expect(actual).toEqual(expected);
        });
        it("should call FormaterHelper.formatData()", async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => [{}]);
            const expected = 1;
            await associationsService.getAssociationBySiren(SIREN);
            const actual = formatDataMock.mock.calls.length;
            expect(actual).toEqual(expected);
        });
    })

    describe("getAssociationBySiret()", () => {
        it('should call aggregate', async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(async () => []);
            await associationsService.getAssociationBySiret(SIRET);
            const actual = aggregateMock.mock.calls.length;
            expect(actual).toEqual(1);
        });
        it('should return null if aggregates return an empty array', async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => []);
            const expected = null;
            const actual = await associationsService.getAssociationBySiret(SIRET);
            expect(actual).toEqual(expected);
        });
        it("should call FormaterHelper.formatData()", async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => [{}]);
            const expected = 1;
            await associationsService.getAssociationBySiret(SIRET);
            const actual = formatDataMock.mock.calls.length;
            expect(actual).toEqual(expected);
        });
    })

    describe("getAssociationByRna()", () => {
        it('should call aggregate', async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => []);
            rnaSirenServiceGetSirenMock.mockImplementationOnce(async () => null);
            await associationsService.getAssociationByRna(RNA);
            const actual = aggregateMock.mock.calls.length;
            expect(actual).toEqual(1);
        });
        it('should return null if aggregates return an empty array', async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => []);
            rnaSirenServiceGetSirenMock.mockImplementationOnce(async () => null);
            const expected = null;
            const actual = await associationsService.getAssociationByRna(RNA);
            expect(actual).toEqual(expected);
        });
        it("should call FormaterHelper.formatData()", async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => [{}]);
            rnaSirenServiceGetSirenMock.mockImplementationOnce(async () => null);
            const expected = 1;
            await associationsService.getAssociationByRna(RNA);
            const actual = formatDataMock.mock.calls.length;
            expect(actual).toEqual(expected);
        });
    })

    describe("getSubventions()", () => {
        it("should call DemandeSubventionService.getByAssociation()", async () => {
            getDemandesByAssociationMock.mockImplementationOnce(async () => new Flux<SubventionsFlux>());
            await associationsService.getSubventions(SIREN);
            expect(getDemandesByAssociationMock).toHaveBeenCalledWith(SIREN);
        })
    })

    describe("getVersements()", () => {
        it("should call DemandeSubventionService.getByAssociation()", async () => {
            getVersementsByAssociationMock.mockImplementationOnce(() => Promise.resolve([{}] as Versement[]));
            await associationsService.getVersements(SIREN);
            expect(getVersementsByAssociationMock).toHaveBeenCalledWith(SIREN);
        })
    })

    describe("getDocuments()", () => {
        it("should call documentService.getDocumentBySiren()", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            getDocumentBySirenMock.mockImplementationOnce(() => Promise.resolve([{}] as Document[]));
            await associationsService.getDocuments(SIREN);
            expect(getDocumentBySirenMock).toHaveBeenCalledWith(SIREN);
        })

        it("should call documentService.getDocumentByRna()", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            getDocumentByRnaMock.mockImplementationOnce(() => Promise.resolve([{}] as Document[]));
            await associationsService.getDocuments(RNA);
            expect(getDocumentByRnaMock).toHaveBeenCalledWith(RNA);
        })

        it("should throw error because id is not rna or siren", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => null);

            expect(() => associationsService.getDocuments(RNA)).rejects.toThrowError(AssociationIdentifierError);
        })
    })

    describe("getEtablissements()", () => {
        it("should call etablissementService.getEtablissementsBySiren()", async () => {
            getEtablissementsBySirenMock.mockImplementationOnce(() => Promise.resolve([{ etablissement: true } as unknown as Etablissement]));
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            await associationsService.getEtablissements(SIRET);
            expect(getEtablissementsBySirenMock).toHaveBeenCalledWith(SIRET);
        })

        it("should call search siren match with rna", async () => {
            const expected = SIREN;
            getEtablissementsBySirenMock.mockImplementationOnce(async () => []);
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            rnaSirenServiceGetSirenMock.mockImplementationOnce(() => Promise.resolve(expected));
            await associationsService.getEtablissements(RNA);
            expect(getEtablissementsBySirenMock).toHaveBeenCalledWith(expected);
        })

        it("should return empty array (siren not matching with rna)", async () => {
            const expected = 0;
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            rnaSirenServiceGetSirenMock.mockImplementationOnce(() => Promise.resolve(null));
            const actual = await associationsService.getEtablissements(RNA);
            expect(actual).toHaveLength(expected);
        })

        it("should return empty array (EtablissementService return null)", async () => {
            const expected = 0;

            getEtablissementsBySirenMock.mockImplementationOnce(() => Promise.resolve(null));
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            const actual = await associationsService.getEtablissements(SIRET);
            expect(actual).toHaveLength(expected);
        })

        it("should throw error (identifiers type not accepted)", async () => {
            const expected = "You must provide a valid SIREN or RNA";
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siret);
            let actual;
            try {
                actual = await associationsService.getEtablissements(SIRET)
            } catch (e) {
                actual = (e as Error).message;
            }
            expect(actual).toEqual(expected)
        })

        it("should throw error (identifiers type not fund)", async () => {
            const expected = "You must provide a valid SIREN or RNA";
            getIdentifierTypeMock.mockImplementationOnce(() => null);
            let actual;
            try {
                actual = await associationsService.getEtablissements(INVALID_IDENTIFIER)
            } catch (e) {
                actual = (e as Error).message;
            }
            expect(actual).toEqual(expected)
        })
    })

    describe("getEtablissement()", () => {
        const NIC = "00032"
        it("should call etablissementService.getEtablissement()", async () => {
            getEtablissementMock.mockImplementationOnce(() => Promise.resolve({ etablissement: true } as unknown as Etablissement));
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            await associationsService.getEtablissement(SIREN, NIC);
            expect(getEtablissementMock).toHaveBeenCalledWith(SIREN + NIC);
        })

        it("should call search siren match with rna", async () => {
            const expected = SIREN;
            getEtablissementMock.mockImplementationOnce(() => Promise.resolve({ etablissement: true } as unknown as Etablissement));
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            rnaSirenServiceGetSirenMock.mockImplementationOnce(() => Promise.resolve(expected));
            await associationsService.getEtablissement(SIREN, NIC);
            expect(getEtablissementMock).toHaveBeenCalledWith(expected + NIC);
        })


        it("should throw error not found error (siren not matching with rna)", async () => {
            const expected = `We haven't found a corresponding SIREN to the given RNA ${SIREN}`

            rnaSirenServiceGetSirenMock.mockImplementationOnce(() => Promise.resolve(null));
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            let actual;
            try {
                actual = await associationsService.getEtablissement(SIREN, NIC);
            } catch (e) {
                actual = (e as Error).message
            }
            expect(actual).toEqual(expected);
        })

        it("should throw error not found error (EtablissementService return null)", async () => {
            const expected = "Etablissement not found"

            getEtablissementMock.mockImplementationOnce(() => Promise.resolve(null));
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            let actual;
            try {
                actual = await associationsService.getEtablissement(SIREN, NIC);
            } catch (e) {
                actual = (e as Error).message
            }
            expect(actual).toEqual(expected);
        })

        it("should throw error (identifiers type not accepted)", async () => {
            const expected = "You must provide a valid SIREN or RNA";
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siret);
            let actual;
            try {
                actual = await associationsService.getEtablissement(SIREN, NIC);
            } catch (e) {
                actual = (e as Error).message
            }
            expect(actual).toEqual(expected);
        })

        it("should throw error (identifiers type not found)", async () => {
            const expected = "You must provide a valid SIREN or RNA";
            getIdentifierTypeMock.mockImplementationOnce(() => null);
            let actual;
            try {
                actual = await associationsService.getEtablissement(SIREN, NIC);
            } catch (e) {
                actual = (e as Error).message
            }
            expect(actual).toEqual(expected);
        })
    })
});