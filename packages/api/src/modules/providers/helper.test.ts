import { toStatusFactory } from "./helper";
import { ApplicationStatus } from "@api-subventions-asso/dto";

describe("toStatusFactory", () => {
    const PROVIDER_STATUS = "tata";
    const statusMap = {
        [ApplicationStatus.GRANTED]: ["toto", PROVIDER_STATUS],
        [ApplicationStatus.REFUSED]: ["titi"]
    };
    const helper = toStatusFactory(statusMap);

    it("finds proper status", () => {
        const expected = ApplicationStatus.GRANTED;
        const actual = helper(PROVIDER_STATUS);
        expect(actual).toBe(expected);
    });

    it("returns unknown if no match found", () => {
        const expected = ApplicationStatus.UNKNWON;
        const actual = helper("I am nowhere");
        expect(actual).toBe(expected);
    });
});
