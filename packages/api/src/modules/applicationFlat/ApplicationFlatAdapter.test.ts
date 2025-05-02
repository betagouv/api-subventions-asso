import { DemandeSubvention } from "dto";
import { DRAFT, ENTITY } from "./__fixtures__";
import ApplicationFlatAdapter from "./ApplicationFlatAdapter";
import applicationFlatService from "./applicationFlat.service";
import { ObjectId } from "mongodb";
import Siret from "../../valueObjects/Siret";

jest.mock("./applicationFlat.service");

describe("ApplicationFlatAdapter", () => {
    describe("rawToApplication", () => {
        const expected = "adapted" as unknown as DemandeSubvention;
        it("returns res from toDemandeSubvention", () => {
            const toDemandeSubvSpy = jest
                .spyOn(ApplicationFlatAdapter, "rawToApplication")
                .mockReturnValueOnce(expected);
            const actual = ApplicationFlatAdapter.rawToApplication({ provider: "", type: "application", data: ENTITY });
            expect(actual).toBe(expected);
            toDemandeSubvSpy.mockReset();
        });
    });

    describe("toDemandeSubvention", () => {
        it("returns null if no siret", () => {
            jest.mocked(applicationFlatService.getSiret).mockReturnValueOnce(undefined);
            const actual = ApplicationFlatAdapter.toDemandeSubvention(ENTITY);
            expect(actual).toBeNull();
        });

        it("adapts properly", () => {
            jest.mocked(applicationFlatService.getSiret).mockReturnValueOnce(new Siret("12345678901234"));
            const actual = ApplicationFlatAdapter.toDemandeSubvention(ENTITY);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("buildEntity", () => {
        it("returns entity with ids", () => {
            const expected = ENTITY;
            const actual = ApplicationFlatAdapter.buildEntity(DRAFT);
            expect(actual).toEqual(expected);
        });
    });

    describe("dboToEntity", () => {
        it("removes _id", () => {
            const expected = ENTITY;
            const actual = ApplicationFlatAdapter.dboToEntity({ ...ENTITY, _id: new ObjectId() });
            expect(actual).toEqual(expected);
        });
    });
});
