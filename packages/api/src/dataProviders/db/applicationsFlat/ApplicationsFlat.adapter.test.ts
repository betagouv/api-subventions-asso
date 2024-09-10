import { ObjectId } from "mongodb";
import { APPLICATIONS_FLAT_DBO, APPLICATIONS_FLAT_ENTITY } from "./__fixtures__/applicationsFlat.fixture";
import ApplicationsFlatAdapter from "./ApplicationsFlat.adapter";

describe("ApplicationsFlat Adapter", () => {
    describe("toDbo", () => {
        it("should return a ApplicationsFlatDbo", () => {
            const result = ApplicationsFlatAdapter.toDbo(APPLICATIONS_FLAT_ENTITY);
            expect(result).toEqual({ ...APPLICATIONS_FLAT_DBO, _id: expect.any(ObjectId) });
        });
    });
});
