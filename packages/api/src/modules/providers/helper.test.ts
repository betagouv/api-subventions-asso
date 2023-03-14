import { toStatusFactory } from "./helper";
import { ApplicationStatus } from "@api-subventions-asso/dto";

describe("toStatusFactory", () => {
    const PROVIDER_STATUS = "tata";
    const statusConversionArray = [
        { label: ApplicationStatus.GRANTED, providerStatusList: ["toto", PROVIDER_STATUS] },
        { label: ApplicationStatus.REFUSED, providerStatusList: ["titi"] }
    ];
    const helper = toStatusFactory(statusConversionArray);

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
