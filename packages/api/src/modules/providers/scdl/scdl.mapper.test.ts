import { SCDL_MAPPER } from "./scdl.mapper";
import { ParserInfo } from "../../../@types";

describe("scdl mapper", () => {
    describe("allocatorSiret adapter", () => {
        const adapter = (SCDL_MAPPER.allocatorSiret as ParserInfo).adapter as (v: unknown) => unknown;

        it("returns siret directly if given directly", () => {
            const actual = adapter("23450002300028");
            expect(actual).toBe("23450002300028");
        });

        it("returns siret without decimals if present", () => {
            const actual = adapter("23450002300028.0");
            expect(actual).toBe("23450002300028");
        });

        it("returns siret without decimals if present with more precision", () => {
            const actual = adapter("23450002300028.00");
            expect(actual).toBe("23450002300028");
        });

        it("returns siret without point if present", () => {
            const actual = adapter("23450002300028.");
            expect(actual).toBe("23450002300028");
        });
    });

    describe("associationSiret adapter", () => {
        const adapter = (SCDL_MAPPER.associationSiret as ParserInfo).adapter as (v: unknown) => unknown;

        it("returns siret directly if given directly", () => {
            const actual = adapter("23450002300028");
            expect(actual).toBe("23450002300028");
        });

        it("returns siret without decimals if present", () => {
            const actual = adapter("23450002300028.0");
            expect(actual).toBe("23450002300028");
        });

        it("returns siret without decimals if present with more precision", () => {
            const actual = adapter("23450002300028.00");
            expect(actual).toBe("23450002300028");
        });

        it("returns siret without point if present", () => {
            const actual = adapter("23450002300028.");
            expect(actual).toBe("23450002300028");
        });
    });

    describe("exercise adapter", () => {
        const adapter = (SCDL_MAPPER.exercice as ParserInfo).adapter as (v: unknown) => unknown;

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
        const adapter = (SCDL_MAPPER.amount as ParserInfo).adapter as (v: unknown) => unknown;

        it("only keeps numbers from string", () => {
            const actual = adapter("2 098.56");
            expect(actual).toBe(2098.56);
        });
    });

    describe("decisionReference adapter", () => {
        const adapter = (SCDL_MAPPER.decisionReference as ParserInfo<string | number>).adapter as (
            v: unknown,
        ) => unknown;

        it("return date from excel date", () => {
            const actual = adapter(45628.541666666664);
            expect(actual).toBe("2024-12-02");
        });

        it("return number if not in date range", () => {
            const actual = adapter(3650);
            expect(actual).toBe(3650);
        });

        it("returns string as it is", () => {
            const actual = adapter("23-B0284-001");
            expect(actual).toBe("23-B0284-001");
        });

        it.each`
            value
            ${null}
            ${undefined}
        `("returns undefined if value is not defined", ({ value }) => {
            const actual = adapter(value);
            expect(actual).toBe(undefined);
        });
    });
});
