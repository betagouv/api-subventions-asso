import { SCDL_MAPPER } from "./scdl.mapper";
import { ParserInfo } from "../../../@types";

describe("scdl mapper", () => {
    describe("exercise adapter", () => {
        const adapter = (SCDL_MAPPER.exercice as ParserInfo<any>).adapter as (v: any) => any;

        it("returns undefined if falsy value", () => {
            const actual = adapter("");
            expect(actual).toBeUndefined();
        });

        it("returns year directly if given directly", () => {
            const actual = adapter(2023);
            expect(actual).toBe(2023);
        });

        it("returns year from excel-shaped date", () => {
            const actual = adapter(44941);
            expect(actual).toBe(2023);
        });

        it("returns year from string iso date", () => {
            const actual = adapter("2023-01-02");
            expect(actual).toBe(2023);
        });
    });

    describe("amount adapter", () => {
        const adapter = (SCDL_MAPPER.amount as ParserInfo<any>).adapter as (v: any) => any;

        it("only keeps numbers from string", () => {
            const actual = adapter("2 098.56");
            expect(actual).toBe(2098.56);
        });
    });
});
