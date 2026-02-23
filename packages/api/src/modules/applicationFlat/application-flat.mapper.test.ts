import { DemandeSubvention } from "dto";
import { DBO, DRAFT_ENTITY, APPLICATION_LINK_TO_CHORUS } from "./__fixtures__";
import ApplicationFlatMapper from "./application-flat.mapper";
import applicationFlatService from "./applicationFlat.service";
import Siret from "../../identifierObjects/Siret";
import EstablishmentIdentifier from "../../identifierObjects/EstablishmentIdentifier";

jest.mock("../../identifierObjects/EstablishmentIdentifier");
jest.mock("./applicationFlat.service");

describe("ApplicationFlatAdapter", () => {
    beforeAll(() => {
        jest.spyOn(EstablishmentIdentifier, "buildIdentifierFromString").mockReturnValue(
            APPLICATION_LINK_TO_CHORUS.beneficiaryEstablishmentId,
        );
    });

    describe("rawToApplication", () => {
        const expected = "adapted" as unknown as DemandeSubvention;
        it("returns res from toDemandeSubvention", () => {
            const toDemandeSubvSpy = jest
                .spyOn(ApplicationFlatMapper, "rawToApplication")
                .mockReturnValueOnce(expected);
            const actual = ApplicationFlatMapper.rawToApplication({
                provider: "",
                type: "application",
                data: APPLICATION_LINK_TO_CHORUS,
            });
            expect(actual).toBe(expected);
            toDemandeSubvSpy.mockReset();
        });
    });

    describe("toDemandeSubvention", () => {
        it("returns null if no siret", () => {
            jest.mocked(applicationFlatService.getSiret).mockReturnValueOnce(undefined);
            const actual = ApplicationFlatMapper.toDemandeSubvention(APPLICATION_LINK_TO_CHORUS);
            expect(actual).toBeNull();
        });

        it("adapts properly", () => {
            jest.mocked(applicationFlatService.getSiret).mockReturnValueOnce(new Siret("12345678901234"));
            const actual = ApplicationFlatMapper.toDemandeSubvention(APPLICATION_LINK_TO_CHORUS);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("buildEntity", () => {
        it("returns entity with ids", () => {
            const expected = APPLICATION_LINK_TO_CHORUS;
            const actual = ApplicationFlatMapper.buildEntity(DRAFT_ENTITY);
            expect(actual).toEqual(expected);
        });
    });

    describe("dboToEntity", () => {
        it("returns entity", () => {
            const expected = APPLICATION_LINK_TO_CHORUS;
            const actual = ApplicationFlatMapper.dboToEntity(DBO);
            expect(actual).toEqual(expected);
        });
    });

    describe("entityToDbo", () => {
        it("return dbo", () => {
            const { _id, ...expected } = DBO;
            const actual = ApplicationFlatMapper.entityToDbo(APPLICATION_LINK_TO_CHORUS);
            expect(actual).toEqual(expected);
        });
    });
});
