import { FormatDateError, ObsoleteDateError, OutOfRangeDateError } from "core";
import * as CliHelper from "./CliHelper";

describe("CliHelper", () => {
    describe("validateDate()", () => {
        it.each`
            date
            ${"23-01-2025"}
            ${"23-01--2025"}
            ${"A23-01-2025"}
        `("throws error if date format is invalid", () => {
            expect(() => CliHelper.validateDate("23-01-2025")).toThrowError(FormatDateError);
        });

        it("throws error if date is < 2018", () => {
            expect(() => CliHelper.validateDate("2017-01-01")).toThrowError(ObsoleteDateError);
        });

        it("throws error if date is greater than today", () => {
            const today = new Date("2025-01-01");
            const tomorrowStr = "2025-01-02";
            jest.useFakeTimers().setSystemTime(today);
            expect(() => CliHelper.validateDate(tomorrowStr)).toThrowError(OutOfRangeDateError);
            jest.useRealTimers();
        });
    });
});
