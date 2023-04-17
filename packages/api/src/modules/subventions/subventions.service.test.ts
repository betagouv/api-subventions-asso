import subventionsService from "./subventions.service";
import * as IdentifierHelper from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import * as providers from "../providers";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import StructureIdentifiersError from "../../shared/errors/StructureIdentifierError";

jest.mock("../providers/index");

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
        it("should throw an error if identifier is not valid", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => null);
            await expect(() => subventionsService.getDemandesByAssociation(IDENTIFIER)).rejects.toThrowError(
                AssociationIdentifierError,
            );
        });
        it("should return DemandeSubvention[]", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            const expected = [{}, {}];
            const flux = await subventionsService.getDemandesByAssociation(IDENTIFIER);
            const actual = (await flux.toPromise()).map(fs => fs.subventions || []).flat();
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandesByEtablissement", () => {
        it("should throw an error if given a SIREN", () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            expect(() => subventionsService.getDemandesByEtablissement(IDENTIFIER)).toThrowError(
                StructureIdentifiersError,
            );
        });

        it("should throw an error if given a RNA", () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            expect(() => subventionsService.getDemandesByEtablissement(IDENTIFIER)).toThrowError(
                StructureIdentifiersError,
            );
        });

        it("should return DemandeSubvention[]", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siret);
            const expected = [{}, {}];
            const flux = await subventionsService.getDemandesByEtablissement(IDENTIFIER);
            const actual = (await flux.toPromise()).map(fs => fs.subventions || []).flat();
            expect(actual).toEqual(expected);
        });
    });
});
