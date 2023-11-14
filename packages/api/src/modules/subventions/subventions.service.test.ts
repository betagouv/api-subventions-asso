import subventionsService from "./subventions.service";
import * as IdentifierHelper from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import * as providers from "../providers";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import StructureIdentifiersError from "../../shared/errors/StructureIdentifierError";
import associationsService from "../associations/associations.service";

jest.mock("../providers/index");
jest.mock("../associations/associations.service");

const PROVIDERS_DEFAULT = providers.default;

const getIdentifierTypeMock = jest.spyOn(IdentifierHelper, "getIdentifierType");

const IDENTIFIER = "IDENTIFIER";

describe("SubventionsService", () => {
    afterEach(() => {
        // @ts-expect-error: mock
        // eslint-disable-next-line import/namespace
        providers.default = PROVIDERS_DEFAULT;
    });

    describe("getDemandesByAssociation()", () => {
        beforeAll(() => {
            getIdentifierTypeMock.mockReturnValue(StructureIdentifiersEnum.siren);
            jest.mocked(associationsService.validateIdentifierFromAsso).mockResolvedValue(undefined);
        });

        afterAll(() => {
            getIdentifierTypeMock.mockReset();
            jest.mocked(associationsService.validateIdentifierFromAsso).mockReset();
        });

        it("should throw an error if identifier is not valid", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => null);
            await expect(() => subventionsService.getDemandesByAssociation(IDENTIFIER)).rejects.toThrowError(
                AssociationIdentifierError,
            );
        });

        it("should return DemandeSubvention[]", async () => {
            const expected = [{}, {}];
            const flux = await subventionsService.getDemandesByAssociation(IDENTIFIER);
            const actual = (await flux.toPromise()).map(fs => fs.subventions || []).flat();
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandesByEtablissement", () => {
        beforeAll(() => {
            getIdentifierTypeMock.mockReturnValue(StructureIdentifiersEnum.siret);
            jest.mocked(associationsService.validateIdentifierFromAsso).mockResolvedValue(undefined);
        });

        afterAll(() => {
            getIdentifierTypeMock.mockReset();
            jest.mocked(associationsService.validateIdentifierFromAsso).mockReset();
        });

        it("should throw an error if given a SIREN", () => {
            getIdentifierTypeMock.mockReturnValueOnce(StructureIdentifiersEnum.siren);
            expect(async () => await subventionsService.getDemandesByEtablissement(IDENTIFIER)).rejects.toThrowError(
                StructureIdentifiersError,
            );
        });

        it("should throw an error if given a RNA", () => {
            getIdentifierTypeMock.mockReturnValueOnce(StructureIdentifiersEnum.rna);
            expect(async () => await subventionsService.getDemandesByEtablissement(IDENTIFIER)).rejects.toThrowError(
                StructureIdentifiersError,
            );
        });

        it("should check that identifier comes from an association", async () => {
            await subventionsService.getDemandesByAssociation(IDENTIFIER);
            expect(associationsService.validateIdentifierFromAsso).toHaveBeenCalledWith(
                IDENTIFIER,
                StructureIdentifiersEnum.siret,
            );
        });

        it("should return DemandeSubvention[]", async () => {
            const expected = [{}, {}];
            const flux = await subventionsService.getDemandesByEtablissement(IDENTIFIER);
            const actual = (await flux.toPromise()).map(fs => fs.subventions || []).flat();
            expect(actual).toEqual(expected);
        });
    });
});
