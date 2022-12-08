import subventionsService from './subventions.service';
import * as IdentifierHelper from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from '../../@enums/StructureIdentifiersEnum';
import * as providers from '../providers';

jest.mock("../providers/index");

const PROVIDERS_DEFAULT = providers.default;

const getIdentifierTypeMock = jest.spyOn(IdentifierHelper, "getIdentifierType");

const IDENTIFIER = "IDENTIFIER";

describe("SubventionsService", () => {

    afterEach(() => {
        // @ts-expect-error: mock
        // eslint-disable-next-line import/namespace
        providers.default = PROVIDERS_DEFAULT;
    })

    describe("getDemandesByAssociation()", () => {
        it("should throw an error if identifier is not valid", async () => {
            const expected = "You must provide a valid SIREN or RNA";
            let actual;
            getIdentifierTypeMock.mockImplementationOnce(() => null);
            try {
                await subventionsService.getDemandesByAssociation(IDENTIFIER);
            } catch (e) {
                actual = (e as Error).message;
            }
            expect(actual).toEqual(expected);
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
        it("should throw an error if given a SIREN", async () => {
            const expected = "You must provide a valid SIRET";
            let actual;
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            try {
                await subventionsService.getDemandesByEtablissement(IDENTIFIER);
            } catch (e) {
                actual = (e as Error).message;
            }
            expect(actual).toEqual(expected);
        });

        it("should throw an error if given a RNA", async () => {
            const expected = "You must provide a valid SIRET";
            let actual;
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            try {
                await subventionsService.getDemandesByEtablissement(IDENTIFIER);
            } catch (e) {
                actual = (e as Error).message;
            }
            expect(actual).toEqual(expected);
        });

        it("should return DemandeSubvention[]", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siret);
            const expected = [{}, {}];
            const actual = await subventionsService.getDemandesByEtablissement(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });
})