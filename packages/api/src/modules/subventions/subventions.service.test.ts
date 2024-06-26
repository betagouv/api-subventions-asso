import subventionsService from "./subventions.service";
import * as IdentifierHelper from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import * as providers from "../providers";
jest.mock("../providers/index");
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import StructureIdentifiersError from "../../shared/errors/StructureIdentifierError";
jest.mock("../rna-siren/rnaSiren.service");

const DEMANDES_SUBVENTIONS_PROVIDERS = providers.demandesSubventionsProviders;

const getIdentifierTypeMock = jest.spyOn(IdentifierHelper, "getIdentifierType");

const IDENTIFIER = "IDENTIFIER";

describe("SubventionsService", () => {
    afterEach(() => {
        // @ts-expect-error: mock
        // eslint-disable-next-line import/namespace
        providers.demandesSubventionsProviders = DEMANDES_SUBVENTIONS_PROVIDERS;
    });

    describe("getDemandesByAssociation()", () => {
        let mockGetApplicationFetcher;
        const spy = jest.fn();

        beforeAll(() => {
            mockGetApplicationFetcher = jest
                .spyOn(subventionsService, "getApplicationFetcher")
                .mockReturnValue(fn => spy(fn));
        });

        afterAll(() => {
            mockGetApplicationFetcher.mockRestore();
        });

        it("should throw an error if identifier is not valid", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => null);
            await expect(() => subventionsService.getDemandesByAssociation(IDENTIFIER)).rejects.toThrowError(
                AssociationIdentifierError,
            );
        });
        it("should return DemandeSubvention[]", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            await subventionsService.getDemandesByAssociation(IDENTIFIER);
            expect(mockGetApplicationFetcher).toHaveBeenCalledWith(subventionsService.getBySirenMethod);
        });
    });

    describe("getDemandesByEtablissement", () => {
        let mockGetApplicationFetcher;
        const spy = jest.fn();

        beforeAll(() => {
            mockGetApplicationFetcher = jest
                .spyOn(subventionsService, "getApplicationFetcher")
                .mockReturnValue(fn => spy(fn));
        });

        afterAll(() => {
            mockGetApplicationFetcher.mockRestore();
        });

        it.each`
            returnedType
            ${StructureIdentifiersEnum.siren}
            ${StructureIdentifiersEnum.rna}
        `("should throw an error if given a SIREN", ({ returnedType }) => {
            getIdentifierTypeMock.mockImplementationOnce(() => returnedType);
            expect(() => subventionsService.getDemandesByEtablissement(IDENTIFIER)).toThrowError(
                StructureIdentifiersError,
            );
        });

        it("should call getApplicationFetcher", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siret);
            await subventionsService.getDemandesByEtablissement(IDENTIFIER);
            expect(mockGetApplicationFetcher).toHaveBeenCalledWith(subventionsService.getBySiretMethod);
        });

        it("should fetch application by siret", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siret);
            await subventionsService.getDemandesByEtablissement(IDENTIFIER);
            expect(spy).toHaveBeenCalledWith(IDENTIFIER);
        });
    });

    describe("getApplicationFetcher", () => {
        it("should return method than call given function", () => {
            const appFetcher = subventionsService.getApplicationFetcher(subventionsService.getBySirenMethod);
            appFetcher(IDENTIFIER);
            expect(providers.demandesSubventionsProviders[0][subventionsService.getBySirenMethod]).toHaveBeenCalledWith(
                IDENTIFIER,
            );
        });
    });
});
