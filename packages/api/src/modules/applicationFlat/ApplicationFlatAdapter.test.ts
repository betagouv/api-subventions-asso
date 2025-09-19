import { DemandeSubvention } from "dto";
import { DBO, DRAFT_ENTITY, APPLICATION_LINK_TO_CHORUS } from "./__fixtures__";
import ApplicationFlatAdapter from "./ApplicationFlatAdapter";
import applicationFlatService from "./applicationFlat.service";
import Siret from "../../identifierObjects/Siret";

jest.mock("./applicationFlat.service");

describe("ApplicationFlatAdapter", () => {
    describe("rawToApplication", () => {
        const expected = "adapted" as unknown as DemandeSubvention;
        it("returns res from toDemandeSubvention", () => {
            const toDemandeSubvSpy = jest
                .spyOn(ApplicationFlatAdapter, "rawToApplication")
                .mockReturnValueOnce(expected);
            const actual = ApplicationFlatAdapter.rawToApplication({
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
            const actual = ApplicationFlatAdapter.toDemandeSubvention(APPLICATION_LINK_TO_CHORUS);
            expect(actual).toBeNull();
        });

        it("adapts properly", () => {
            jest.mocked(applicationFlatService.getSiret).mockReturnValueOnce(new Siret("12345678901234"));
            const actual = ApplicationFlatAdapter.toDemandeSubvention(APPLICATION_LINK_TO_CHORUS);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("buildEntity", () => {
        it("returns entity with ids", () => {
            const expected = APPLICATION_LINK_TO_CHORUS;
            const actual = ApplicationFlatAdapter.buildEntity(DRAFT_ENTITY);
            expect(actual).toEqual(expected);
        });
    });

    describe("dboToEntity", () => {
        it("returns entity", () => {
            const expected = APPLICATION_LINK_TO_CHORUS;
            const actual = ApplicationFlatAdapter.dboToEntity(DBO);
            expect(actual).toEqual(expected);
        });
    });
    describe("entityToDbo", () => {
        it("return dbo", () => {
            const { _id, ...expected } = DBO;
            const actual = ApplicationFlatAdapter.entityToDbo(APPLICATION_LINK_TO_CHORUS);
            expect(actual).toEqual(expected);
        });
    });
});
