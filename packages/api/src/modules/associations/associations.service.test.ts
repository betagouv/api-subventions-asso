/* eslint-disable @typescript-eslint/no-explicit-any */
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import FormaterHelper from "../../shared/helpers/FormaterHelper";
import * as IdentifierHelper from "../../shared/helpers/IdentifierHelper";
import * as StringHelper from "../../shared/helpers/StringHelper";
import associationsService from "./associations.service";
import { Etablissement, Payment, DocumentDto } from "dto";
import subventionService from "../subventions/subventions.service";
import * as providers from "../providers";
import etablissementService from "../etablissements/etablissements.service";
import StructureIdentifiersError from "../../shared/errors/StructureIdentifierError";
import paymentService from "../payments/payments.service";
import documentsService from "../documents/documents.service";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import Flux from "../../shared/Flux";
import { SubventionsFlux } from "../subventions/@types/SubventionsFlux";
import { NotFoundError } from "../../shared/errors/httpErrors";
import mocked = jest.mocked;
import apiAssoService from "../providers/apiAsso/apiAsso.service";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import RnaSirenEntity from "../../entities/RnaSirenEntity";
import uniteLegalEntreprisesService from "../providers/uniteLegalEntreprises/uniteLegal.entreprises.service";

jest.mock("../providers/index");

jest.mock("../providers/apiAsso/apiAsso.service");
jest.mock("../rna-siren/rnaSiren.service");
jest.mock("../providers/uniteLegalEntreprises/uniteLegal.entreprises.service");
jest.mock("../../shared/LegalCategoriesAccepted", () => ({ LEGAL_CATEGORIES_ACCEPTED: "asso" }));

const DEFAULT_PROVIDERS = providers.default;

describe("associationsService", () => {
    const RNA = "W000000001";
    const SIREN = "100000001";
    const SIRET = SIREN + "00001";
    const INVALID_IDENTIFIER = "Z0345";
    const getAssociationByRnaSpy = jest.spyOn(associationsService, "getAssociationByRna");
    const getAssociationBySirenSpy = jest.spyOn(associationsService, "getAssociationBySiren");
    const getAssociationBySiretSpy = jest.spyOn(associationsService, "getAssociationBySiret");
    const getIdentifierTypeMock = jest.spyOn(IdentifierHelper, "getIdentifierType");
    const getDemandesByAssociationMock = jest.spyOn(subventionService, "getDemandesByAssociation");
    const getPaymentsByAssociationMock = jest.spyOn(paymentService, "getPaymentsByAssociation");
    const getDocumentBySirenMock = jest.spyOn(documentsService, "getDocumentBySiren");
    const getDocumentByRnaMock = jest.spyOn(documentsService, "getDocumentByRna");
    const getEtablissementsBySirenMock = jest.spyOn(etablissementService, "getEtablissementsBySiren");
    const getEtablissementMock = jest.spyOn(etablissementService, "getEtablissement");
    const rnaSirenServiceFindOne = jest.spyOn(rnaSirenService, "find");
    // @ts-expect-error: mock private method
    const aggregateMock = jest.spyOn(associationsService, "aggregate");

    let formatDataMock: jest.SpyInstance;
    beforeAll(() => {
        formatDataMock = jest.spyOn(FormaterHelper, "formatData").mockImplementation(data => data as any);
    });

    afterAll(() => {
        formatDataMock.mockRestore();
    });

    // Could not find a way to restore manual mock (from __mocks__) after being changed in a single test (cf: getAssociationBySiren)
    // @ts-expect-error: mock
    // eslint-disable-next-line import/namespace
    afterEach(() => (providers.default = DEFAULT_PROVIDERS));

    describe("getAssociation()", () => {
        it("should call getAssociationByRna", async () => {
            getAssociationByRnaSpy.mockImplementationOnce(jest.fn());
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            await associationsService.getAssociation(RNA);
            expect(getAssociationByRnaSpy).toHaveBeenCalledWith(RNA);
        });
        it("should call getAssociationBySiren", async () => {
            getAssociationBySirenSpy.mockImplementationOnce(jest.fn());
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
        });
    });

    describe("isAssociationsProvider()", () => {
        it("should return true", () => {
            const actual = associationsService.isAssociationsProvider({
                isAssociationsProvider: true,
            });
            expect(actual).toBeTruthy();
        });
        it("should return false", () => {
            const actual = associationsService.isAssociationsProvider({
                isAssociationsProvider: false,
            });
            expect(actual).toBeFalsy();
        });
    });

    describe("aggregate", () => {
        it("should throw StructureIdentifierError with invalid StructueIdentifier", async () => {
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
        });
    });

    describe("getAssociationBySiren()", () => {
        it("should call aggregate", async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(async () => [{}]);
            await associationsService.getAssociationBySiren(SIREN);
            const actual = aggregateMock.mock.calls.length;
            expect(actual).toEqual(1);
        });
        it("should throw not found error if aggregates return an empty array", async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => []);
            expect(() => associationsService.getAssociationBySiren(SIREN)).rejects.toThrowError(
                new NotFoundError("Association not found"),
            );
        });
        it("should call FormaterHelper.formatData()", async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => [{}]);
            const expected = 1;
            await associationsService.getAssociationBySiren(SIREN);
            const actual = formatDataMock.mock.calls.length;
            expect(actual).toEqual(expected);
        });
    });

    describe("getAssociationBySiret()", () => {
        it("should call aggregate", async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(async () => [{}]);
            await associationsService.getAssociationBySiret(SIRET);
            const actual = aggregateMock.mock.calls.length;
            expect(actual).toEqual(1);
        });
        it("should throw not found error if aggregates return an empty array", async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => []);
            expect(() => associationsService.getAssociationBySiret(SIRET)).rejects.toThrowError(
                new NotFoundError("Association not found"),
            );
        });
        it("should call FormaterHelper.formatData()", async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => [{}]);
            const expected = 1;
            await associationsService.getAssociationBySiret(SIRET);
            const actual = formatDataMock.mock.calls.length;
            expect(actual).toEqual(expected);
        });
    });

    describe("getAssociationByRna()", () => {
        it("should call aggregate", async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => [{}]);
            rnaSirenServiceFindOne.mockImplementationOnce(async () => null);
            await associationsService.getAssociationByRna(RNA);
            const actual = aggregateMock.mock.calls.length;
            expect(actual).toEqual(1);
        });
        it("should throw not found error if aggregates return an empty array", async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => []);
            rnaSirenServiceFindOne.mockImplementationOnce(async () => null);
            expect(() => associationsService.getAssociationByRna(RNA)).rejects.toThrowError(
                new NotFoundError("Association not found"),
            );
        });
        it("should call FormaterHelper.formatData()", async () => {
            // @ts-expect-error: mock
            aggregateMock.mockImplementationOnce(() => [{}]);
            rnaSirenServiceFindOne.mockImplementationOnce(async () => null);
            const expected = 1;
            await associationsService.getAssociationByRna(RNA);
            const actual = formatDataMock.mock.calls.length;
            expect(actual).toEqual(expected);
        });
    });

    describe("getSubventions()", () => {
        it("should call DemandeSubventionService.getByAssociation()", async () => {
            getDemandesByAssociationMock.mockImplementationOnce(async () => new Flux<SubventionsFlux>());
            await associationsService.getSubventions(SIREN);
            expect(getDemandesByAssociationMock).toHaveBeenCalledWith(SIREN);
        });
    });

    describe("getPayments()", () => {
        it("should call DemandeSubventionService.getByAssociation()", async () => {
            getPaymentsByAssociationMock.mockImplementationOnce(() => Promise.resolve([{}] as Payment[]));
            await associationsService.getPayments(SIREN);
            expect(getPaymentsByAssociationMock).toHaveBeenCalledWith(SIREN);
        });
    });

    describe("getDocuments()", () => {
        it("should call documentService.getDocumentBySiren()", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            getDocumentBySirenMock.mockImplementationOnce(() => Promise.resolve([{}] as DocumentDto[]));
            await associationsService.getDocuments(SIREN);
            expect(getDocumentBySirenMock).toHaveBeenCalledWith(SIREN);
        });

        it("should call documentService.getDocumentByRna()", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            getDocumentByRnaMock.mockImplementationOnce(() => Promise.resolve([{}] as DocumentDto[]));
            await associationsService.getDocuments(RNA);
            expect(getDocumentByRnaMock).toHaveBeenCalledWith(RNA);
        });

        it("should throw error because id is not rna or siren", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => null);

            expect(() => associationsService.getDocuments(RNA)).rejects.toThrowError(AssociationIdentifierError);
        });
    });

    describe("getEstablishments()", () => {
        it("should call etablissementService.getEtablissementsBySiren()", async () => {
            getEtablissementsBySirenMock.mockImplementationOnce(() =>
                Promise.resolve([{ etablissement: true } as unknown as Etablissement]),
            );
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            await associationsService.getEstablishments(SIRET);
            expect(getEtablissementsBySirenMock).toHaveBeenCalledWith(SIRET);
        });

        it("should call search siren match with rna", async () => {
            const expected = SIREN;
            getEtablissementsBySirenMock.mockImplementationOnce(async () => []);
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            rnaSirenServiceFindOne.mockImplementationOnce(() => Promise.resolve([new RnaSirenEntity(RNA, SIREN)]));
            await associationsService.getEstablishments(RNA);
            expect(getEtablissementsBySirenMock).toHaveBeenCalledWith(expected);
        });

        it("should return empty array (siren not matching with rna)", async () => {
            const expected = 0;
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            rnaSirenServiceFindOne.mockImplementationOnce(() => Promise.resolve(null));
            const actual = await associationsService.getEstablishments(RNA);
            expect(actual).toHaveLength(expected);
        });

        it("should throw NotFoundError", async () => {
            getEtablissementsBySirenMock.mockImplementationOnce(() => {
                throw new NotFoundError();
            });
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            expect(() => associationsService.getEstablishments(SIRET)).rejects.toThrowError(NotFoundError);
        });

        it("should throw error (identifiers type not accepted)", async () => {
            const expected = "You must provide a valid SIREN or RNA";
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siret);
            let actual;
            try {
                actual = await associationsService.getEstablishments(SIRET);
            } catch (e) {
                actual = (e as Error).message;
            }
            expect(actual).toEqual(expected);
        });

        it("should throw error (identifiers type not fund)", async () => {
            const expected = "You must provide a valid SIREN or RNA";
            getIdentifierTypeMock.mockImplementationOnce(() => null);
            let actual;
            try {
                actual = await associationsService.getEstablishments(INVALID_IDENTIFIER);
            } catch (e) {
                actual = (e as Error).message;
            }
            expect(actual).toEqual(expected);
        });
    });

    describe("isSirenFromAsso", () => {
        const SIREN = "123456789";

        beforeAll(() => {
            mocked(uniteLegalEntreprisesService.isEntreprise).mockResolvedValue(false);
            mocked(rnaSirenService.find).mockResolvedValue(null);
            mocked(apiAssoService.findAssociationBySiren).mockResolvedValue({
                // @ts-expect-error: mock
                categorie_juridique: [{ value: "not asso" }],
            });
        });

        afterAll(() => {
            mocked(uniteLegalEntreprisesService.isEntreprise).mockRestore();
            mocked(rnaSirenService.find).mockRestore();
            mocked(apiAssoService.findAssociationBySiren).mockRestore();
        });

        it("returns false if found by data gouv service as not an association", async () => {
            mocked(uniteLegalEntreprisesService.isEntreprise).mockResolvedValueOnce(true);
            const expected = false;
            const actual = await associationsService.isSirenFromAsso(SIREN);
            expect(actual).toBe(expected);
        });

        it("returns true if found related rna", async () => {
            mocked(rnaSirenService.find).mockResolvedValueOnce([new RnaSirenEntity("RNA", "SIREN")]);
            const expected = true;
            const actual = await associationsService.isSirenFromAsso(SIREN);
            expect(actual).toBe(expected);
        });

        it("returns false if no structure found by apiAssoService", async () => {
            mocked(apiAssoService.findAssociationBySiren).mockResolvedValueOnce(null);
            const expected = false;
            const actual = await associationsService.isSirenFromAsso(SIREN);
            expect(actual).toBe(expected);
        });

        it("returns false if structure found by apiAssoService has no categorie_juridique", async () => {
            mocked(apiAssoService.findAssociationBySiren).mockResolvedValueOnce({});
            const expected = false;
            const actual = await associationsService.isSirenFromAsso(SIREN);
            expect(actual).toBe(expected);
        });

        it("returns false if structure found by apiAssoService has incorrect categories_juridique", async () => {
            // standard mocks
            const expected = false;
            const actual = await associationsService.isSirenFromAsso(SIREN);
            expect(actual).toBe(expected);
        });
    });

    describe("validateIdentifierFromAsso()", () => {
        const ID = "identifier";
        const ID_TYPE = StructureIdentifiersEnum.siret;
        const isIdentifierFromAssoSpy = jest.spyOn(associationsService, "isSirenFromAsso");

        beforeAll(() => {
            isIdentifierFromAssoSpy.mockResolvedValue(true);
        });

        it("returns true if structure found by apiAssoService has accepted categories_juridique", async () => {
            mocked(apiAssoService.findAssociationBySiren).mockResolvedValueOnce({
                // @ts-expect-error mock
                categorie_juridique: [{ value: "asso" }],
            });
            const expected = true;
            const actual = await associationsService.isSirenFromAsso(SIREN);
            expect(actual).toBe(expected);
        });
    });
});
